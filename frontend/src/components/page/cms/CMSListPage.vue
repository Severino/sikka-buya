<template>
    <div class="page content-wrapper">
        <div class="content">
            <h2>
                <Locale :path="`cms.${this.group}`" />
            </h2>
            <Button
                v-if="$store.getters.canEdit"
                @click="() => cms_createAndVisit(this.group, { include: this.include })"
            >Neuer Eintrag</Button>
            <div class="list">
                <CMSListElement
                    v-for="page of pages"
                    :key="page.id"
                    :value="page"
                    :group="group"
                    :include="include"
                    @deleted="update"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Locale from '../../cms/Locale.vue';
import Button from '../../layout/buttons/Button.vue';
import CMSMixin from "../../mixins/cms"
import CMSListElement from './CMSListElement.vue';


export default {
    components: { Button, CMSListElement, Locale },
    mixins: [CMSMixin],
    props: {
        include: Array,
        group: String
    },
    data() {
        return {
            pages: Array
        }
    },
    created() {
        this.init()
    },
    methods: {
        init: async function () {
            await this.update()
        },
        update: async function () {
            this.pages = await this.cms_list(this.group)
        }
    }
};
</script>

<style lang='scss' scoped>.list {
    margin-bottom: 50vh;

    >* {
        margin-top: $padding;
    }
}</style>