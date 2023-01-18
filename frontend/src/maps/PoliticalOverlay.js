import L from "leaflet"
import Mint from '../models/map/mint';
import Overlay from './Overlay';
import Query from '../database/query';
import { coinsToRulerData } from "../models/rulers"
import { rulerPopup } from '../models/map/political';
import { concentricCircles } from '../maps/graphics/ConcentricCircles';
import Color from '../utils/Color';
import { MintLocationMarker } from '../models/mintlocation';
import { ringsFromPersonMint } from './graphics/RulerRings';
import PersonMint from '../models/person-mint';


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
    // if (filters.mint) {
    //   delete filters.mint
    // }



    let result;
    if (filters.yearOfMint) {
      const pagination = {
        page: 0,
        count: 100000
      }

      const query = `query($filters: TypeFilter, $pagination: Pagination) {
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
          ${this.typeQuery()}
      }
        `

      result = await Query.raw(query, { pagination, filters }, true)

    } else {
      const query = `query ($persons:[ID], $mints: [ID]) {
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
        getPersonMints(mints: $mints, persons: $persons) {
          mint { id, name, location }
          caliphs {id shortName name color dynasty {id name } }
          issuers {id shortName name color dynasty {id name } }
          overlords {id shortName name color dynasty {id name } }
        }

          ${Mint.mintGraphQL()}  
      }
        `


      result = await Query.raw(query, {
        persons: filters.persons,
        mints: filters.mints
      }, true)
    }

    return result.data.data
  }


  transformCoinType(data, mintMap) {
    let availableMints = {}
    let rulers = {}
    const unlocatedTypes = []

    // Sort the types by mints
    data.forEach(type => {
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


    return {
      availableMints,
      rulers,
      unlocatedTypes,
      types: data
    }
  }

  transformPersonMints(data, mintMap) {
    let availableMints = {}
    let rulers = {}

    data.forEach(pm => {

      if (pm.mint && pm.mint.id) {

        if (!mintMap[pm.mint.id]) {
          console.warn("Excluded mint from person mints: ", pm.mint)
        } else if (pm.mint && (pm => pm.caliph.length > 0 || pm.issuers.length > 0 || pm.overlords.length > 0)) {

          mintMap[pm.mint.id].data.personMints = pm
          availableMints[pm.mint.id] = mintMap[pm.mint.id]
            ;[...pm.caliphs, ...pm.issuers, ...pm.overlords].forEach(person => {
              rulers[person.id] = person
            })
        }
      } else {
        console.warn("Excluded attribute 'personMint' for not having a valid mint object: ", pm)
      }
    })

    return {
      availableMints,
      rulers,
      personMints: data
    }
  }

  transformMints(data) {
    let mintMap = {}
    let mints = data.filter((mint) => {
      return (mint?.province?.id)
    }).map(mint => {
      mintMap[mint.id] = mint
      if (!mint.data) mint.data = {}
      mint.data.types = []
      mint.data.personMints = {
        issuers: [],
        overlords: [],
        caliphs: []
      }
      return mint
    })
    return { mints, mintMap }
  }

  transformPersons(data) {
    return data.reduce((obj, person) => {
      obj[person.id] = person
      return obj
    }, {})
  }

  transform(data) {
    let { mints, mintMap } = this.transformMints(data.mint)
    let persons = this.transformPersons(data.person)

    let types = [], personMints = [], unlocatedTypes = [], availableMints = {}, rulers = {}
    if (data.coinType) {
      this.mode = "year"
      data.types = data.coinType.types
      delete data.coinType
        ; ({ types, unlocatedTypes, availableMints, rulers } = this.transformCoinType(data.types, mintMap))
    } else if (data.getPersonMints) {
      this.mode = "no_year"
        ; ({ personMints, rulers, availableMints } = this.transformPersonMints(data.getPersonMints, mintMap))
    } else {
      throw new Error("Invalid response: require coinType or getPersonMints.")
    }

    let unavailableMints = [];
    for (let mint of Object.values(data.mint)) {
      if (!availableMints[mint.id]) {
        unavailableMints.push(mint);
      }
    }


    return {
      mints,
      availableMints: Object.values(availableMints),
      unavailableMints,
      rulers,
      persons,
      unlocatedTypes,
      types,
      personMints
    }
  }

  toMapObject(data, selection) {
    const geoJSON = []
    let patterns = this._buildHeirStripes(data, selection)
    //Build mint map and parse GeoJSON
    Object.values(data.mints).forEach(mint => {

      if (mint.location && mint.id) {
        try {
          let types = mint?.data?.types || []
          let personMints = mint?.data?.personMints || []


          mint.location.data = {
            types,
            personMints,
            mint
          }

          //We sort the locationsdata so that the concentric circles
          // will be drawn on top of the locations markers.
          if (types.length > 0) {
            geoJSON.push(mint.location)
          } else {
            geoJSON.unshift(mint.location)
          }

        } catch (e) { console.error("Could not parse location", e) /* If location is invalid, we don't care.*/ }
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
          caliphColor = (selectedRulers.indexOf(caliph.id) !== -1) ? caliphColor : Color.getInactiveColor()
          heirColor = (selectedRulers.indexOf(heir.id) !== -1) ? heirColor : Color.getInactiveColor()
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


  createMintTypesMarker(latlng, feature, {
    selections = {}
  } = {}) {

    const { data, selected } = coinsToRulerData(
      feature.data.types,
      {
        selected: selections.selectedRulers,
        patterns: this.heirStripes,
        options: this.settings.settings
      }
    );

    const selection = selections?.selectedMints
    const mint = feature.data?.mint
    const isMintSelected = this.isSelected(mint, selection)

    let layer;
    if (data.length > 0 && (!this.isSelectionActive(selection) || isMintSelected)) {
      const concentricCirclesMarker = concentricCircles(latlng, data, {
        openPopup: function ({ data, groupData }) {
          return rulerPopup(groupData, data?.data);
        },
        innerRadius: MintLocationMarker.defaultSize,
        radius: this.settings.settings.maxRadius,
        borderStyle: {
          stroke: true,
          weight: 1,
          color: '#fff',
          fill: false,
        },
      });



      /**
       * The consistency of keeping the selected mints in the year view,
       * was intentionally removed by request of the numismatics 
       * //14-12-2022
       */
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

    return layer
  }

  createMintWithoutYearMarker(latlng, feature, {
    selections = {}
  } = {}) {
    let layer;
    let innerRadius = MintLocationMarker.defaultSize
    let spacing = this.settings.settings.maxRadius / 15
    let stroke = 2

    let personMint = feature.data?.personMints || new PersonMint()

    const isMintSelected = this.isSelected(feature.data.mint, selections.selectedMints)

    if (!PersonMint.isEmpty(personMint)
      && (!this.isSelectionActive(selections.selectedMints) || isMintSelected)
      && PersonMint.containsSelectedRulers(personMint, selections.selectedRulers)) {

      layer = ringsFromPersonMint(latlng, feature, selections, {
        innerRadius,
        radius: this.settings.settings.maxRadius,
        spacing,
        stroke
      })

      this.createMintLocationMarker(latlng, feature, { active: isMintSelected }).addTo(layer)
      layer.bringToFront()
    } else {
      layer = this.createMintLocationMarker(latlng, feature, { active: isMintSelected })
      layer.bringToBack()
    }

    return layer
  }

  isSelected(obj, selection) {
    return selection.indexOf(obj.id) != -1
  }

  isSelectionActive(selections) {
    return (selections.length !== 0)
  }


  createMarker(latlng, feature, {
    selections = {}
  } = {}) {

    let layer;
    if (this.mode === "year") {
      layer = this.createMintTypesMarker(...arguments)
    } else if (this.mode === "no_year") {
      layer = this.createMintWithoutYearMarker(...arguments)
    } else {
      throw new Error(`Marker mode is not implemented: ${this.mode}`)
    }

    layer.on('mouseover', () => {
      layer.bringToFront()
    });
    layer.on('click', () => {
      layer.bringToFront()
    });

    return layer
  }

  createMintLocationMarker(latlng, feature, options) {
    const mint = feature.data.mint
    const mlm = new MintLocationMarker(mint)
    const marker = mlm.create(latlng, options)
    marker.bindPopup(Mint.popupMintHeader(mint, ["underlined-header"]))
    return marker
  }


  typeQuery() {
    return `coinType(pagination: $pagination, filters: $filters){
      types{
          id
          projectId
      material { name }
          donativ
          procedure
      nominal { name }
          mintAsOnCoin
      caliph {
            name,
              shortName
            id
            color
        dynasty{
              id, name
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
              id, name
            }
          }
      overlords {
            id
            name
            shortName
            rank
            color
        dynasty{
              id, name
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
          excludeFromMapApp
        }
      }`
  }
}


