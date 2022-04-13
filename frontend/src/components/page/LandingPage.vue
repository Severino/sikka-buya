<template>
  <section class="hero">
    <div class="box">
      <p>
        Hier entsteht SIKKA:BUYA entdecke als Interessierter oder Forscher, eine
        neue Perspektive auf die Geschichte der Buiyden und die islamische
        Numismatik.
      </p>
      <router-link :to="{ name: 'Login' }">
        <Button class="center">
          <row>
            <span style="margin-right: 10px; white-space: nowrap">{{
              $utils.capitalize($t('system.login'))
            }}</span
            ><LoginVariant />
          </row>
        </Button>
      </router-link>
    </div>
  </section>
</template>

<script>
import LoginVariant from 'vue-material-design-icons/LoginVariant';
import Button from '../layout/buttons/Button.vue';
import Row from '../layout/Row.vue';

export default {
  name: 'LandingPage',
  components: {
    LoginVariant,
    Row,
    Button,
  },
};
</script>

<style scoped>
section {
  margin-top: -143px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  text-align: center;
  max-width: 720px;
}
</style>