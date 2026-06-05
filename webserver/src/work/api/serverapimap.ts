module.exports = ($asai: any) => {
  // 调用 ServerApi 获取 apiWork 方法
  $asai.hostserverapi = {
    ...($asai.$lib.api || {}),
    ...require('./testkdd/Index'),
  };

  // 启动的API服务列表
  $asai.hostserverapis = Object.keys($asai.hostserverapi);
  $asai.hostconfig.logger?.lv?.view && console.info(666.101, 'API服务', $asai.hostserverapis);
};
