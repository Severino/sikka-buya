<template>
  <footer>
    <div class="content-wrapper grid col-3">
      <div>
        <router-link :to="{ name: 'Contact' }">
          <locale path="routes.contact" />
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'Login' }">
          <locale path="system.user_login" />
        </router-link>
        <div>© 2023</div>
      </div>
      <div>
        <h4>
          <locale path="system.supported_by" />
        </h4>
        <ul class="unstyled">

          <li>
            <CMSImage
              class="supporter-logo"
              mode="contain"
              identity="logo.supporter_1"
            />
          </li>
          <li>
            <CMSImage
              class="supporter-logo"
              mode="contain"
              identity="logo.supporter_2"
            />
          </li>
        </ul>

      </div>
    </div>
  </footer>
</template>

<script>
import CMSImage from '../cms/CMSImage.vue';
import Locale from '../cms/Locale.vue';
export default { components: { Locale, CMSImage } };
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

  .supporter-logo {
    width: 200px;
  }


  a {
    text-transform: uppercase;
    color: currentColor;
  }
}

.content-wrapper>* {
  h4 {
    margin-top: 0;
  }
}

ul li {
  margin-top: 2rem;
}
</style>