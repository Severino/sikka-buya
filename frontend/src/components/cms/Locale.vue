<template>
    <span class="locale-comp" :class="{ editable: $store.getters.canEdit }">
        <template v-if="$store.getters.canEdit">

            {{ $tc(path, count) }}
            <router-link class="locale-link" @click.stop.prevent="" :to="{
                name: 'Locale',
                force: true,
                params: {
                    lang,
                    path
                }
            }">
                <div @mouseenter="() => mouseover = true" @mouseleave="() => mouseover = false">
                    <EarthIcon :size="10" :class="{ active }" />

                    <Tooltip v-if="mouseover">
                        {{ path }}
                    </Tooltip>
                </div>
            </router-link>
        </template>
        <template v-else>
            {{ $tc(path, count) }}
        </template>
    </span>
</template>

<script>
import Query from '../../database/query';
import Button from '../layout/buttons/Button.vue';
import Toggle from '../layout/buttons/Toggle.vue';

import EarthIcon from "vue-material-design-icons/Earth"
import EarthCloseIcon from "vue-material-design-icons/EarthRemove"
import Tooltip from '../forms/Tooltip.vue';


export default {
    props: {
        path: {
            required: true,
            type: String
        },
        count: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            active: false,
            plural: false,
            mouseover: false
        }
    },
    computed: {
        lang() {
            return this.$root.$i18n.locale
        }
    },
    components: { Button, EarthIcon, EarthCloseIcon, Toggle, Tooltip }
};
</script>

<style lang='scss' scoped>
a.locale-link {
    position: absolute;
    color: currentColor !important;
    bottom: 1em;
    right: 0;
    transform: translateY(80%);

}

.locale-comp {
    position: relative;

    &.editable {
        padding-right: 12px;
    }
}



a {
    color: currentColor !important;
}
</style>