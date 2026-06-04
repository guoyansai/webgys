// 导入 Vue 的 createApp 函数
import { createApp } from 'vue';
// 导入根组件 App
import App from './App.vue';
// 插件实现部分
import AsInstall from './utils/index';

// 创建 Vue 应用实例
const app = createApp(App);
// 使用插件 AsInstall
app.use(AsInstall);
// 将应用挂载到 DOM 元素 #app 上
app.mount('#app');
