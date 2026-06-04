module.exports = ($asai: any) => {
    // 挂载一些ws的全局变量，建议挂载在$asai
    $asai.$ws = {
        // 聊天模块配置
        chat: {
            temp: JSON.stringify({
                tm: {
                    timeout: null,
                    starttime: 0,
                    endtime: 0,
                    wait: 1000,
                    immediate: false,
                },
                db: [],
            }),
            rooms: {},
        },
    };
    return $asai.$lib.ServerWs($asai, { fn: require('./serverwsmap.ts') });
};
