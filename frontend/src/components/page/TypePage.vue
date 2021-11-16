<template>
  <div class="type">
    <div class="container">
      <section class="left-properties">
        <div class="property-row">
          <div class="title-group">
            <h1>
              {{ this.getTypeProperty('projectId') }}
            </h1>
            <div class="subtitle">
              {{ this.getTypeProperty('treadwellId') }}
            </div>
          </div>

          <labeled-property :label="$tc('property.mint')">
            {{ this.getTypePropertyKey('mintAsOnCoin') }}
          </labeled-property>
          <labeled-property :label="$tc('property.material')">{{
            this.getTypePropertyKey('material')
          }}</labeled-property>
          <labeled-property :label="$tc('property.nominal')">
            {{ this.getTypePropertyKey('nominal') }}
          </labeled-property>
          <labeled-property :label="$tc('property.year')">
            {{ this.getTypePropertyKey('yearOfMint') }}
          </labeled-property>
        </div>

        <section class="leader-section">
          <labeled-property
            :label="$tc('property.issuer', type.issuers.length)"
            v-if="this.type.issuers.length > 0"
          >
            <ul>
              <li v-for="(issuer, idx) of type.issuers" :key="idx">
                {{ issuer.person.name }}
              </li>
            </ul>
          </labeled-property>

          <labeled-property
            v-if="this.type.overlords.length > 0"
            :label="$tc('property.overlord', this.type.overlords.length)"
          >
            <ol>
              <li
                v-for="overlord of this.type.overlords"
                :key="`overlord-${overlord.id}`"
              >
                {{ overlord.name }}
              </li>
            </ol>
          </labeled-property>

          <labeled-property :label="$tc('role.caliph')">
            {{ this.getTypePropertyKey('caliph') }}
          </labeled-property>
        </section>

        <labeled-property
          v-if="this.type.otherPersons.length > 0"
          :label="$tc('property.otherPerson', this.type.otherPersons.length)"
        >
          <ol>
            <li
              v-for="otherPerson of this.type.otherPersons"
              :key="`otherPerson-${otherPerson.id}`"
            >
              {{ otherPerson.person.name }}
            </li>
          </ol>
        </labeled-property>
      </section>

      <section class="coin-side-properties">
        <Tabulated :tabs="[$t('property.avers'), $t('property.revers')]">
          <template v-slot:1>
            <coin-side-group :value="type.avers" />
          </template>
          <template v-slot:2>
            <coin-side-group :value="type.revers" />
          </template>
        </Tabulated>
      </section>
    </div>

    <div class="labeled-group">
      <h3>{{ $t('property.cursive_script') }}</h3>
      {{ type.cursiveScript ? $t('general.yes') : $t('general.no') }}
    </div>

    <div class="labeled-group">
      <h3>{{ $tc('property.coin_mark', 2) }}</h3>
      <p v-if="type.coinMarks || type.coinMarks.length == 0">
        {{ $t('message.no_pieces_in_list') }}
      </p>
      <ul>
        <li
          v-for="(coinMark, index) of type.coinMarks"
          :key="`coinMark-${index}`"
        >
          <a :href="coinMark">{{ coinMark }}</a>
        </li>
      </ul>
    </div>

    <div class="labeled-group">
      <h3>{{ $t('property.pieces') }}</h3>
      <p v-if="type.pieces || type.pieces.length == 0">
        {{ $t('message.no_pieces_in_list') }}
      </p>
      <ul>
        <li v-for="(piece, index) of type.pieces" :key="`piece-${index}`">
          <a :href="piece">{{ piece }}</a>
        </li>
      </ul>
    </div>
    <div class="labeled-group">
      <h3>{{ $t('property.specials') }}</h3>
      <div v-html="type.specials" />
    </div>
  </div>
</template>

<script>
import CoinSideGroup from '../display/CoinSideGroup.vue';
import LabeledProperty from '../display/LabeledProperty.vue';
import Tabulated from '../layout/Tabulated.vue';
import Query from '/src/database/query.js';
export default {
  components: { LabeledProperty, Tabulated, CoinSideGroup },
  name: 'TypePage',
  data: function () {
    return {
      navigationGuard: null,
      type: {
        id: null,
        projectId: '',
        treadwellId: '',
        mint: { id: null, name: '' },
        mintAsOnCoin: '',
        material: { id: null, name: '' },
        nominal: { id: null, name: '' },
        yearOfMint: '',
        donativ: false,
        procedure: 'pressed',
        issuers: [],
        overlords: [],
        otherPersons: [],
        caliph: { id: null, name: '', role: null },
        avers: {
          fieldText: '',
          innerInscript: '',
          intermediateInscript: '',
          outerInscript: '',
          misc: '',
        },
        reverse: {
          fieldText: '',
          innerInscript: '',
          intermediateInscript: '',
          outerInscript: '',
          misc: '',
        },
        cursiveScript: false,
        coinMarks: [],
        pieces: [],
        specials: '',
      },
    };
  },
  created: function () {
    Query.raw(
      `{
            getCoinType(id:${this.$route.params.id}){
               {
                id
                projectId
                treadwellId
                mint {
                  id,
                  name
                }
                mintAsOnCoin
                mintUncertain
                material {
                  id,
                  name
                }
                nominal {
                  id,
                  name
                }
                yearOfMint
                yearUncertain
                donativ
                procedure
                issuers {
                  id
                  person {
                    id,
                    name,
                    role {
                      id, name
                    }
                  }
                  titles {
                    id,
                    name
                  }
                  honorifics{
                    id,
                    name}
                }
                overlords {
                  id
                  rank
                    name,
                    role {
                      id, name
                    }
                  titles {
                    id,
                    name
                  }
                  honorifics{
                    id,
                    name}
                }
                otherPersons {
                  id
                  name
                  role {
                    id, name
                  }
                }
                caliph {
                  id
                  name
                  role {
                    id, name
                  }
                }
                avers {
                  fieldText
                  innerInscript
                  intermediateInscript
                  outerInscript
                  misc
                }
                reverse {
                  fieldText
                  innerInscript
                  intermediateInscript
                  outerInscript
                  misc
                }
                cursiveScript
                coinMarks {
                  id
                  name
                }
                literature
                pieces
                specials
                excludeFromTypeCatalogue
                excludeFromMapApp
                internalNotes
        }
      }`
    )
      .then((result) => {
        Object.assign(this.type, result.data.data.getCoinType);
      })
      .catch(console.error);
  },
  methods: {
    getUndefinedString() {
      return 'Nicht Erfasst';
    },
    getTypeProperty(name) {
      if (!this.type || !this.type[name]) {
        return this.getUndefinedString();
      } else {
        return this.type[name];
      }
    },
    getTypePropertyKey: function (name, key = 'name') {
      let result = this.getTypeProperty(name);
      if (!result[key]) {
        return this.getUndefinedString();
      } else return result[key];
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 0;
}
</style>


<style lang="scss">
.left-properties {
  flex: 2;
  margin-right: 150px;
}

.coin-side-poperties {
  flex: 1;
}

.property-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  margin-bottom: 3rem;
}

.labeled-property {
  .label {
    color: #058005;
    text-transform: uppercase;
    font-size: 0.85rem;
    margin-bottom: 0;
  }
}

.container {
  display: flex;
}
</style>
