<template>
  <div class="checkbox">
    <input
      type="checkbox"
      :name="id"
      :id="id"
      :checked="value"
      @input="input"
    />
    <label :for="id" v-if="label">{{ label }}</label>
    <div class="check">
      <CheckboxMarked v-if="value" />
      <CheckboxBlankOutline v-else />
    </div>
  </div>
</template>

<script>
import Row from "../layout/Row.vue";
import CheckboxBlankOutline from "vue-material-design-icons/CheckboxBlankOutline";
import CheckboxMarked from "vue-material-design-icons/CheckboxMarked";

export default {
  name: "Checkbox",
  components: {
    Row,
    CheckboxMarked,
    CheckboxBlankOutline,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
    },
    label: String,
  },
  methods: {
    input: function (event) {
      const checked = event.target.checked;
      this.$emit("input", checked);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/_import.scss";

input {
  display: none;
}

</style>
