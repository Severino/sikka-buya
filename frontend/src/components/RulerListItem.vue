<template>
    <MultiSelectListItem
        @checkbox-selected="() => $emit('selection-changed', item)"
        @click.native="() => $emit('selection-changed', item)"
        :style="css"
        :selected="selected"
        :class="{ ['ruler-unavailable']: unavailable }"
    >
        <template v-slot:before>
            <div
                class="color-indicator"
                :class="{ 'color-indicator-selected': selected }"
            ></div>
        </template>
        <span>
            {{ getRulerName(item) }}
            <span
                v-if="$store.state.debug"
                class="debug"
            >({{ item.id }})</span>
            <span
                v-if="getDynasty(item)"
                class="dynasty"
            >{{
                getDynasty(item)
            }}</span></span>
    </MultiSelectListItem>
</template>

<script>
import Person from '../utils/Person';
import MultiSelectListItem from './MultiSelectListItem.vue';

export default {
    components: {
        MultiSelectListItem
    },
    props: {
        item: {
            type: Object,
            validator: (item) => {
                return item.hasOwnProperty('id');
            },
        },
        selected: Boolean,
        css: Object,
        unavailable: Boolean
    },
    methods: {
        getDynasty(item) {
            if (item?.dynasty?.name && item?.dynasty?.id != 1) {
                return item?.dynasty?.name;
            } else return null;
        },
        getRulerName(ruler) {
            return Person.getName(ruler);
        },
    }
};
</script>

<style lang='scss' scoped>
.ruler-unavailable {
    opacity: 0.5;
}

.dynasty {
  font-size: 0.75rem;
  color: $light-gray;
  font-weight: bold;
}
</style>