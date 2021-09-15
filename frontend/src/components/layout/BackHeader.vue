<template>
  <div class="back-header">
    <router-link @click="debug" :to="to"
      ><ArrowLeft />{{ $t('navigation.back') }}</router-link
    >
  </div>
</template>

<script>
import ArrowLeft from 'vue-material-design-icons/KeyboardBackspace';
export default {
  name: 'ValueWrapper',
  components: {
    ArrowLeft,
  },
  props: {
    to: {
      type: Object,
      required: true,
    },
  },
  methods: {
    debug: function() {
      console.log('CLICKED');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/scss/_import.scss';

.back-header {
  width: 100%;
  left: 0;
  top: 0;
  display: flex;
}

h1 {
  margin: 0;
}

a {
  display: flex;
  align-items: center;
  color: black;
  text-transform: capitalize;
  align-self: flex-start;
  padding: $padding;
  margin-top: $padding;

  text-decoration: none;

  .material-design-icon {
    margin-right: 10px;
  }
}

.material-design-icon {
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
}
</style>
