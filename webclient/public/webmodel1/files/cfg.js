window.$CFG = {
    webpath: '/',// 如果设置为/，则需要手动编辑生成的index.html文件，确保解析路径一致。
    title: '',
};
window.$CFG.icon = window.$CFG.webpath + 'webmodel/files/favicon.ico';
window.$CFG.logo = window.$CFG.webpath + 'webmodel/files/logo.png';
if (window.$CFG.title) {
    document.title = window.$CFG.title;
    document.querySelector('link[rel="icon"]').href = window.$CFG.icon;
}
