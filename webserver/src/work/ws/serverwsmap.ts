module.exports = ($asai: any) => {
    $asai.hostserverws = {
        ...$asai.$lib.ws,
        'asaiws/testapi': require('./testkdd/asaiws/testapi.ts'),
        'asaiws/testlisten': require('./testkdd/asaiws/testlisten.ts'),
    };

    // 启动的ws指定服务
    $asai.hostserverwss = Object.keys($asai.hostserverws);
    $asai.hostconfig.logger?.lv?.view &&
        console.info(666.102, 'WS服务', $asai.hostserverwss);

    // 启动modbus通信服务
    $asai.hostserverws.command($asai)?.commandwork();
};
