module.exports = ($asai: any) => {
  function work(reqdata: any, ws: any, hostdir: string, req: any) {
    $asai.asaimock?.wsWorkApi({
      reqdata,
      ws,
      hostdir,
      req,
    });
  }
  return { work };
};
