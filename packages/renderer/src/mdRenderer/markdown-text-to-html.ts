/*
 * @Author: szx
 * @Date: 2022-07-29 19:27:08
 * @LastEditTime: 2023-04-06 19:55:59
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\mdRenderer\markdown-text-to-html.ts
 */
import { nodePath } from '#preload';
import frontMatter from 'front-matter';
import highlight from 'highlight.js';
import { htmlToText } from 'html-to-text';
import MarkdownIt from 'markdown-it';
import { transliterate as tr } from 'transliteration';
import slugi from '@sindresorhus/slugify';

import { AbstractMode, publishConf } from '../conf/publish-conf';
import { mdFileName } from '../utils/tools';
interface Attr {
  title: string | undefined;
  abstract: string | undefined;
  url: string | undefined;
  tags: string[] | undefined;
  categories: string[] | undefined;
  authors: string[] | undefined;
  date: Date | undefined;
  thumbnail: string | undefined;
  other_images: string[] | undefined;
}

export interface Post {
  filePath: string | undefined;
  fileText: string | undefined;
  title: string;
  html: string;
  abstract: string | undefined;
  url: string | undefined;
  tags: string[] | undefined;
  categories: string[] | undefined;
  authors: string[] | undefined;
  date: Date | undefined;
  thumbnail: string | undefined;
  other_images: string[] | undefined;
  upload: string;
}

const blank = decodeURI('%E3%80%80');

export function mdText2Html(md: MarkdownIt, fileText: string, filePath: string, isPreview: any) {
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
  const { upload, html } = handleMarkdownHTML(htmlText, filePath, isPreview);

  // 变成一个完整的Post
  const post: Post = {
    ...attr,
    title: attr.title || mdFileName(filePath) || 'Unnamed',
    filePath: filePath,
    thumbnail: transfromToLocalSrc(nodePath.pathDirname(filePath), attr.thumbnail),
    other_images: otherImagesTrans(nodePath.pathDirname(filePath), attr.other_images),
    fileText: fileText,
    html,
    upload
  };
  // 处理Post
  handlePost(post, html);

  console.log(`渲染 ${post.title} 耗费${(getTime() - startTime).toFixed(2)}ms`);
  return post;
}

// 解析前面yaml的文件格式
function extractFrontMatter(contentAttr: any) {
  const attr: Attr = {
    title: undefined,
    abstract: undefined,
    url: undefined,
    tags: undefined,
    categories: undefined,
    authors: undefined,
    date: undefined,
    thumbnail: undefined,
    other_images: undefined
  };
  attr.title = toStr(contentAttr.title);
  attr.abstract = toStr(contentAttr.abstract);
  if (toStr(contentAttr.url)) attr.url = toStr(contentAttr.url);
  attr.tags = toStrArr(contentAttr.tags || contentAttr.tag);
  attr.categories = toStrArr(contentAttr.categories || contentAttr.category);
  attr.authors = toStrArr(contentAttr.authors || contentAttr.author);
  attr.date = contentAttr.date && toSystemTimezone(contentAttr.date);
  attr.thumbnail = toStr(contentAttr.thumbnail);
  attr.other_images = toStrArr(contentAttr.other_images || contentAttr.other_image);
  return attr;
}

function handleMarkdownHTML(htmlText: any, filePath: string, isPreview: any) {
  // 创建HTML样式（非文本格式）
  const div = createInvisibleDiv(document, htmlText);
  // 把tab键转换成Emsp，（因为tab在网页里面只是一个半角空格，这里转换成全角空格）
  tab2Emsp(div);

  // 替换本地文件URL
  replaceLocalImages(div, nodePath.pathDirname(filePath));

  // 保存一份没有被代码高亮，在上传的时候用这份
  const upload = div.innerHTML;

  // 代码高亮，在本地一定会用的
  highlightCode(div);

  return { upload, html: div.innerHTML };
}

function handlePost(post: Post, html: string) {
  // 如果post的url为空，那么就就title转换成拼音
  if (!post.url) post.url = slugi(tr(post.title.replace(/(\d+)/g, ' $1 '))).replace(/^-|-$/g, '');
  // 判断摘要从哪里提取
  if (!post.abstract) {
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
  const abstractNum = publishConf.value.abstractNum;
  let startIndex = 0;
  if (text.startsWith(title)) startIndex = title.length;
  if (text.length > abstractNum + startIndex) text = text.substring(startIndex, abstractNum + startIndex).trim() + '...';
  return text;
}

function toStr(src: any) {
  return (src && typeof src === 'string' && src) || undefined;
}

function toStrArr(src: string | string[] | null | undefined): string[] | undefined {
  if (typeof src === 'string') {
    return [src];
  } else if (src instanceof Array) {
    const res = src.map((s) => toStr(s)).filter((s) => s);
    return res.length == 0 ? undefined : res;
  }
  return undefined;
}

function toSystemTimezone(date: Date) {
  const timezoneOffset = new Date().getTimezoneOffset();
  const time = date.getTime();
  date.setTime(time + timezoneOffset * 60 * 1000);
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
    let src: any = img.getAttribute('src');
    src = transfromToLocalSrc(filePath, src);
    if (!src) continue;
    img.setAttribute('src', src);

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

function otherImagesTrans(filePath: string, src: string[] | undefined) {
  if (!src) return undefined;
  let res = [];
  for (let i of src) {
    let src = transfromToLocalSrc(filePath, i);
    if (src) res.push(src);
  }
  if (res.length === 0) return undefined;
  else return res;
}
function transfromToLocalSrc(filePath: string, src: string | undefined) {
  if (!src) return undefined;
  src = decodeURI(src);
  if (!src || src.match(/^((https?|file):\/\/|data:)/)) return undefined;
  if (!nodePath.pathIsAbsolute(src)) {
    src = nodePath.pathJoin(filePath, src);
  }
  return 'atom://' + src;
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
