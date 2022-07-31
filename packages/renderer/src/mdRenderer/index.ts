/*
 * @Author: szx
 * @Date: 2021-08-27 17:11:08
 * @LastEditTime: 2022-07-30 14:14:39
 * @Description: 渲染器，用于本地预览和远程发布
 * @FilePath: \push-markdown\packages\renderer\src\mdRenderer\index.ts
 */
'use strict';
import { markdownItInit } from './markdown-it-init';
import { mdText2Html } from './markdown-text-to-html';
export type { Post } from './markdown-text-to-html';
let md = markdownItInit();

export function notifyConfigChanged() {
  md = markdownItInit();
}

export function mdRender(fileText: string, filePath: string, isPreview: boolean) {
  return mdText2Html(md, fileText, filePath, isPreview);
}
