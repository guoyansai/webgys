module.exports = ($asai: any) => {
  // 调用 ServerWs 获取 wsWork 和 command 方法
  const CommonModule = $asai.$lib.ServerWs ? $asai.$lib.ServerWs($asai) : {};
  $asai.hostserverws = {
    ...(CommonModule || {}),
    'asaiws/testapi': require('./testkdd/asaiws/testapi.ts'),
    'asaiws/testlisten': require('./testkdd/asaiws/testlisten.ts'),
  };

  // 启动的ws指定服务
  $asai.hostserverwss = Object.keys($asai.hostserverws);
  $asai.hostconfig.logger?.lv?.view && console.info(666.102, 'WS服务', $asai.hostserverwss);
};
