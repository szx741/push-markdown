/*
 * @Author: szx
 * @Date: 2022-07-23 13:40:31
 * @LastEditTime: 2022-07-26 15:25:52
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\types\shims-vue.d.ts
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.md';
declare module 'markdown-it-mathjax3';
declare module 'markdown-it-table-of-contents';
declare module 'markdown-it-underline';
declare module 'markdown-it-title';
declare module 'markdown-it-task-lists';
declare module 'markdown-it-task-checkbox';
