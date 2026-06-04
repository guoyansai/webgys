module.exports = ($asai: any) => {
    function jsonpWork(req: any, res: any, hostdir: string) {
        // $asai.$log(666.888, req.url, req.headers.host);
        // 解析 URL 参数
        const url = new URL(req.url, `http://${req.headers.host}`);
        const callback = url.searchParams.get('callback');
        const path = url.searchParams.get('path');
        const type = url.searchParams.get('type');
        // $asai.$log(666.802, url, callback, path, type);
        // 检查是否有回调函数名、路径参数
        if (callback && path) {
            const { filePaths } = $asai.$lib.As.getFilePath(path);
            const fs = require('fs');
            fs.readFile(filePaths, 'utf8', (err: any, dataStr: string) => {
                let jsonpResponse;
                // $asai.$log(666.803, filePaths, dataStr);
                if (err) {
                    jsonpResponse = `${callback}(${JSON.stringify(
                        $asai.$lib.As.ctxFail('ERROR PATH')
                    )})`;
                } else {
                    if (type === 'txt') {
                        jsonpResponse = `${callback}(${JSON.stringify(
                            $asai.$lib.As.ctxSuccess(dataStr)
                        )})`;
                    } else {
                        try {
                            jsonpResponse = `${callback}(${JSON.stringify(
                                $asai.$lib.As.ctxSuccess(JSON.parse(dataStr))
                            )})`;
                        } catch (error) {
                            jsonpResponse = `${callback}(${JSON.stringify(
                                $asai.$lib.As.ctxSuccess(dataStr)
                            )})`;
                        }
                    }
                }
                // 设置响应头
                res.setHeader('Content-Type', 'application/javascript');
                res.statusCode = 200;
                // 发送响应
                res.end(jsonpResponse);
            });
        } else {
            // 如果没有回调函数名，返回错误响应
            res.statusCode = 400;
            res.end('ERROR JSONP');
        }
    }

    return { jsonpWork };
};
