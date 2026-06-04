// 导出默认对象，包含install方法，用于安装库中的指令、模块和组件
// app: Vue应用实例
// opt: 配置对象，包含加载指令、模块和组件的方法
export default {
  install(app: any, opt: any) {
    opt.loadv({
      app,
      eager: true,
      files: (import.meta as any).glob(['./asdirectives/*/index.ts'], { eager: true }),
    });
    opt.loadts({
      app,
      key: '$engineasailib',
      eager: true,
      files: (import.meta as any).glob(['./asengine/*/use*.ts'], { eager: true }),
    });
    opt.loadvue({
      loadfn: opt.loadfn,
      app,
      eager: false,
      files: (import.meta as any).glob(['./asui/*/*.vue']),
    });
  },
};
