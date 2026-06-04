module.exports = ($asai: any) => {
    return $asai.$lib.ServerSys($asai, { fn: require('./serversysmap.ts') });
};
