<script setup lang="ts">
import AppInit from './AppInit.vue';

const props: any = defineProps<{
  appmodules: any;
  ujt: any;
}>();
const { $global } = props.ujt;
</script>

<template>
  <div id="asaiweb">
    <!-- 使用 AsaiInitPage 组件并传入应用配置 -->
    <AsaiInitPage :appmodules="appmodules" :ujt="ujt"></AsaiInitPage>
    <template v-if="$global?.stat?.webclient">
      <div id="teleportasai"></div>
      <div id="teleportpopbox">
        <AppInit :ujt="ujt" :appmodules="appmodules"></AppInit>
      </div>
    </template>
  </div>
</template>

<style lang="scss"></style>
