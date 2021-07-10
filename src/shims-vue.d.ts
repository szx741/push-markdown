/*
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2021-07-10 16:21:53
 * @Description:
 * @FilePath: \push-markdown\src\shims-vue.d.ts
 */
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// interface Global {
//   document: Document;
//   window: Window;
//   navigator: Navigator;
// }
declare interface Window {
  MathJax: any;
}
declare interface Window {
  log: any;
  writeFileSync: any;
  test: any;
  api: any;
}

declare module 'mathjax-electron';
declare module 'markdown-it-table-of-contents';
declare module 'markdown-it-underline';
declare module 'markdown-it-title';


// declare global {
//   namespace NodeJS {
//     declare interface Window {
//       api: any;
//     }
//   }
// }
// declare var global:any;

// declare global {
//   interface globalData {
//     fileToOpen: any;
//   }
// }
