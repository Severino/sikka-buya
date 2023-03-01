<template>
    <div class="cms-list-element">
        <header v-if="showTime">
            <span>{{ timeMixinFormatDate(value.createdTimestamp) }}</span>
            <span>{{ timeMixinFormatDate(value.publishedTimestamp) || "-" }}</span>
            <div class="toolbox">
                <Button :to="cms_edit({ id: value.id, group, props: { include } })">Bearbeiten</Button>
                <Button @click="() => remove(value.id)">Delete</Button>
            </div>
        </header>
        <div class="flex space-between row">
            <div class="body">
                <h3 v-if="isPresent('title')">{{ value.title }}</h3>
                <h4 v-if="isPresent('subtitle')">{{ value.subtitle }}</h4>
                <div v-if="isPresent('body')" v-html="value.body"></div>
            </div>
            <div class="toolbox" v-if="!showTime">
                <Button :to="cms_edit({ id: value.id, group, props: { include } })">Bearbeiten</Button>
                <Button @click="() => remove(value.id)">Delete</Button>
            </div>
        </div>
    </div>
</template>

<script>
import CMSMixin from "../../mixins/cms"
import TimeMixin from '../../mixins/time';
import Button from '../../layout/buttons/Button.vue';
import CMSConfig from "../../../../cms.config";
export default {
    mixins: [TimeMixin, CMSMixin],
    components: {
        Button
    },
    props: {
        value: { type: Object, required: true },
        group: { type: String, required: true },
        include: { type: Array, default() { return [] } }
    },
    methods: {
        isPresent(name) {
            const configInlcudes = CMSConfig?.["bibliography"]?.preview?.include || []
            const componentInclude = this.include || []
            const include = [... configInlcudes, ... componentInclude]

            if (include.length > 0) {
                return include.includes(name)
            } else {
                return true
            }
        },
        remove: async function (id) {
            await this.cms_delete(id)
            this.$emit("deleted")
        }
    }, computed: {
        showTime() {
            return Boolean(CMSConfig?.["bibliography"]?.preview?.showTime)
        },
    }
};
</script>

<style lang='scss' scoped>
.cms-list-element {
    background-color: white;
    border: 1px solid $light-gray;
    border-radius: $border-radius;
    padding: $padding math.div($padding, 2);
}

header {
    display: flex;
    justify-content: space-between;
}

.body {
    align-self: center;
}
</style>