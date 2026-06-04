<script setup lang="ts">
import AsaiSiteMap from './_comps/AsaiSiteMap.vue';
import AsaiDefaultIndex from './_comps/AsaiDefaultIndex.vue';
const props: any = defineProps<{
    ujt: any;
}>();
const { $global } = props.ujt;
</script>

<template>
    <AsaiSiteMap v-if="$global?.sys?.onwebsitemap" :ujt="ujt"></AsaiSiteMap>
    <AsaiDefaultIndex v-else :ujt="ujt"></AsaiDefaultIndex>
</template>

<style scoped lang="scss"></style>
