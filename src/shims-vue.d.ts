/*
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2022-03-13 20:43:47
 * @Description:
 * @FilePath: \push-markdown\src\shims-vue.d.ts
 */
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare interface Window {
  log: any;
  writeFileSync: any;
  test: any;
  api: any;
}
declare const __static: string;
declare module 'markdown-it-mathjax3';
declare module 'markdown-it-table-of-contents';
declare module 'markdown-it-underline';
declare module 'markdown-it-title';
declare module 'markdown-it-task-lists';
