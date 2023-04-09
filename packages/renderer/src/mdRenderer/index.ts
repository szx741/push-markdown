/*
 * @Author: szx
 * @Date: 2021-08-27 17:11:08
 * @LastEditTime: 2023-04-09 14:29:08
 * @Description: 渲染器，用于本地预览和远程发布
 * @FilePath: \push-markdown\packages\renderer\src\mdRenderer\index.ts
 */
'use strict';
import frontMatter, { FrontMatterResult } from 'front-matter';
import { extractFrontMatter } from './markdown-front-matter';
import { markdownItInit } from './markdown-it-init';
import { mdText2Html } from './markdown-text-to-html';
import { Attr } from './markdown-front-matter';
export type { Post } from './markdown-text-to-html';
export type { Attr } from './markdown-front-matter';

let md = markdownItInit();

export function notifyConfigChanged() {
  md = markdownItInit();
}

export function mdContentToHtml(content: FrontMatterResult<unknown>, attr: Attr, filePath: string) {
  return mdText2Html(md, content, attr, filePath);
}

export function mdRender(fileText: string, filePath: string) {
  const { content, attr } = mdRenderFrontMatter(fileText, filePath);
  return mdText2Html(md, content, attr, filePath);
}

export function mdRenderFrontMatter(fileText: string, filePath: string) {
  fileText = (fileText && fileText.trim()) || '';
  // 解析markdown，content包含yaml和markdown正文两部分
  const content = frontMatter(fileText);
  // 提取front matter，就是yaml配置的博客信息
  return {
    content,
    attr: extractFrontMatter(content.attributes, filePath)
  };
}
