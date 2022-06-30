<template>
  <div>
    <header>
      <h2>{{ $t('general.administration') }}</h2>
    </header>
    <!-- <router-link :to="{ name: 'TypeList' }"> Explorer </router-link> -->
    <div class="button-list">
      <router-link
        v-if="superuser"
        class="button icon-button"
        :to="{ name: 'UserManagement' }"
        draggable="false"
      >
        <span>{{ $tc('general.user') }}</span>
      </router-link>

      <router-link
        class="button icon-button"
        :to="{ name: 'TypeOverview' }"
        draggable="false"
      >
        <span>{{ $tc('general.type') }}</span>
      </router-link>
    </div>

    <h3>{{ $t('general.manage_properties') }}</h3>

    <list :items="properties">
      <list-item
        v-for="(property, idx) of properties"
        :key="'prop-' + idx"
        :to="property.to"
      >
        <span>{{ $tc('property.' + property.name) }}</span>
      </list-item>
    </list>
    <h3>Hilfsprogramme</h3>
    <router-link class="button icon-button" :to="{ name: 'FixDiff' }"
      >Vergleiche letzte Bereinigung</router-link
    >
  </div>
</template>

<script>
import PlusBox from 'vue-material-design-icons/PlusBox';
import Auth from '../../utils/Auth';
import List from '../layout/List.vue';
import ListItem from '../layout/ListItem.vue';

export default {
  name: 'EditorPanel',
  components: {
    PlusBox,
    List,
    ListItem,
  },
  computed: {
    properties: function () {
      let props = [
        'honorific',
        'coin_mark',
        'material',
        'mint',
        'nominal',
        'person',
        'title',
        'dynasty',
        'role',
        'province',
      ];

      let propertyMap = {
        person: 'PersonOverview',
        material: 'MaterialOverview',
        coin_mark: 'CoinMarkOverview',
      };

      props = props.sort((a, b) =>
        this.$tc('property.' + a).localeCompare(this.$tc('property.' + b))
      );

      props = props.map((name) => {
        console.log(name, propertyMap[name]);
        if (propertyMap[name]) {
          return {
            name,
            to: { name: propertyMap[name] },
          };
        } else {
          return {
            name,
            to: { name: 'Property', params: { property: name } },
          };
        }
      });

      return props;
    },
    superuser: function () {
      let user = Auth.loadUser();
      return user.super || false;
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  @include resetLinkStyle();
}

@import '@/scss/_import.scss';
header {
  display: flex;
  justify-content: space-between;
}

h3 {
  margin-top: 50px;
  padding-bottom: 0.5em;
  border-bottom: 1px solid black;
}

.draft {
  position: relative;
}

.draft::before {
  content: 'DRAFT';
  font-family: $font;
  font-size: 0.5rem;
  color: white;
  font-weight: bold;
  background-color: $red;
  padding: 5px 20px;
  position: absolute;
  top: 0;
  transform: translate(20px, -50%);
}
</style>