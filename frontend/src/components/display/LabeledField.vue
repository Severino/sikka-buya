<template>
    <div class="labeled-field">
        <div class="property-label">
            {{ label }}
          </div>
          <div class="property-value">
            {{ value }}
          </div>
    </div>
</template>

<script>
export default {
    name:"LabeledField",
    props: {
        label: String,
        value: String
    }
}
</script>