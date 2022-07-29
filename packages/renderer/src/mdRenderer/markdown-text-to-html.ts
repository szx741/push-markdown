/*
 * @Author: szx
 * @Date: 2022-07-29 19:27:08
 * @LastEditTime: 2022-07-29 21:27:49
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\mdRenderer\markdown-text-to-html.ts
 */
import { nodePath } from '#preload';
import frontMatter from 'front-matter';
import highlight from 'highlight.js';
import { htmlToText } from 'html-to-text';
import MarkdownIt from 'markdown-it';
import { slugify } from 'transliteration';

import {} from '../configuration/render-conf';
import { AbstractMode, publishConf } from '../configuration/publish-conf';

import * as config from '../logic/config';
import { fileName } from '../logic/utils';
import * as mermaidRenderer from './mermaid-front-renderer';

const blank = decodeURI('%E3%80%80');

interface Attr {
  title: string | null;
  abstract: string | null;
  url: string | null;
  tags: string[] | null;
  categories: string[] | null;
  authors: string[] | null;
  date: Date | null;
}

export interface Post {
  file: string | null;
  src: string | null;
  title: string;
  html: string | null;
  url: string | null;
  tags: string[] | null;
  categories: string[] | null;
  authors: string[] | null;
  date: Date | null;
  abstract: string | null;
}

export function mdText2Html(md: MarkdownIt, fileText: string, filePath: string, isPreview = true) {
  const startTime = getTime();
  fileText = (fileText && fileText.trim()) || '';
  // 解析markdown，content包含yaml和markdown正文两部分
  const content = frontMatter(fileText);

  // 提取front matter，就是yaml配置的博客信息
  const attr = extractFrontMatter(content.attributes);

  // 提取markdown转换成html的纯文本
  const markdown = content.body;
  const env = { title: attr.title, hasMath: false };
  const htmlText = md.render(markdown, env);

  // 处理markdown的html纯文本
  const html = handleMarkdownHTML(htmlText, filePath);

  // 变成一个完整的Post
  const post: Post = {
    ...attr,
    title: attr.title || fileName(filePath) || 'Unnamed',
    file: filePath,
    src: fileText,
    html
  };

  // 处理Post
  handlePost(post, html);

  console.log(`渲染Post总共花费时间： ${getTime() - startTime} ms`);
  return post;
}

function extractFrontMatter(contentAttr: any) {
  const attr: Attr = {
    title: null,
    abstract: null,
    url: null,
    tags: null,
    categories: null,
    authors: null,
    date: null
  };
  attr.title = toStr(contentAttr.title);
  attr.abstract = toStr(contentAttr.abstract);
  attr.url = contentAttr.url && slugify(toStr(contentAttr.url));
  attr.tags = toStrArr(contentAttr.tags || contentAttr.tag);
  attr.categories = toStrArr(contentAttr.categories || contentAttr.category);
  attr.authors = toStrArr(contentAttr.authors || contentAttr.author);
  attr.date = contentAttr.date && toSystemTimezone(contentAttr.date);
  return attr;
}

function handleMarkdownHTML(htmlText: any, filePath: string) {
  // 创建HTML样式（非文本格式）
  const div = createInvisibleDiv(document, htmlText);
  // 把tab键转换成Emsp，（因为tab在网页里面只是一个半角空格，这里转换成全角空格）
  tab2Emsp(div);

  // 替换本地文件URL
  replaceLocalImages(div, nodePath.pathDirname(filePath));
  // 代码高亮
  // if (shouldRenderFeature(isPreview, renderConfig.highlight)) {
  highlightCode(div);
  // }
  // 是否渲染mermaid
  // if (shouldRenderFeature(isPreview, renderConfig.mermaid)) {
  mermaidRenderer.render(div);
  // }
  return div.innerHTML;
}

function handlePost(post: Post, html: string) {
  // 如果post的url为空，那么就就title转换成拼音
  if (post.url === null) post.url = slugify(post.title);

  // 判断摘要从哪里提取
  if (post.abstract === null) {
    switch (publishConf.value.abstractMode) {
      case AbstractMode.Title:
        post.abstract = post.title;
        break;
      case AbstractMode.Article:
        post.abstract = extractAbstract(post.title, html);
        break;
      case AbstractMode.Empty:
      default:
        break;
    }
  }
}

