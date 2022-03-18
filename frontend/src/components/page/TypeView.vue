<template>
  <div class="type-view">
    <h1 class="gm2 gd2">{{ type.projectId }}</h1>

    <div v-if="type.donativ" class="box gt4 gd2">
      <div>Geschenkmünze</div>
    </div>
    <div v-else class="blank gt4 gd2"></div>

    <div v-if="type.procedure != 'pressed'" class="box gt4 gd2">
      <div>gegossen</div>
    </div>
    <div v-else class="blank gt4 gd2"></div>

    <router-link
      v-if="$store.state.user"
      id="edit-button"
      :to="{ name: 'EditType', params: { id: type.id } }"
    >
      <button type="button">
        <EditIcon />
      </button>
    </router-link>

    <div class="property gm2 gd2">
      <catalog-property :label="mapText('mint')">
        {{ type.mint.name }}
        <template v-if="type.mintUncertain">?</template>
      </catalog-property>
    </div>

    <div class="property gm2 gd2">
      <catalog-property :label="mapText('year')">
        {{ printTypeProperty('year') }}
        <template v-if="type.yearUncertain">?</template>
      </catalog-property>
    </div>
    <div class="property gm2 gd2">
      <catalog-property label="Prägeort wie auf Münze">
        {{ printTypeProperty('mintAsOnCoin') }}
      </catalog-property>
    </div>
    <div
      class="property gm2 gt4 gd4"
      v-for="(val, idx) of ['material', 'nominal']"
      v-bind:key="`property-${val}-${idx}`"
    >
      <catalog-property :label="mapText(val)">
        {{ printTypeProperty(val) }}</catalog-property
      >
    </div>

    <div class="person-container gm1 gt1 gd1">
      <person-view
        :overlords="type.overlords"
        :issuers="type.issuers"
        :caliph="type.caliph"
        :heir="heir"
      />
    </div>

    <div class="person-container gm1 gt1 gd1">
      <catalog-property v-if="cutter.length > 0" label="Stempelschneider">
        <person-list :value="cutter" />
      </catalog-property>

      <catalog-property
        v-if="warden.length > 0"
        :label="dynamicHeading('Münzwardein', 'Münzwardeien', warden)"
      >
        <person-list :value="warden" />
      </catalog-property>
    </div>

    <div
      v-for="(sideObj, sideIdx) in [
        { prop: 'avers', label: 'frontside', prefix: 'Avers-' },
        { prop: 'reverse', label: 'backside', prefix: 'Revers-' },
      ]"
      :key="`coin-sides-${sideIdx}`"
      class="coin-side avers gm1 gt2 gd2"
    >
      <catalog-property class="property coin-side-field">
        <catalog-property
          v-for="(val, idx) of getFilledFields(sideObj.prop)"
          :key="`property-${val}-${idx}`"
          :label="getCoinSideLabel(val, sideObj)"
        >
          <div v-html="type[sideObj.prop][val]"></div>
        </catalog-property>
      </catalog-property>
    </div>

    <catalog-property
      v-if="type.cursive"
      :label="$t('property.cursive')"
      class="coin-marks gm2"
    >
      {{ $t('general.yes') }}
    </catalog-property>

    <catalog-property
      v-if="htmlHasContent(type.specials)"
      :label="$t('property.specialities_and_variants')"
      :html="type.specials"
      class="gm1"
    >
      -
    </catalog-property>

    <div v-if="!type.literature" class="error">
      Literatur und Anmerkungen konnte nicht geladen werden
    </div>
    <catalog-property
      v-else-if="htmlHasContent(type.literature)"
      :label="$t('property.literature_and_remarks')"
      :html="type.literature"
      class="gm2"
    />
    <catalog-property
      v-else
      :label="$t('property.literature_and_remarks')"
      class="gm2"
      >-</catalog-property
    >

    <catalog-property :label="$tc('property.piece', 2)" class="gm2">
      <div v-if="!type.pieces" class="error">Stücke wurden nicht geladen!</div>
      <div v-if="type.pieces && type.pieces.length == 0">-</div>
      <div v-for="piece of type.pieces" :key="piece" class="piece">
        <a :href="piece" target="_blank">
          <img :src="getLogoFromPath(piece)" alt="" width="32" />
          {{ piece }}</a
        >
      </div>
    </catalog-property>

    <catalog-property :label="$tc('property.treadwell_id')" class="gm2">
      {{ type.treadwellId ? type.treadwellId : '-' }}
    </catalog-property>
  </div>
</template>

<script>
import Person from '../../utils/Person';
import Text from '../../utils/Text';

import CatalogItem from '../catalog/CatalogItem.vue';
import LabeledField from '../display/LabeledField.vue';
import CaseHelper from '../../utils/CaseHelper';

import Gift from 'vue-material-design-icons/GiftOutline';
import Italic from 'vue-material-design-icons/FormatItalic.vue';
import CatalogProperty from '../catalog/CatalogProperty.vue';
import Row from '../layout/Row.vue';
import Tag from '../Tag.vue';
import Web from '../../utils/Web';

