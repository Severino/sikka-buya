<template>
    <form @submit.prevent="$emit('submit', $event)">
        <slot />
    </form>
</template>

<script>
export default {
    name: "Form"
}
</script>