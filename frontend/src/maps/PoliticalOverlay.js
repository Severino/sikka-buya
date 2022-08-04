import Mint from '../models/map/mint';
import Overlay, { OverlaySettings } from './Overlay';
import Query from '../database/query';
import { coinsToRulerData } from "../models/rulers"
import { rulerPopup } from '../models/map/political';
import { concentricCircles } from '../maps/graphics/ConcentricCircles';


export class PoliticalOverlaySettings extends OverlaySettings {
  constructor(window) {
    super("sikka-buya-political-overlay-settings", window)
  }

  get defaultSettings() {
    const parentSettings = super.defaultSettings
    return Object.assign({}, parentSettings, {
      innerRadius: 0,
      maxRadius: 20,
      maxRadiusMinimum: 10,
      maxRadiusMaximum: 100
    })
  }
}

export default class PoliticalOverlay extends Overlay {

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

    // Sort the types by mints
    data.types.forEach(type => {
      const mintId = type?.mint?.id
      if (mintId) {
        if (!availableMints[mintId]) {
          availableMints[mintId] = type.mint
          availableMints[mintId].data = {
            types: []
          }
        }

        availableMints[mintId].data.types.push(type)
        const rulersOnType = [...type.overlords, ...type.issuers]
        if (type.caliph) rulersOnType.push(type.caliph)
        rulersOnType.forEach(person => {
          rulers[person.id] = person
        })
      }
    })

    let mints = data.mint.map(mint => {
      if (!mint.province)
        mint.province = { name: null, id: -1 }

      if (!mint.province.name) {
        mint.province.name = "Provinzlos"
      }
      return mint
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
      persons
    }
  }

  toGeoJSON(data) {
    const geoJSON = []
    //Build mint map and parse GeoJSON
    Object.values(data.availableMints).forEach(mint => {
      if (mint.location && mint.id) {
        try {
          let locationData = JSON.parse(mint.location)
          locationData.data = {
            types: mint.data.types
          }
          geoJSON.push(locationData)
        } catch (e) { console.error("Could not parse locaton", e) /* If location is invalid, we don't care.*/ }
      }
    })

    return geoJSON
  }

  createMarker(latlng, feature, {
    markerOptions = {},
    selections = {}
  } = {}) {
    const { data, selected } = coinsToRulerData(
      feature.data.types,
      selections.selectedRulers,
      // patterns
    );

    const featureGroup = concentricCircles(latlng, data, {
      openPopup: function ({ data, groupData }) {
        return rulerPopup(groupData, data?.data);
      },
      innerRadius: this.settings.get("innerRadius"),
      radius: this.settings.get("maxRadius"),
      borderStyle: {
        stroke: true,
        weight: 1.5,
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

    featureGroup.selected = selected;
    featureGroup.on('mouseover', () => featureGroup.bringToFront());
    featureGroup.on('click', () => featureGroup.bringToFront());
    return featureGroup;
  }


}
