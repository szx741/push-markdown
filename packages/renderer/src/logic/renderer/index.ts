/*
 * @Author: szx
 * @Date: 2021-08-27 17:11:08
 * @LastEditTime: 2022-07-23 22:04:53
 * @Description: 渲染器，用于本地预览和远程发布
 * @FilePath: \push-markdown\packages\renderer\src\logic\renderer\index.ts
 */
'use strict';
// import path from 'path';
import fm from 'front-matter';
import highlight from 'highlight.js';
import MarkdownIt from 'markdown-it';
import * as utils from '../utils';
import * as mermaidRenderer from './mermaid-front-renderer';
import * as config from '../config';
import { htmlToText } from 'html-to-text';
import markdownItTitle from 'markdown-it-title';
import markdownItUnderline from 'markdown-it-underline';
import * as markdownItAnchor from 'markdown-it-anchor';
import * as markdownItTableOfContents from 'markdown-it-table-of-contents';
import { markdownItMermaid } from './markdown-it-mermaid';
import * as markdownItTaskCheckbox from 'markdown-it-task-checkbox';
import mathjax3 from 'markdown-it-mathjax3';
import uslug from 'uslug';
import { slugify as slug } from 'transliteration';
import { nodePath } from '#preload';
const blank = decodeURI('%E3%80%80');
let renderConfig: any;
let md: any;

init();

