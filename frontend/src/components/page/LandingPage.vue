<template>
  <section class="hero">
    <div class="box">
      <img src="@/assets/images/sikka-buya.png" alt="" />
      <p>
        Hier entsteht SIKKA:BUYA entdecke als Interessierter oder Forscher, eine
        neue Perspektive auf die Geschichte der Buiyden und die islamische
        Numismatik.
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: "Landing Page",
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