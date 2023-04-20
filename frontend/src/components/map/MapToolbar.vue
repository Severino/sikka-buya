<template>
    <div class="map-toolbar">
        <div class="toolbar toolbar-left">
            <nav>
                <MapBackButton />
            </nav>
        </div>

        <div class="toolbar toolbar-right">
            <Button
                v-if="filtersActive"
                class="clear-filter-btn map-button"
                @click="() => $emit('reset-filters')"
            >
                <Locale path="general.reset_filter" />

            </Button>
        </div>
    </div>
</template>

<script>
import Button from '../layout/buttons/Button.vue';
import Locale from '../cms/Locale.vue';
import MapBackButton from './control/MapBackButton.vue';

export default {
    props: {
        filtersActive: { type: Boolean, required: true }
    },
    components: { Button, Locale, MapBackButton }
};
</script>




<style lang='scss' scoped>
.map-toolbar {
    padding: $small-padding;
    display: grid;
    grid-template-columns: 1fr 1fr;

}


.toolbar {
    &.toolbar-right {
        justify-self: flex-end;
    }

    &.toolbar-left {
        justify-self: flex-start;
    }

    &.toolbar-center {
        justify-self: center;
    }
}
</style>
