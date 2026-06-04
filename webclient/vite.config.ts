// 导入 Node.js 的 url 模块中的 fileURLToPath 和 URL 函数
import { fileURLToPath, URL } from 'node:url';
// 导入 Vite 的 defineConfig 和 loadEnv 函数
import { defineConfig, loadEnv } from 'vite';
// 导入 Vite 的 Vue 插件
import vue from '@vitejs/plugin-vue';
// 导入混淆插件（仅在打包完成后对 bundle 进行轻度混淆，确保安全且不报错）
import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator';

// 导出 Vite 配置
export default defineConfig(({ mode }) => {
    // 定义输出文件名对象
    let outputNames: any = {};
    // 从环境变量中加载配置
    const {
        VITE_HTTP_HOST,
        VITE_HTTP_PORT,
        VITE_HTTP_API,
        VITE_DIST_DIR,
        VITE_API_URL,
        VITE_WEB_PATH,
        VITE_OBFUSCATE_ENABLE
    } = loadEnv(mode, process.cwd(), '');

    // 判断是否为开发环境
    const IS_DEV = mode === 'development';
    const IS_OBFUSCATE_ENABLED = VITE_OBFUSCATE_ENABLE == '1';

    // 设置输出文件名（生产环境使用纯哈希，不暴露自定义标识）
    outputNames = {
        entryFileNames: IS_DEV ? 'assets/entry/as-[hash].js' : 'assets/entry/js-asai-[hash].js',
        chunkFileNames: IS_DEV ? 'assets/chunk/asai-as-[hash].js' : 'assets/chunk/js-asai-[hash].js',
        assetFileNames: IS_DEV ? 'assets/asset/[ext]-as-[hash].[ext]' : 'assets/asset/[ext]-asai-[hash].[ext]',
    };

    // 手动代码分割函数
    const manualChunks = !IS_DEV
        ? (id: any) => {
            if (id.includes('node_modules')) {
                // 将大型第三方库单独分包
                if (id.includes('monaco-editor')) return 'vendor-lua';
                if (id.includes('three')) return 'vendor-3d';
                if (id.includes('x6')) return 'vendor-flow';
                if (id.includes('vue')) return 'vendor-main';
                if (id.includes('qrcode')) return 'vendor-qrcode';
                if (id.includes('pinyin')) return 'vendor-pinyin';
                // 其他 node_modules 按包名分包
                return id.toString()
                    .split('node_modules/')[1]
                    .split('/')[0]
                    .toString();
            }
        }
        : undefined;

    // 定义 Vite 插件数组
    const plugins = [
        vue(),
        // 生产环境启用轻度混淆（欧盟安全合规，且避免运行时错误）
        ...((!IS_DEV && IS_OBFUSCATE_ENABLED) ? [
            vitePluginBundleObfuscator({
                enable: true,
                autoExcludeNodeModules: true,   // 自动排除 node_modules
                threadPool: true,               // 多线程加速
                // 排除手动分包的 vendor 库，避免破坏第三方库内部逻辑
                excludes: [
                    'vendor-lua', 'vendor-3d', 'vendor-flow',
                    'vendor-main', 'vendor-qrcode', 'vendor-pinyin'
                ],
                options: {
                    compact: true,
                    target: 'browser',
                    // 关键：禁用 stringArray 和控制流扁平化，彻底解决 _0x... undefined 错误
                    stringArray: false,
                    controlFlowFlattening: false,
                    deadCodeInjection: false,
                    // 保留标识符重命名和 console 移除
                    identifierNamesGenerator: 'hexadecimal',
                    renameGlobals: false,
                    selfDefending: false,
                    debugProtection: false,
                    disableConsoleOutput: true,
                    simplify: true,
                    splitStrings: false,
                    transformObjectKeys: false,
                },
                log: false,
            }),
        ] : []),
    ];

    return {
        plugins,
        base: VITE_WEB_PATH || './',
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        optimizeDeps: {
            include: [
                'monaco-editor/esm/vs/language/json/json.worker',
                'monaco-editor/esm/vs/editor/editor.worker',
            ],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                    silenceDeprecations: ['legacy-js-api'],
                },
            },
        },
        server: {
            // 安全响应头（符合欧盟 GDPR / CSP 建议）
            headers: {
                'Cross-Origin-Embedder-Policy': 'require-corp',
                'Cross-Origin-Opener-Policy': 'same-origin',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
            },
            host: VITE_HTTP_HOST,
            port: Number(VITE_HTTP_PORT),
            open: true,
            cors: true,
            proxy: {
                ['^' + VITE_API_URL]: {
                    target: VITE_HTTP_API,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(new RegExp('^' + VITE_API_URL), ''),
                },
            },
        },
        build: {
            // 生产环境禁用 sourcemap（防止源码泄露）
            sourcemap: false,
            outDir: VITE_DIST_DIR,
            emptyOutDir: true,
            rollupOptions: {
                output: {
                    ...outputNames,
                    manualChunks,
                    inlineDynamicImports: false,
                },
            },
            chunkSizeWarningLimit: 15000,
            cssCodeSplit: true,
            assetsInlineLimit: 10000,
            minify: !IS_OBFUSCATE_ENABLED ? 'esbuild' : 'terser',
            target: 'es2020',  // 兼顾兼容性与现代特性
            terserOptions: {
                compress: {
                    drop_console: !IS_DEV,
                    drop_debugger: !IS_DEV,
                    pure_funcs: !IS_DEV ? ['console.log', 'console.info', 'console.debug', 'console.warn'] : [],
                    passes: IS_OBFUSCATE_ENABLED ? 2 : 0, // 多轮压缩提升混淆效果
                },
                format: {
                    comments: false,
                    beautify: false,
                },
                mangle: {
                    toplevel: true,    // 混淆顶层变量名
                },
            },
        },
    };
});