// 从html正文里面提取出摘要，一般是120字，去除标题
function extractAbstract(title: string, html: string) {
  let text = htmlToText(html, {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true,
    preserveNewlines: true,
    uppercaseHeadings: false,
    singleNewLineParagraphs: true
  });
  //这块可以优化
  const abstractNum = config.getAbstractNumber();
  let startIndex = 0;
  if (text.startsWith(title)) startIndex = title.length;
  if (text.length > abstractNum + startIndex) text = text.substring(startIndex, abstractNum + startIndex).trim() + '...';
  return text;
}

function toStr(src: any) {
  return (src && typeof src === 'string' && src) || null;
}

function toStrArr(src: string | string[] | null | undefined): string[] | null {
  if (typeof src === 'string') {
    return [src];
  } else if (src instanceof Array) {
    return src.map((s) => toStr(s)).filter((s) => s);
  }
  return null;
}

function toSystemTimezone(date: Date) {
  const timezoneOffset = new Date().getTimezoneOffset();
  const time = date.getTime();
  date.setTime(time + timezoneOffset * 60 * 1000);
  // console.log('old time, new time, offset =', time, date.getTime(), timezoneOffset)
  return date;
}

function createInvisibleDiv(document: Document, htmlText: string) {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.height = '0';
  div.style.width = '100%';
  div.style.overflowY = 'hidden';
  div.style.left = '0';
  div.style.top = '0';
  div.innerHTML = htmlText;
  // console.log('图片使用绝对路径这里会报错，但不影响使用');
  return div;
}

function getTime() {
  return window.performance ? window.performance.now() : Date.now();
}

function tab2Emsp(div: HTMLElement) {
  const pElements = div.getElementsByTagName('p');
  for (const pe of pElements) {
    // pe.innerHTML = pe.innerHTML.replace(/\t/g, '&emsp;');
    pe.innerHTML = pe.innerHTML.replace(/\t/g, blank);
  }

  const hArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  for (const h of hArr) {
    const hElements = div.getElementsByTagName(h);
    for (const he of hElements) {
      // pe.innerHTML = pe.innerHTML.replace(/\t/g, '&emsp;');
      he.innerHTML = he.innerHTML.replace(/\t/g, blank);
    }
  }
}

//找到markdown原来的图片路径，替换成atom路径
function replaceLocalImages(div: HTMLElement, filePath: string) {
  // HTMLElement
  const elements = div.getElementsByTagName('img');

  for (const img of elements) {
    let src = img.getAttribute('src');
    if (!src) continue;
    src = decodeURI(src);
    if (!src || src.match(/^((https?|file):\/\/|data:)/)) {
      continue;
    }
    if (!nodePath.pathIsAbsolute(src)) {
      src = nodePath.pathJoin(filePath, src);
    }
    img.setAttribute('src', 'atom://' + src);

    const pImg = img.parentElement;
    // console.log('tagName:', pImg?.tagName);
    if (pImg) {
      if (pImg.tagName == 'P') {
        // 如果有个父标签p，并且没有内置文本，那么就是一张单独的大图，就可以居中显示
        if (!pImg.innerText) {
          pImg.setAttribute('align', 'center');
          pImg.classList.add('fancybox-wrapper', 'lazyload-container-unload');
          pImg.setAttribute('data-fancybox', 'post-images');
          // pImg.setAttribute('href',img.getAttribute())
        }
      } else {
        // 这种情况对应markdown使用img标签，由于markdown-it渲染的时候不考虑img这种标签，不会套一个p标签，因此需要手动套一个
        const ele = document.createElement('p');
        ele.setAttribute('align', 'center');
        ele.classList.add('fancybox-wrapper', 'lazyload-container-unload');
        ele.setAttribute('data-fancybox', 'post-images');
        pImg.replaceChild(ele, img);
        ele.appendChild(img);
      }
    }
  }
}

function shouldRenderFeature(isPreview: any, config: any) {
  if (isPreview) {
    return config === 'preview' || config === 'publish';
  } else {
    return config === 'publish';
  }
}

function highlightCode(div: any) {
  const elements = div.querySelectorAll('pre code');
  if (elements) {
    for (let i = 0; i < elements.length; i++) {
      const code = elements[i];
      highlight.highlightElement(code);
    }
  }
}