<template>
    <span class="locale-comp" :class="{ edit: $store.getters.canEdit }" @click.stop="">
        <template v-if="$store.getters.canEdit">

            {{ $tc(path, count) }}
            <router-link :to="{
                name: 'Locale',
                force: true,
                params: {
                    lang,
                    path
                }
            }">
                <EarthIcon :size="10" :class="{ active }" />
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
            plural: false
        }
    },
    computed: {
        lang() {
            return this.$root.$i18n.locale
        }
    },
    components: { Button, EarthIcon, EarthCloseIcon, Toggle }
};
</script>

<style lang='scss' scoped>
.locale-comp {
    position: relative;

    .material-design-icon {
        position: absolute;
        top: 0;
        right: 0;

    }

    &.edit {
        padding-right: 12px;
    }
}

a {
    color: currentColor !important;
}

.toolbox {
    position: fixed;
    left: 0;
    bottom: 0;
    transform: translateY(100%);
    z-index: 100000;
    padding: 3px;
    border-radius: 3px;
    background-color: gray;

    .toggle-button {
        background-color: white;
    }
}
</style>