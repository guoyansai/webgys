<script setup lang="ts">
const props: any = defineProps<{
  appmodules: any;
  ujt: any;
}>();
const { $fn, $model } = props.ujt;
const { AsCss } = $fn.AsaiVueCss;
</script>

<template>
  <AsCss :ujt="ujt" :opt="$model.data?.sys?.themedefault"></AsCss>
</template>

<style lang="scss"></style>
