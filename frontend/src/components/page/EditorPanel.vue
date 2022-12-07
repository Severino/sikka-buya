<template>
  <div>
    <header>
      <h2>{{ $t('editor.administration') }}</h2>
    </header>

    <list :items="featuredProperties">
      <list-header>{{ $t('editor.admin_properties') }}</list-header>
      <list-item
        v-for="(property, idx) of featuredProperties"
        :key="'prop-' + idx"
        :to="property.to"
      >
        <span>{{ $tc('general.' + property.name) }}</span>
      </list-item>
    </list>

    <list :items="properties">
      <list-header>{{ $t('editor.data_properties') }}</list-header>

      <list-item
        v-for="(property, idx) of properties"
        :key="'prop-' + idx"
        :to="property.to"
      >
        <span>{{ $tc('property.' + property.name) }}</span>
      </list-item>
    </list>

    <list :items="supportPrograms">
      <list-header>{{ $t('editor.assist_tools') }}</list-header>
      <list-item
        v-for="(property, idx) of supportPrograms"
        :key="'prop-' + idx"
        :to="property.to"
      >
        <span>{{ $tc('editor.' + property.name) }}</span>
      </list-item>
    </list>
  </div>
</template>

<script>
import PlusBox from 'vue-material-design-icons/PlusBox';
import Auth from '../../utils/Auth';
import List from '../layout/List.vue';
import ListHeader from '../layout/list/ListHeader.vue';
import ListItem from '../layout/ListItem.vue';

export default {
  name: 'EditorPanel',
  components: {
    PlusBox,
    List,
    ListItem,
    ListHeader,
  },
  method: {
    isAccessible(obj) {
      if (!obj.superuser) return true;
      else return this.superuser;
    },
  },
  computed: {
    featuredProperties() {
      const properties = [{ name: 'type', to: { name: 'TypeOverview' } }];

      if (this.superuser) {
        properties.unshift({ name: 'user', to: { name: 'UserManagement' } });
      }

      return properties;
    },
    supportPrograms() {
      return [{ name: 'compare_last_cleanup', to: { name: 'FixDiff' } }];
    },
    properties() {
      let props = [
        'honorific',
        'coin_mark',
        'coin_verse',
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

header {
  display: flex;
  justify-content: space-between;
}

h1,
h2,
h3 {
  text-transform: capitalize;
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