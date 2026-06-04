<script setup lang="ts">
const props: any = defineProps<{
    ujt: any;
}>();

const { $fn, $global } = props.ujt;

// 预设主页跳转功能
if (
    $global.sys?.tyrobot &&
    $global.sys?.router?.config?.indexs?.[$global.sys?.tyrobot]
) {
    $fn.sethash($global.sys?.router?.config?.indexs?.[$global.sys?.tyrobot]);
} else if ($global.sys?.router?.config?.index) {
    $fn.sethash($global.sys.router.config.index);
}
</script>

<template>
    <AsaiWebModuleDefault :ujt="ujt"></AsaiWebModuleDefault>
</template>

<style scoped lang="scss"></style>
