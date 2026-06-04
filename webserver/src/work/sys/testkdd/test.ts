module.exports = ($asai: any) => {
    function show(req: any, res: any, hostdir: string, opt: any) {
        // 守护服务控制台
        if (req.url.startsWith('/sys/file/submit')) {
            // 处理POST请求
            let postdata = '';
            req.on('data', (chunk: any) => {
                postdata += chunk;
            });
            req.on('end', (data: any) => {
                $asai.$log(666.8809, postdata);
            });
        }
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(
            `
    <h1>File Server</h1>
    <form action="/sys/file/submit/" method="post">
    <div>Server Name: <textarea name="filestr">111</textarea>
    <div>PassWord In: <input type="text" name="passwordin" value="asai"></div>
    <button type="submit">Submit</button>
    </form>
    <div id="submitmsg"></div>
    `
        );
    }

    return { show };
};