function init() {
  renderConfig = config.getRenderConfig();

  // https://github.com/markdown-it/markdown-it
  md = new MarkdownIt({
    html: true,
    breaks: true, // replace '\n' with <br>
    linkify: true // auto link
  });

  // extract title from markdown
  //提取标题
  md.use(markdownItTitle);

  // 下划线支持
  md.use(markdownItUnderline);

  // generate anchor for heading
  md.use(markdownItAnchor.default, { slugify: (s: string) => uslug(s) });
  // 目录插件
  // md.use(markdownItTableOfContents);
  md.use(markdownItTableOfContents, {
    markerPattern: /^\[toc]/im,
    includeLevel: [1, 2, 3, 4, 5, 6]
  });

  // 任务列表的支持
  md.use(markdownItTaskCheckbox, {
    disabled: true,
    divWrap: false
  });

  // // mermaid preprocess
  // // ```mermaid ... ```  ==>  <div class="mermaid">...</div>
  if (isFeatureEnabled(renderConfig.mermaid)) {
    md.use(markdownItMermaid);
  }

  if (isFeatureEnabled(renderConfig.mathjax)) {
    md.use(mathjax3);
  }
  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens: any, idx: any, options: any, env: any, self: any) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = function (tokens: any, idx: any, options: any, env: any, self: any) {
    // If you are sure other plugins can't add `target` - drop check below
    const aIndex = tokens[idx].attrIndex('target');
    const hIndex = tokens[idx].attrIndex('href');
    if (hIndex == 0) {
      // 将全角空格转换为-
      const decodedUrl = decodeURI(tokens[idx].attrs[hIndex][1].replace(/%E3%80%80/g, '-'));
      // 将锚点中所有的标点符号去除
      if (decodedUrl.indexOf('#') == 0) {
        tokens[idx].attrs[hIndex][1] = decodedUrl
          .replace(/[ |~|`|!|@|$|%|^|&|*|(|)|-|_|+|=||||[|\]|{|}|;|:|"|'|,|<|.|>|/|?|、|，|。|！|？|—|【|】|｛|｝|（|）|；|：|‘|’|“|”|《|》|￥]/g, '')
          .toLowerCase();
      }
    }
    if (aIndex < 0 && tokens[idx].attrs[hIndex][1].indexOf('#') != 0) {
      tokens[idx].attrPush(['target', '_blank']); // add new attribute
    }
    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };
}

export function notifyConfigChanged() {
  init();
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
function replaceLocalImages(div: HTMLElement, dir: any) {
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
      src = nodePath.pathJoin(dir, src);
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

function createInvisibleDiv(document: any, src: any) {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.height = '0';
  div.style.width = '100%';
  div.style.overflowY = 'hidden';
  div.style.left = '0';
  div.style.top = '0';
  div.innerHTML = src;
  console.log('图片使用绝对路径这里会报错，但不影响使用');
  return div;
}

function getTime() {
  return window.performance ? window.performance.now() : Date.now();
}

/**
 * code highlight
 *     <pre><code class="language-js"> ... </code></pre>
 * ==> <pre><code class="language-js"><span class="...">...</span><span>...</span></code></pre>
 */
function highlightCode(div: any) {
  const elements = div.querySelectorAll('pre code');
  if (elements) {
    for (let i = 0; i < elements.length; i++) {
      const code = elements[i];
      highlight.highlightElement(code);
    }
  }
}

function toSystemTimezone(date: any) {
  const timezoneOffset = new Date().getTimezoneOffset();
  const time = date.getTime();
  date.setTime(time + timezoneOffset * 60 * 1000);
  // console.log('old time, new time, offset =', time, date.getTime(), timezoneOffset)
  return date;
}

function extractAbstract(html: string) {
  // https://www.npmjs.com/package/html-to-text
  let string = htmlToText(html, {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true,
    preserveNewlines: true,
    uppercaseHeadings: false,
    singleNewLineParagraphs: true
  });
  const abstractNum = config.getAbstractNumber();
  if (string.length > abstractNum) {
    string = string.substring(0, abstractNum) + '...';
  }
  return string;
}

function isFeatureEnabled(config: any) {
  return config === 'preview' || config === 'publish';
}

function shouldRenderFeature(isPreview: any, config: any) {
  if (isPreview) {
    return config === 'preview' || config === 'publish';
  } else {
    return config === 'publish';
  }
}

/**
 * @param src markdown的文本内容
 * @param file 文件路径
 * @param isPreview true: preview, false: publish
 * @return {Promise<*>}
 */
export async function render(src: any, file: any, isPreview = true): Promise<any> {
  const startTime = getTime();
  src = (src && src.trim()) || '';
  // 解析文件内容，body为markdown正文内容
  const content = fm(src);

  const markdown = content.body;
  // // 文件前面yaml的文件内容
  const attr: any = content.attributes || {};
  attr.title = utils.toStr(attr.title);
  attr.abstract = utils.toStr(attr.abstract);
  attr.url = attr.url && uslug(utils.toStr(attr.url));
  attr.tags = utils.toStrArr(attr.tags || attr.tag);
  attr.categories = utils.toStrArr(attr.categories || attr.category);
  attr.authors = utils.toStrArr(attr.authors || attr.author);
  attr.date = attr.date && toSystemTimezone(attr.date);
  // markdown: html, title
  const env = { title: attr.title, hasMath: false };
  // 将markdown格式渲染成HTML格式
  let html = md.render(markdown, env);
  // console.log(html);
  // 创建一个不可见的div，并把html插入进入
  const div = createInvisibleDiv(document, html);
  // console.log(html);
  // console.log(div);
  tab2Emsp(div);
  // 替换本地文件URL
  replaceLocalImages(div, nodePath.pathDirname(file));
  // 代码高亮
  if (shouldRenderFeature(isPreview, renderConfig.highlight)) {
    highlightCode(div);
  }
  // 是否渲染mermaid
  if (shouldRenderFeature(isPreview, renderConfig.mermaid)) {
    await mermaidRenderer.render(div);
  }
  html = div.innerHTML;
  div.innerHTML = '';
  // post
  const post: any = {};
  post.file = file;
  post.src = src;
  post.markdown = markdown;
  post.title = env.title || utils.fileName(file) || 'Unnamed';
  post.html = html;
  post.url = attr.url; // || encodeURI(post.title)
  post.tags = attr.tags;
  post.categories = attr.categories;
  post.authors = attr.authors;
  post.date = attr.date;
  post.abstract = attr.abstract;
  // 如果post的url为空，那么就就title转换成拼音
  if (post.url == null) {
    post.url = slug(post.title);
    // post.url = window.api.slug(post.title);
    console.log('post.url:', post.url);
  }

  if (post.abstract == null) {
    switch (renderConfig.abstract) {
      case 'title':
        post.abstract = post.title;
        break;
      case 'article':
        post.abstract = extractAbstract(html);
        break;
      case 'empty':
      default:
        break;
    }
  }
  console.log(`render post cost ${getTime() - startTime} ms`);
  return post;
}
