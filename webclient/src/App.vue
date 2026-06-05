<script setup lang="ts">
// 导入 Vue 的异步组件定义函数
import { defineAsyncComponent, getCurrentInstance, provide } from 'vue';
import AppRun from './AppRun.vue';

// 插件实现
// import AsaiJsAs from './plugs/asai-js-as/AsaiJsAs.ts';
import AsaiJsAs from 'asai-js-as';

// css插件
import AsaiVueCss from 'asai-vue-css';
import '/node_modules/asai-vue-css/dist/asai-vue-css.css';

import AsaiLoading from './views/loading.vue';

// 从install中拉取全局变量
const $vueProxy: any = getCurrentInstance()?.proxy;
// 初始化前端引擎，并解构出全局模型
const { $ujtasai } = $vueProxy.$engineasai.useProvide({
  plugs: {
    ...(AsaiJsAs?.default || AsaiJsAs || {}),
    AsaiVueCss,
  },
});

// 挂载全局预加载的变量
provide('$vueProxy', $vueProxy);
// 定义应用配置对象，包含应用版本和路由索引组件，使用异步组件提高性能
const appmodules: any = {
  appVer: 1,
  // 使用异步组件提高性能
  indexRouters: Object.fromEntries(
    $ujtasai.$model?.webmodels?.map((item: string) => {
      if (item === 'views') {
        return [
          item,
          defineAsyncComponent({
            loader: () => import(`./${item}/index.vue`), // 异步加载的组件路径
            loadingComponent: AsaiLoading, // 加载状态时显示的组件
            delay: 200, // 延迟显示加载组件的毫秒数，可选
          }),
        ];
      }
      return [
        item,
        defineAsyncComponent({
          loader: () => import(`./${item}/views/index.vue`),
          loadingComponent: AsaiLoading,
          delay: 200,
        }),
      ];
    }) || []
  ),
};
</script>

<template>
  <AppRun :appmodules="appmodules" :ujt="$ujtasai"></AppRun>
</template>

<style lang="scss">
@use './css/main.scss';
</style>
