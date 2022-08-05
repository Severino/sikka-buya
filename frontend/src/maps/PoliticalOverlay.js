import L from "leaflet"
import Mint from '../models/map/mint';
import Overlay from './Overlay';
import Query from '../database/query';
import { coinsToRulerData } from "../models/rulers"
import { rulerPopup } from '../models/map/political';
import { concentricCircles } from '../maps/graphics/ConcentricCircles';
import Color from '../utils/Color';
import { MintLocationMarker } from '../models/mintlocation';


export default class PoliticalOverlay extends Overlay {

  constructor(parent, settings, {
    onDataTransformed = null,
    onGeoJSONTransform = null,
  } = {}) {
    super(parent, settings, {
      onDataTransformed,
      onGeoJSONTransform,
    })
    this.heirStripes = {}
  }


  async fetch(filters) {
    if (isNaN(filters.yearOfMint)) throw new Error('Invalid yearOfMint filter!');


    const pagination = {
      page: 0,
      count: 100000
    }


    const result = await Query.raw(
      `query ($pagination: Pagination, $filters: TypeFilter) {
      
                person {
                  id
                  name
                  shortName
                  color
                  dynasty {
                    id
                    name
                  }
                }
                  ${Mint.mintGraphQL()}    
  
                  coinType(pagination: $pagination, filters: $filters){
                    types{
                    id
                    projectId
                    material {name}
                    donativ
                    procedure
                    nominal {name}
                    mintAsOnCoin
                    caliph {
                      name,
                      shortName
                      id
                      color
                      dynasty{
                        id,name
                      }
                    }
                    mint {
                      id
                      name
                      location
                      uncertain
                      province {
                        id
                        name
                      }
                    },
                    issuers {
                      id
                      name
                      shortName
                      color
                      dynasty{
                        id,name
                      }
                    }
                    overlords {
                      id
                      name
                      shortName
                      rank
                      color
                      dynasty{
                        id,name
                      }
                    }
                    otherPersons {
                    id
                    shortName
                    name
                    color
                    role {
                      id
                      name
                    }
                    dynasty {
                      id
                      name
                    }
                  }
                    excludeFromTypeCatalogue
                  }
                  }
                
              }`,
      {
        pagination,
        filters
      })

    return result.data.data
  }

  transform(data) {
    data.types = data.coinType.types
    delete data.coinType

    let availableMints = {}
    let rulers = {}

    let mintMap = {}
    let mints = data.mint.map(mint => {
      mintMap[mint.id] = mint
      if (!mint.province)
        mint.province = { name: null, id: -1 }

      if (!mint.province.name) {
        mint.province.name = "Provinzlos"
      }

      if (!mint.data) mint.data = {}
      mint.data.types = []
      return mint
    })

    // Sort the types by mints
    data.types.forEach(type => {
      const mintId = type?.mint?.id
      if (mintId) {
        if (!availableMints[mintId]) {
          availableMints[mintId] = mintMap[mintId]
        }

        availableMints[mintId].data.types.push(type)
        const rulersOnType = [...type.overlords, ...type.issuers]
        if (type.caliph)
          rulersOnType.push(type.caliph)


        type.otherPersons.forEach(person => {
          if (person.role) {
            type[person.role.name] = person

            if (person.role.name === "heir") {
              rulersOnType.push(person)
            }
          } else {
            console.warn("No role found on other person!", person)
          }
        })

        rulersOnType.forEach(person => {
          rulers[person.id] = person
        })
      }

    })

    let unavailableMints = [];
    for (let mint of Object.values(data.mint)) {
      if (!availableMints[mint.id]) {
        unavailableMints.push(mint);
      }
    }

    const persons = data.person.reduce((obj, person) => {
      obj[person.id] = person
      return obj
    }, {})

    return {
      mints,
      availableMints: Object.values(availableMints),
      unavailableMints,
      rulers,
      persons,
      types: data.types
    }
  }

  toMapObject(data, selection) {
    const geoJSON = []

    let patterns = this._buildHeirStripes(data, selection)
    //Build mint map and parse GeoJSON
    Object.values(data.mints).forEach(mint => {
      if (mint.location && mint.id) {
        try {
          let locationData = JSON.parse(mint.location)
          locationData.data = {
            types: mint.data.types,
            mint
          }
          geoJSON.push(locationData)
        } catch (e) { console.error("Could not parse locaton", e) /* If location is invalid, we don't care.*/ }
      }
    })

    return { geoJSON, patterns }
  }

  _buildHeirStripes(data, { selectedRulers = {} } = {}) {
    this._heirStripesToArray(this.heirStripes).forEach(pattern => pattern.remove())
    this.heirStripes = {}

    data.types.forEach(type => {
      const { heir, caliph } = type
      if (heir != null && caliph != null && !(this.heirStripes?.[heir.id]?.[caliph.id])) {

        let caliphColor = (caliph.color) ? caliph.color : Color.MissingColor
        let heirColor = (heir.color) ? heir.color : Color.MissingColor

        if (selectedRulers.length > 0) {
          caliphColor = (selectedRulers.indexOf(caliph.id) !== -1) ? caliphColor : Color.InactiveColor
          heirColor = (selectedRulers.indexOf(heir.id) !== -1) ? heirColor : Color.InactiveColor
        }

        const stripes = new L.StripePattern({
          color: caliphColor,
          spaceColor: heirColor,
          opacity: 1,
          spaceOpacity: 1,
          weight: 7,
          angle: -45,
        });
        if (!this.heirStripes[caliph.id])
          this.heirStripes[caliph.id] = {};
        this.heirStripes[caliph.id][heir.id] = stripes;
      }
    })
    return this._heirStripesToArray(this.heirStripes)

  }

  _heirStripesToArray() {
    let arr = []
    Object.values(this.heirStripes).forEach(caliphMap => {
      Object.values(caliphMap).forEach(pattern => {
        arr.push(pattern)
      })
    })
    return arr
  }


  createMarker(latlng, feature, {
    markerOptions = {},
    selections = {}
  } = {}) {

    const mlm = new MintLocationMarker(feature.data.mint)
    const locationMarker = mlm.create(latlng)

    const { data, selected } = coinsToRulerData(
      feature.data.types,
      selections.selectedRulers,
      this.heirStripes
    );

    const concentricCirclesMarker = concentricCircles(latlng, data, {
      openPopup: function ({ data, groupData }) {
        return rulerPopup(groupData, data?.data);
      },
      innerRadius: this.settings.innerRadius,
      radius: this.settings.maxRadius,
      borderStyle: {
        stroke: true,
        weight: 1,
        color: '#fff',
        fill: false,
      },
    });

    // if (feature?.coins?.length > 0) {
    //   const mintFeature = {
    //     mint: feature.coins[0].mint,
    //   };

    //   const mintLocations = new MintLocation({
    //     markerOptions: mintMarkerOptions,
    //   });
    //   mintLocations
    //     .createMarker(latlng, mintFeature)
    //     .addTo(featureGroup);
    // }
    const featureGroup = L.featureGroup([locationMarker, concentricCirclesMarker]);
    featureGroup.selected = selected;
    featureGroup.on('mouseover', () => featureGroup.bringToFront());
    featureGroup.on('click', () => featureGroup.bringToFront());
    return featureGroup
  }


}
