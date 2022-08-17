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

    filters.excludeFromMapApp = false


    // We want to show the 'unselected' mints still visible in the 
    // list. So we don't filter out the other mints.
    if (filters.mint) {
      delete filters.mint
    }

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

    const unlocatedTypes = []

    // Sort the types by mints
    data.types.forEach(type => {

      if (!type.mint.location)
        unlocatedTypes.push(type)

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
      unlocatedTypes,
      types: data.types
    }
  }

  toMapObject(data, selection) {
    const geoJSON = []

    let patterns = this._buildHeirStripes(data, selection)
    //Build mint map and parse GeoJSON
    Object.values(data.mints).forEach(mint => {

      if (mint.location && mint.id) {
        const types = mint.data.types
        try {
          let locationData = JSON.parse(mint.location)
          locationData.data = {
            types,
            mint
          }

          //We sort the locationsdata so that the concentric circles
          // will be drawn on top of the locations markers.
          if (types.length > 0) {
            geoJSON.push(locationData)
          } else {
            geoJSON.unshift(locationData)
          }

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

    const { data, selected } = coinsToRulerData(
      feature.data.types,
      selections.selectedRulers,
      this.heirStripes
    );

    const selectionsActive = selections?.selectedMints?.length > 0

    let layer;
    if (data.length > 0 && (!selectionsActive || selections?.selectedMints?.indexOf(feature.data?.mint?.id) != -1)) {
      const concentricCirclesMarker = concentricCircles(latlng, data, {
        openPopup: function ({ data, groupData }) {
          return rulerPopup(groupData, data?.data);
        },
        innerRadius: this.settings.settings.innerRadius,
        radius: this.settings.settings.maxRadius,
        borderStyle: {
          stroke: true,
          weight: 1,
          color: '#fff',
          fill: false,
        },
      });

      const locationMarker = this.createMintLocationMarker(latlng, feature)
      const objects = [concentricCirclesMarker, locationMarker]


      let i = 0
      window.mylayer = {}
      objects.forEach(obj => window.mylayer[i++] = obj)

      layer = L.featureGroup(objects);
    } else {
      layer = this.createMintLocationMarker(latlng, feature)
      layer.bringToBack()
    }

    layer.selected = selected;
    layer.on('mouseover', () => {
      layer.bringToFront()
    });
    layer.on('click', () => {
      layer.bringToFront()
    });
    return layer
  }

  createMintLocationMarker(latlng, feature) {
    const mint = feature.data.mint
    const mlm = new MintLocationMarker(mint)
    const marker = mlm.create(latlng)
    marker.bindPopup(Mint.popupMintHeader(mint, ["underlined-header"]))
    return marker
  }
}


