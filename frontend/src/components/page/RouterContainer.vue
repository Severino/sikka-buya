<template>
    <div class="content-wrapper">
        <router-view />
    </div>
</template>

<script>
export default {
    name:"RouterContainer"
}
</script>


<style lang="scss" scoped>


.content-wrapper {
    display: flex;
    flex: 1;
    flex-direction: column;
}

</style>