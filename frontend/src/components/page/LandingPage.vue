<template>
  <section class="hero">
    <div class="box">
      <img src="@/assets/images/sikka-buya.png" alt="" />
      <p>
        Hier entsteht SIKKA:BUYA entdecke als Interessierter oder Forscher, eine
        neue Perspektive auf die Geschichte der Buiyden und die islamische
        Numismatik.
      </p>
      <router-link :to="{name: 'Login'}">
      <div style="display: inline-block;" class="button">
        <row>
        <span style="margin-right:10px;">Editor Login</span><LoginVariant />
        </row>
      </div>
      </router-link>
    </div>
  </section>
</template>

<script>
import LoginVariant from "vue-material-design-icons/LoginVariant";
import Row from '../layout/Row.vue';
export default {
  name: "Landing Page",
  components: {
    LoginVariant,
    Row,
  },
};
</script>

<style scoped>
section {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  text-align: center;
  max-width: 720px;
}
</style>