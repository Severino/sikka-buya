<template>
    <div class="cms-view">
        <header v-if="$store.getters.canEdit">
            <button
                v-if="pageMissing"
                @click="cms_createAndVisit(group)"
            >
                <locale path="cms.create_page" />
            </button>
            <button
                v-else
                @click="cms_edit({
                    id: page.id,
                    group
                }, { include })"
            >
                <locale path="cms.edit_page" />
            </button>
        </header>

        <h2
            class="cms-title"
            v-if="isPresent('title')"
        >{{ page.title }}</h2>
        <p
            class="cms-subtitle"
            v-if="isPresent('subtitle')"
        >{{ page.subtitle }}</p>
        <p
            v-if="isPresent('body')"
            class="cms-body"
            v-html="page.body"
        ></p>
    </div>
</template>

<script>
import Button from '../layout/buttons/Button.vue';
import CMSPage from '../../models/CMSPage';
import CMSMixin from '../mixins/cms';
import Locale from './Locale.vue';

export default {
    components: { Button, Locale },
    mixins: [CMSMixin],
    mounted() {
        this.init();
    },
    data() {
        return {
            page: new CMSPage(),
            ready: false,
        };
    },
    props: {
        id: {
            type: Number
        },
        group: {
            type: String,
            required: true,
        },
        include: { type: Array, default: () => [] },
        exclude: { type: Array, default: () => [] },
    },
    methods: {
        async init() {
            const page = await this.cms_get({ id: this.id, group: this.group })
            this.ready = true
            this.page.assign(page)
        },
        isPresent(key) {
            console.log(this.include)
            return this.include ? this.include.includes(key) : !this.exclude.include(key)
        },
    },
    computed: {
        pageMissing() {
            return (this.ready && this.page.id === null) && this.$store.getters.canEdit
        }
    }
};
</script>

<style lang='scss' scoped></style>