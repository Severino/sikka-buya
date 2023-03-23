<template>
  <footer>
    <div class="content-wrapper grid col-3">
      <div>
        <div>© 2023</div>
      </div>
      <div>
      </div>
      <div>
        <router-link :to="{ name: 'Login' }"
          ><locale path="system.user_login"
        /></router-link>
      </div>
    </div>
  </footer>
</template>

<script>
import Locale from '../cms/Locale.vue';
export default { components: { Locale } };
</script>

<style lang="scss"  scoped>
footer {
  position: relative;
  padding: $big-padding 0;
  color: $white;
  margin-top: 10rem;
  min-height: 30vh;
  padding-top: 3rem;
  background-color: $light-gray;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 4px;
    border-top: 6px dotted whitesmoke;
  }

  > * {
    text-align: center;
  }

  .grid > * {
    display: flex;
    flex-direction: column;
  }

  a {
    text-transform: uppercase;
    color: currentColor;
  }
}
</style>