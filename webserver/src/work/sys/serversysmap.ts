module.exports = ($asai: any) => {
  // 调用 ServerSys 获取 sysWork 方法
  const CommonModule = $asai.$lib.ServerSys ? $asai.$lib.ServerSys($asai) : {};
  $asai.hostserversys = {
    ...(CommonModule || {}),
    'sys/test': require('./testkdd/test.ts'),
  };

  // 启动的SYS服务列表
  $asai.hostserversyss = Object.keys($asai.hostserversys);
  $asai.hostconfig.logger?.lv?.view && console.info(666.103, 'SYS服务', $asai.hostserversyss);
};
