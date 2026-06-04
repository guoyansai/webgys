// 导入库初始化函数
import LibInit from '../lib/LibInit';

// 导入AsaiVueHost模块（前置必须的模块，先加载）
import AsaiVueHost from '../plugs/asai-vue-host/src/components/index';
// import AsaiVueHost from 'asai-vue-host';
// import '/node_modules/asai-vue-host/dist/asai-vue-host.css';

// 项目组件模块
import asailib from '../lib/index';

// 导入指定模块
// import astestmodel from '../testmodel/lib-install/index';

// 导入Vue的App类型
import type { App } from 'vue';

export default {
  install(app: App) {
    const { lib, createComponentLoader } = LibInit();
    const installModules = [
      AsaiVueHost,
      asailib, // 挂载基础组件
    ];
    installModules.forEach((module: any) => module.install(app, lib));

    const models: any = {
      // astestmodel, // 测试模块（示例，实际使用时请替换为真实模块）
    };
    app.config.globalProperties.$fns = { createComponentLoader };
    app.config.globalProperties.$installplugs = (webtype: any) => {
      models['as' + webtype]?.forEach((el: any) => {
        el.install(app, lib);
      });
    };
  },
};
