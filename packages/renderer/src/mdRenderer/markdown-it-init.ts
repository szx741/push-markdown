/*
 * @Author: szx
 * @Date: 2022-07-29 19:22:43
 * @LastEditTime: 2022-08-04 12:24:59
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\mdRenderer\markdown-it-init.ts
 */
import MarkdownIt from 'markdown-it';
import markdownItTitle from 'markdown-it-title';
import markdownItUnderline from 'markdown-it-underline';
import markdownItAnchor from 'markdown-it-anchor';
import tableOfContents from 'markdown-it-table-of-contents';
import mathjax3 from 'markdown-it-mathjax3';
import taskCheckbox from 'markdown-it-task-checkbox';
import slugify from '@sindresorhus/slugify';

import { publishConf } from '../conf/publish-conf';

export function markdownItInit() {
  // https://github.com/markdown-it/markdown-it
  const md = new MarkdownIt({
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
  md.use(markdownItAnchor, { slugify: (s: string) => slugify(s) });
  // 目录插件
  // md.use(markdownItTableOfContents);
  md.use(tableOfContents, {
    markerPattern: /^\[toc]/im,
    includeLevel: [1, 2, 3, 4, 5, 6]
  });

  // 任务列表的支持
  md.use(taskCheckbox, {
    disabled: true,
    divWrap: false
  });

  if (publishConf.value.mathjax) {
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
  return md;
}