import EditIcon from 'vue-material-design-icons/Pen.vue';
import Button from '../layout/buttons/Button.vue';
import PersonView from '../Person/PersonView.vue';
import PersonList from '../Person/PersonList.vue';

export default {
  name: 'TypeView',
  props: {
    type: {
      type: Object,
    },
  },
  components: {
    CatalogItem,
    EditIcon,
    LabeledField,
    Gift,
    Italic,
    CatalogProperty,
    Row,
    Tag,
    Button,
    PersonView,
    PersonList,
  },
  methods: {
    dynamicHeading() {
      return Text.pluralizer(...arguments);
    },
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
    getTypePropertyKey(name, key = 'name') {
      let result = this.getTypeProperty(name);
      if (!result[key]) {
        return this.getUndefinedString();
      } else return result[key];
    },
    printTypeProperty(key, attr = 'name') {
      let value = 'Unbekannt';

      let map = { year: 'yearOfMint' };

      if (map[key]) {
        key = map[key];
      }

      if (typeof this.type[key] == 'object') {
        if (this.type[key]) {
          if (this.type[key][attr] !== null) {
            value = this.type[key][attr];
          } else {
            value = this.type[key];
          }
        }
      } else {
        value = this.type[key];
      }

      if (typeof value == 'boolean') {
        value = value ? 'Ja' : 'Nein';
      }
      if (value == 'pressed') value = this.$tc('property.procedures.pressed');
      if (value == 'struck') value = this.$tc('property.procedures.struck');

      return value;
    },
    getCoinSideLabel(val, sideObj) {
      let fields = this.getFilledFields(sideObj.prop);
      let fieldTextIdx = fields.indexOf('fieldText');
      if (fieldTextIdx != -1) fields.splice(fieldTextIdx, 1);

      if (val === 'fieldText') return `${sideObj.prefix}Feld`;
      if (val === 'misc') return `${sideObj.prefix}Randbeschriftung`;

      if (fields.length == 1 && val == 'innerInscript') {
        return sideObj.prefix + 'Umschrift';
      } else {
        switch (val) {
          case 'innerInscript':
            return `Innere ${sideObj.prefix}Umschrift`;
          case 'intermediateInscript':
            return `Mittlere ${sideObj.prefix}Umschrift`;
          case 'outerInscript':
            return `Äußere ${sideObj.prefix}Umschrift`;
        }
      }

      return 'UNBEKANNT';
    },
    getFilledFields(str) {
      let result = [];
      if (this.type[str]) {
        result = Object.entries(this.type[str])
          .filter(([_, val]) => {
            return this.htmlHasContent(val);
          })
          .map(([key, val]) => key);
      }

      return result;
    },

    htmlHasContent(val) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(val, 'text/html');
      const text = doc.documentElement.innerText;
      return text !== '';
    },
    get(property) {
      return this[property];
    },
    getLogoFromPath(path) {
      const site = Web.extractDomainName(path);
      return site
        ? `/img/logos/${site}.png`
        : 'https://www.fint-ikmk.uni-tuebingen.de/ikmk/special/favicons/android-chrome-256x256.png';
    },

    camelToSnake(value) {
      return CaseHelper.camelToSnake(value);
    },

    mapText: function (val, num = 1) {
      let map = {
        overlords: 'overlord',
        year: 'mint_year',
        issuers: 'issuer',
        caliph: { property: 'role', value: 'caliph' },
      };

      if (map[val]) {
        if (typeof map[val] == 'object')
          val = `${map[val].property}.${map[val].value}`;
        else val = `property.${map[val]}`;
      } else val = `property.${val}`;

      return this.$tc(val, num);
    },
  },
  computed: {
    warden: function () {
      return Person.getOtherPersonsByRoleName(this.type, 'warden');
    },
    cutter: function () {
      return Person.getOtherPersonsByRoleName(this.type, 'cutter');
    },
    heir: function () {
      return Person.getOtherPersonsByRoleName(this.type, 'heir')[0];
    },
  },
};
</script>

<style lang="scss">
.type-view .coin-side .property-label {
  text-align: center;
  margin: 0 auto;
}
</style>

<style lang="scss" scoped>
$columns: 4;
.type-view {
  margin-top: 2 * $padding;
  display: grid;
  gap: $padding;
  grid-template-columns: repeat($columns, 1fr);
}

h1 {
  margin: 0;
  align-self: center;
  padding: 0 0 $padding * 2 0;
}

.box {
  display: flex;
  background-color: $white;
  align-items: center;
  justify-content: center;
}

header {
  grid-column: 1 / -1;
}

.gm1 {
  grid-column: span $columns;
}

.gm2 {
  grid-column: span 2;
}

.gt1 {
  grid-column: span $columns;
}

.gt2 {
  grid-column: span 2;
}

.gt4 {
  grid-column: span 1;
}

.gc {
  justify-content: center;
  align-self: center;
  color: $primary-color;
  text-align: center;
}

.coin-side {
  display: flex;
  flex-direction: column;

  .catalog-property {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

#edit-button {
  position: fixed;
  right: 5%;
  bottom: 5%;

  button {
    $size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $primary-color;
    width: $size;
    height: $size;
    color: $white;
    border-radius: $size/2;
    box-shadow: $shadow;
  }
}
</style>

