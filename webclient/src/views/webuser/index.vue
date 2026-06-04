<script setup lang="ts">
const props: any = defineProps<{
  ujt: any;
}>();
</script>

<template>
  <RouterView :ujt="ujt" :ty="1"></RouterView>
</template>

<style scoped lang="scss"></style>
