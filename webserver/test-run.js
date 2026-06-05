// 测试脚本 - 模拟 ts-node 加载 app.ts
require('ts-node').register({
  project: undefined,
  compilerOptions: {
    module: 'commonjs',
    target: 'es2020',
    esModuleInterop: true,
  }
});
try {
  require('./app.ts');
  console.log('App loaded successfully');
} catch (e) {
  console.error('ERROR:', e.message);
  console.error('STACK:', e.stack);
}