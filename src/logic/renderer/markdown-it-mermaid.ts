/*
 * @Author: szx
 * @Date: 2021-07-10 15:38:00
 * @LastEditTime: 2021-07-10 20:31:13
 * @Description:
 * @FilePath: \push-markdown\src\logic\renderer\markdown-it-mermaid.ts
 */
/**
 * mermaid preprocess
 *
 * markdown ==> html for mermaid
 *
 * ```mermaid ... ```  ==>  <div class="mermaid">...</div>
 *
 * Reference:
 *   https://github.com/mermaid-js/mermaid
 *   https://github.com/tylingsoft/markdown-it-mermaid
 */
'use strict';

import mermaid from 'mermaid';

const mermaidChart = (code: any) => {
  try {
    mermaid.parse(code);
    return `<div class="mermaid">${code}</div>`;
  } catch ({ str, hash }) {
    return `<pre>${str}</pre>`;
  }
};

export function markdownItMermaid(md: any) {
  md.mermaid = mermaid;
  const temp = md.renderer.rules.fence.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens: any, idx: any, options: any, env: any, slf: any) => {
    const token = tokens[idx];
    const code = token.content.trim();
    if (token.info === 'mermaid') {
      return mermaidChart(code);
    }
    // const firstLine = code.split(/\n/)[0].trim()
    // if (firstLine.match(/^((graph (TB|BT|RL|LR|TD);?)|sequenceDiagram|gantt|classDiagram|stateDiagram|pie)$/)) {
    //   return mermaidChart(code)
    // }
    return temp(tokens, idx, options, env, slf);
  };
}
