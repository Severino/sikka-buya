<template>
    <Overview createPage="CreateCoinMark" overridePropertyName="coin_mark" overrideProperty="coinmark" query="coinMark" />
</template>

<script>
import Overview from './Overview.vue'
export default {
    name: "CoinMarkOverview",
    components: {
        Overview

    }
}
</script>