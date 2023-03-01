<template>
  <div class="user-hub">
    <span>{{ permission }}</span>
    
    <div class="toolbox">
      <Button :to="{ name: 'Editor' }" class="borderless"
        ><account-icon :size="IconSize.Large"
      /></Button>
      <Button class="borderless" @click="logout"
        ><logout-variant-icon :size="IconSize.Large"
      /></Button>
    </div>
  </div>
</template>

<script>
import Button from '../layout/buttons/Button.vue';

import AuthMixin from '../mixins/auth';

import AccountIcon from 'vue-material-design-icons/Account.vue';
import LogoutVariantIcon from 'vue-material-design-icons/LogoutVariant.vue';

export default {
  components: { Button, AccountIcon, LogoutVariantIcon },
  mixins: [AuthMixin],
  computed: {
    permission(){
      const user = this.$store.state.user
      let permissions = []
      if(user.super) permissions.push("super")
      if(user.permissions?.length > 0) permissions.push(... user.permissions)
      return (permissions.length > 0)? `${permissions.join(", ")}` : "Nutzer"
    }
  }
};
</script>

<style lang='scss' scoped>
.user-hub {
  .material-design-icon {
    color: white;
  }

  span {
    flex: 1;
    padding: 0 math.div($padding, 2);
  }

  .button {
    // background-color: red;
    border-left: 1px solid $light-gray;
  }

  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  background-color: $primary-color;
  min-width: 300px;
  max-width: 100%;
  text-align: center;
  color: white;
  font-weight: bold;
  box-shadow: $strong-shadow;
  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;

  cursor: default;
  user-select: none;
}
</style>