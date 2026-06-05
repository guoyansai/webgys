const $lib: any = require('./src/utils/lib');
const $asai: any = {
  $lib,
  connectionshttp: {},
  connectionsws: {},
  taskshttp: {},
  tasksws: {},
  servershttp: {},
  serversws: {},
  tm: 0,
  tmpdata: {},
};

// 读取配置文件与服务初始化
try {
  // fs功能
  $asai.asaifs = require('asai-nodejs-fs');

  $asai.asaifs
    .readJson('./websys/sys/asaihost.json', { encoding: 'utf8' })
    .then((cfg: any) => {
      // 配置数据
      $asai.hostconfig = cfg || {};

      // 插件功能
      $asai.asaihost = require('./src/plugs/asai-nodejs-host/AsaiHost');
      $asai.dataserver = require('./src/plugs/asai-nodejs-dbfile/db');

      //   $asai.asaihost = require('asai-nodejs-host');
      //   $asai.dataserver = require('asai-nodejs-dbfile');

      // 系统功能
      const { sysWork } = require('./src/work/sys/serversys')($asai);
      const { apiWork } = require('./src/work/api/serverapi')($asai);
      const { wsWork } = require('./src/work/ws/serverws')($asai);
      const { jsonpWork } = require('./src/work/ot/jsonp')($asai);
      const { StartAsaiHost, asaiWs } = $asai.asaihost($asai, {
        sysWork,
        apiWork,
        wsWork,
        jsonpWork,
      });
      $asai.asaiWs = asaiWs;
      console.log(666.555, $asai.hostconfig, $asai.asaiWs);
      if ($asai.hostconfig.ip) {
        StartAsaiHost();
      } else {
        $asai.asaifs
          .read($asai.hostconfig.path.ip)
          .then((ipdata: any) => {
            if (ipdata.toString()?.trim() && /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(?!$)|$)){4}$/.test(ipdata.toString().trim())) {
              $asai.hostconfig.ip = ipdata.toString().trim();
            }
            StartAsaiHost();
          })
          .catch((err: any) => {
            StartAsaiHost();
          });
      }
    })
    .catch((err: any) => {
      ($asai?.$log || console.error)?.('HOST', 'WebHost Config Is Error!', err);
    });
} catch (err) {
  ($asai?.$log || console.error)?.('HOST', 'WebHost Start Is Error!', err);
}
