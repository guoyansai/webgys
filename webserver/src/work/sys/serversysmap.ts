module.exports = ($asai: any) => {
    $asai.hostserversys = {
        ...$asai.$lib.sys,
        'sys/test': require('./testkdd/test.ts'),
    };

    // 启动的API服务列表
    $asai.hostserversyss = Object.keys($asai.hostserversys);
    $asai.hostconfig.logger?.lv?.view &&
        console.info(666.103, 'SYS服务', $asai.hostserversyss);
};
