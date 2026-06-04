<script setup lang="ts">
const props: any = defineProps<{
  ujt: any;
}>();

const { $fn, $model, $global } = props.ujt;

// 设定主模块
$global.module.value = 'views';
$global.module.label = '主模块';

// 挂载：先动态挂载一下views里面的组件，方便路由解构

$model.comps = (import.meta as any).glob(['./**/*.vue', '!./**/_*/**', '!./**/_*.vue']);

$fn.initrouter();
</script>

<template>
  {{ $model.comps }}
  <RouterView :ujt="ujt" :ty="0"></RouterView>
</template>

<style scoped lang="scss">
// 当前模块的公共样式,asaiweb+模块名
.asaiwebdefault {
  color: var(--cu8);
}
</style>
