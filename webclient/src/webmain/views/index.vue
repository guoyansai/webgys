<script setup lang="ts">
const props: any = defineProps<{
  ujt: any;
}>();
const { $model } = props.ujt;

$model.comps = (import.meta as any).glob(['./**/*.vue', '!./**/_*/**', '!./**/_*.vue']);
</script>

<template>
  <AsaiWebModule :ujt="ujt" :module="{ value: 'webmain', label: '测试模块' }"></AsaiWebModule>
</template>

<style lang="scss">
// 当前模块的公共样式,asaiweb+模块名
.asaiwebmain {
  background-color: var(--cr0);
  color: var(--cu8);
}
</style>
