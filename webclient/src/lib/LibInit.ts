import { ref, reactive, toRaw, defineAsyncComponent } from 'vue';
import { createComponentLoader } from './ComponentLoader'; // 引入组件加载器

export default () => {
  const lib: any = {
    eager: true,
    ref,
    reactive,
    toRaw,
    loadfn: { fnvue: defineAsyncComponent },
    vuecomps: {},
  };

  // ========== 组件加载函数（使用外部模块） ==========
  lib.loadvue = (params: any = {}) => {
    const { app, files, eager = true, fullname = false, cache = true, cacheKey = 'comp_', target, targetKey = 'comps', mode = 'global' } = params;

    // 调用外部组件加载器
    const loader = createComponentLoader({
      app,
      files,
      eager,
      fullname,
      cache,
      cacheKey,
      target,
      targetKey,
      mode,
    });

    // 如果是全局模式，需要手动注册到 lib.vuecomps
    if ((mode === 'global' || mode === 'hybrid') && app) {
      for (const [name, comp] of Object.entries(loader.map)) {
        if (!lib.vuecomps[name]) {
          lib.vuecomps[name] = comp.default || comp;
        }
      }
    }

    return loader;
  };

  // ========== 原有方法保持兼容 ==========
  lib.loadts = (params: any = {}) => {
    const ens: any = {};
    Object.entries(params.files).forEach(([path, modulefile]: any) => {
      const name = path.split('/').pop()?.slice(0, -3);
      if (name) ens[name] = modulefile.default;
    });
    params.app.config.globalProperties[params.key] = ens;
  };

  lib.loadv = (params: any = {}) => {
    Object.entries(params.files).forEach(([path, modulefile]: any) => {
      const cname = path.split('/v-')[1]?.split('/')[0];
      if (cname && !lib.vuecomps[cname]) {
        lib.vuecomps[cname] = 1;
        params.app.directive(cname, modulefile.default);
      }
    });
  };

  return { lib, createComponentLoader };
};
