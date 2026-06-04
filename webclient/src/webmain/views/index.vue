<script setup lang="ts">
const props: any = defineProps<{
  ujt: any;
}>();
const { $model } = props.ujt;

// 挂载：先动态挂载一下views里面的组件，方便路由解构
$model.comps = (import.meta as any).glob(['./**/!(_)*/!(_)*.vue']);
</script>

<template>
  <AsaiWebModule :ujt="ujt" :module="{ value: 'main', label: '测试模块' }"></AsaiWebModule>
</template>

<style lang="scss">
// 当前模块的公共样式,asaiweb+模块名
.asaiwebmain {
  background-color: var(--cr0);
  color: var(--cu8);
}
</style>
