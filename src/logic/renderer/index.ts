/**
 * 渲染器，用于本地预览和远程发布
 *
 * Created by jzj on 2018/12/11.
 */
'use strict';

import path from 'path';
import fm from 'front-matter';
import highlight from 'highlight.js';
import uslug from 'uslug';
import MarkdownIt from 'markdown-it';
import * as utils from '../utils';
import * as mermaidRenderer from './mermaid-front-renderer';
import * as mathJaxRenderer from './mathjax-front-renderer';
import * as config from '../config';
import { get } from './markdown-it-mathjax';
import { convert } from 'html-to-text';
import * as markdownItTitle from 'markdown-it-title';
import * as markdownItUnderline from 'markdown-it-underline';
import slugify from '@sindresorhus/slugify';
import * as markdownItAnchor from 'markdown-it-anchor';
import * as markdownItTableOfContents from 'markdown-it-table-of-contents';
import { markdownItMermaid } from './markdown-it-mermaid';
// import * as markdownItUnderline from 'markdown-it-underline';
// import * as markdownItUnderline from 'markdown-it-underline';

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
  // md.use(import('markdown-it-title'));
  md.use(markdownItTitle);

  // // underline syntax support
  md.use(markdownItUnderline);
  // console.log(markdownItUnderline);

  // generate anchor for heading
  md.use(markdownItAnchor, {
    slugify: (s: any) => slugify(s)
  });

  // generate toc
  md.use(markdownItTableOfContents, {
    markerPattern: /^\[toc]/im,
    includeLevel: [1, 2, 3, 4, 5, 6]
  });

  // code preprocess ( already done by markdown-it, no plugin needed )
  // ```js ... ```  ==>  <pre><code class="language-js"> ... </code></pre>

  // mathjax preprocess
  // $\frac{a}{b}$  ==>  \( \frac{a}{b} \)
  // $$ \frac{a}{b} $$  ==>  \[ \frac{a}{b} \]
  if (isFeatureEnabled(renderConfig.mathjax)) {
    md.use(get());
  }

  // // mermaid preprocess
  // // ```mermaid ... ```  ==>  <div class="mermaid">...</div>
  if (isFeatureEnabled(renderConfig.mermaid)) {
    md.use(markdownItMermaid);
  }
}

export function notifyConfigChanged() {
  init();
}

function replaceLocalImages(div: any, dir: any) {
  const elements = div.getElementsByTagName('img');

  for (let i = 0; i < elements.length; i++) {
    const img = elements[i];
    const src = img.getAttribute('src');
    if (!src || src.match(/^((https?|file):\/\/|data:)/)) {
      continue;
    }
    if (path.isAbsolute(src)) {
      img.setAttribute('src', 'file://' + src);
    } else {
      img.setAttribute('src', 'file://' + path.join(dir, src));
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
      highlight.highlightBlock(code);
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
  let string = convert(html, {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true,
    preserveNewlines: true,
    uppercaseHeadings: false,
    singleNewLineParagraphs: true
  });
  // const ssss = '<h1>Hello World</h1>';
  // const text = convert(ssss, {
  //   wordwrap: 130
  // });
  // const string = htmlToText.fromString(html, {
  //   wordwrap: false,
  //   ignoreHref: true,
  //   ignoreImage: true,
  //   preserveNewlines: true,
  //   uppercaseHeadings: false,
  //   singleNewLineParagraphs: true
  // });
  if (string.length > 100) {
    string = string.substr(0, 100) + '...';
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
 * @param src file content
 * @param file file path
 * @param isPreview true: preview, false: publish
 * @return {Promise<*>}
 */
export async function render(src: any, file: any, isPreview = true): Promise<any> {
  const startTime = getTime();
  src = (src && src.trim()) || '';
  // meta
  const content = fm(src);
  const markdown = content.body;
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
  let html = md.render(markdown, env);
  const div = createInvisibleDiv(document, html);
  // local image files
  replaceLocalImages(div, path.dirname(file));
  // highlight
  if (shouldRenderFeature(isPreview, renderConfig.highlight)) {
    await highlightCode(div);
  }
  // mermaid
  if (shouldRenderFeature(isPreview, renderConfig.mermaid)) {
    await mermaidRenderer.render(div);
  }
  // mathjax
  if (env.hasMath && shouldRenderFeature(isPreview, renderConfig.mathjax)) {
    document.body.appendChild(div);
    await mathJaxRenderer.render(div);
    document.body.removeChild(div);
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
  if (!post.abstract) {
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
  // console.log(post)
  return post;
}
