/*
 * @Author: szx
 * @Date: 2021-07-10 15:38:00
 * @LastEditTime: 2022-04-18 21:28:56
 * @Description:
 * @FilePath: \push-markdown\src\logic\renderer\mermaid-front-renderer.ts
 */
/**
 * Mermaid front renderer. Render mermaid code into svg graph in browser enverionment.
 *
 * Created by jzj on 2020-04-05.
 */
'use strict';

import mermaid from 'mermaid';
import he from 'he';

mermaid.initialize({
  startOnLoad: false,
  gantt: { axisFormat: '%Y-%m-%d' }
});

function renderElement(e: any) {
  const code = he.decode(e.innerHTML);
  e.innerHTML = mermaid.mermaidAPI.render('graphDiv', code);
}

export async function render(container: any, selector = '.mermaid') {
  const elements = container.querySelectorAll(selector);
  elements.forEach(renderElement);
}
