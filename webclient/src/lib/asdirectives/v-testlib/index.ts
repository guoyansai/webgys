import type { Directive } from 'vue';
const vTmp: any = {};
// 定义VUE3指令
const vTest: Directive = {
    mounted(el: any, binding: any) {},

    // 在卸载时清理事件监听
    unmounted(el) {},
};

// 局部使用：
export default vTest;

// 全局使用示例：
// const directives = {
//   install: function (app: any) {
//     app.directive('move', vTest);
//   },
// };

// export default directives;
