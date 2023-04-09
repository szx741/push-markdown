/*
 * @Author: szx
 * @Date: 2022-10-22 18:58:09
 * @LastEditTime: 2023-04-08 16:25:57
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\mdRenderer\markdown-text-to-html.ts
 */
/*
 * @Author: szx
 * @Date: 2022-07-29 19:27:08
 * @LastEditTime: 2023-04-08 15:41:32
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\mdRenderer\markdown-text-to-html.ts
 */
import { nodePath } from '#preload';
import frontMatter, { FrontMatterResult } from 'front-matter';
import highlight from 'highlight.js';
import { htmlToText } from 'html-to-text';
import MarkdownIt from 'markdown-it';
import { Attr } from './markdown-front-matter';
import { AbstractMode, publishConf } from '../conf/publish-conf';
import { transfromToLocalSrc } from '../utils/tools';
import { StringDecoder } from 'string_decoder';
export interface Post {
  filePath: string | undefined;
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

export function mdText2Html(md: MarkdownIt, content: FrontMatterResult<unknown>, attr: Attr, filePath: string) {
  const startTime = getTime();

  // 提取markdown转换成html的纯文本
  const markdown = content.body;
  const env = { title: attr.title, hasMath: false };
  const htmlText = md.render(markdown, env);

  // 处理markdown的html纯文本
  const { upload, html } = handleMarkdownHTML(htmlText, filePath);

  // 变成一个完整的Post
  const post: Post = {
    ...attr,
    title: attr.title || 'Unnamed',
    filePath,
    html,
    upload
  };
  // 处理Post
  handlePost(post, html);

  console.log(`渲染 ${post.title} 耗费${(getTime() - startTime).toFixed(2)}ms`);
  return post;
}

function handleMarkdownHTML(htmlText: any, filePath: string) {
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

function highlightCode(div: any) {
  const elements = div.querySelectorAll('pre code');
  if (elements) {
    for (let i = 0; i < elements.length; i++) {
      const code = elements[i];
      highlight.highlightElement(code);
    }
  }
}
