<template>
    <PageWrapper>
        <h1>
            <Locale path="routes.contact" />
        </h1>
        <CMSView
            group="contact_page"
            :include="['body']"
        />
    </PageWrapper>
</template>

<script>
import CMSView from '../cms/CMSView.vue';
import Locale from '../cms/Locale.vue';
import PageWrapper from './PageWrapper.vue';

export default {
    components: { PageWrapper, CMSView, Locale },
};
</script>

<style lang='scss' scoped></style>