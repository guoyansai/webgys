module.exports = ($asai: any) => {
    function work(reqdata: any, ws: any, hostdir: string, req: any) {
        $asai.asaimock?.wsWorkListen({
            reqdata,
            ws,
            hostdir,
            req,
        });
    }
    return { work };
};
