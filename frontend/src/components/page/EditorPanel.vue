<template>
  <div>
    <header>
      <h2>{{ $t("general.administration") }}</h2>
    </header>
    <!-- <router-link :to="{ name: 'TypeList' }"> Explorer </router-link> -->
    <div class="button-list">
      <router-link
      v-if="superuser"
        class="button icon-button"
        :to="{ name: 'UserManagement' }"
        draggable="false"
      >
        <span>{{ $tc("general.user") }}</span>
      </router-link>

      <router-link
        class="button icon-button"
        :to="{ name: 'TypeOverview' }"
        draggable="false"
      >
        <span>{{ $tc("general.type") }}</span>
      </router-link>
    </div>

    <h3>{{ $t("general.manage_properties") }}</h3>
    <div class="button-list">
      <router-link
        class="button icon-button"
        :to="{ name: 'Property', params: { property: 'honorific' } }"
        draggable="false"
      >
        <span>{{ $tc("property.honorific") }}</span>
      </router-link>
      <router-link
        class="button icon-button"
        :to="{ name: 'CoinMarkOverview' }"
        draggable="false"
      >
        <span>{{ $tc("property.coin_mark") }}</span>
      </router-link>
      <router-link
        class="button icon-button"
        :to="{ name: 'Property', params: { property: 'material' } }"
        draggable="false"
      >
        <span>{{ $tc("property.material") }}</span>
      </router-link>
      <router-link
        class="button icon-button"
        :to="{ name: 'Property', params: { property: 'mint' } }"
        draggable="false"
      >
        <span>{{ $tc("property.mint") }}</span>
      </router-link>
      <router-link
        class="button icon-button"
        :to="{ name: 'Property', params: { property: 'nominal' } }"
        draggable="false"
      >
        <span>{{ $tc("property.nominal") }}</span>
      </router-link>
      <router-link
        class="button icon-button"
        :to="{ name: 'Property', params: { property: 'person' } }"
        draggable="false"
      >
        <span>{{ $tc("property.person") }}</span>
      </router-link>

      <router-link
        class="button icon-button"
        :to="{ name: 'Property', params: { property: 'title' } }"
        draggable="false"
      >
        <span>{{ $tc("property.title") }}</span>
      </router-link>

      <router-link
        class="button icon-button"
        :to="{ name: 'Property', params: { property: 'dynasty' } }"
        draggable="false"
      >
        <span>{{ $tc("property.dynasty") }}</span>
      </router-link>

      <router-link
        class="button icon-button"
        :to="{ name: 'Property', params: { property: 'role' } }"
        draggable="false"
      >
        <span>{{ $tc("property.role") }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import PlusBox from "vue-material-design-icons/PlusBox";
import Auth from '../../utils/Auth';

export default {
  name: "EditorPanel",
  components: {
    PlusBox,
  },computed: {
    superuser: function(){
      let user = Auth.loadUser()
      return user.super || false
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/_import.scss";
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
  content: "DRAFT";
  font-family: Arial, Helvetica, sans-serif;
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