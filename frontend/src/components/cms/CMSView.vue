<template>
    <div class="cms-view">

        <header v-if="$store.getters.canEdit">
            <button
                v-if="pageMissing"
                @click="cms_createAndVisit(group)"
            >Create Page</button>
            <button
                v-else
                @click="cms_edit({id: page.id, group})"
            >Edit Page</button>
        </header>

        <h2 class="cms-title">{{ page.title }}</h2>
        <p class="cms-subtitle">{{ page.subtitle }}</p>
        <p
            class="cms-body"
            v-html="page.body"
        ></p>
    </div>
</template>

<script>
import Button from '../layout/buttons/Button.vue';
import CMSPage from '../../models/CMSPage';
import CMSMixin from '../mixins/cms';

export default {
    components: { Button },
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
        includes: Array,
        excludes: Array,
    },
    methods: {
        async init() {
            const page = await this.cms_get({ id: this.id, group: this.group })
            this.ready = true
            this.page.assign(page)
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