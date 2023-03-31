<template>
    <div class="page content-wrapper">
        <div class="content">
            <CMSView
                :group="group"
                :include="include"
            />
        </div>
    </div>
</template>

<script>
import CMSView from '../../cms/CMSView.vue';

export default {
    props: {
        include: Array,
        group: String
    },
    components: { CMSView }
};
</script>
