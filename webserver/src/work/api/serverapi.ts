module.exports = ($asai: any) => {
    return $asai.$lib.ServerApi($asai, { fn: require('./serverapimap.ts') });
};
