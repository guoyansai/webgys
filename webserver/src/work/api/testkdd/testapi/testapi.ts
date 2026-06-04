module.exports = ($asai: any) => {
    return $asai.$lib.AsDb($asai, {
        // 数据类型
        type: 'file',
        // 数据配置
        opt: {
            ext: '.json', // 文件后缀名
            dir: 'webdata/webdb/asaifile/', // 文件所在文件夹
            create: 1, // 是否自动创建缺失文件夹
        },
        field: {
            key: 'name',
            data: ['name', 'content'],
        },
        post: (
            req: any,
            res: any,
            hostdir: string,
            opt: any,
            DataServer: any
        ) => {
            if (req.url.startsWith('/api/asaichannel/file/post')) {
                // $asai.$log(666.6677, req.url, opt);
                // 支持自拟函数处理
                res.end(
                    JSON.stringify($asai.$lib.As.ctxSuccess({ data: 'post' }, opt))
                );
                return 'ok';
            }
        },
        get: (
            req: any,
            res: any,
            hostdir: string,
            opt: any,
            DataServer: any
        ) => {
            if (req.url.startsWith('/api/asaichannel/file/get')) {
                const dataObj: any = opt.data;
                // $asai.$log(666.7788, req.url, opt);
                // 支持自拟函数处理
                DataServer.sqlDb({
                    type: 'insert',
                    table: dataObj.table,
                })
                    .then((resdb: any) => {
                        res.end(JSON.stringify($asai.$lib.As.ctxSuccess(resdb, opt)));
                    })
                    .catch((errdb: any) => {
                        res.end(JSON.stringify($asai.$lib.As.ctxFail(errdb)));
                    });
                return 'ok';
            }
        },
    });
};
