/*
 * @Author: szx
 * @Date: 2021-07-10 15:38:00
 * @LastEditTime: 2021-07-10 21:31:31
 * @Description:
 * @FilePath: \push-markdown\src\logic\renderer\mathjax-front-renderer.ts
 */
/**
 * MathJax front renderer. Render mathjax code into math formula in browser enverionment.
 *
 * Created by jzj on 2018/12/22.
 */
'use strict';

// import { typesetMath, mathJaxPath } from 'mathjax-electron';
import { loadScript } from '../utils';
let MathJax: any;
async function loadMathJax() {
  if (typeof MathJax === 'undefined' || MathJax === null) {
    MathJax = {
      'fast-preview': { disabled: true },
      tex2jax: {
        preview: 'none',
        inlineMath: [['\\(', '\\)']]
      }
    };
    console.log(window.api.pathJoin(process.env.VUE_APP_BASE_URL, '/lib/MathJax.js'));
    await loadScript(document, 'file://' + window.api.pathJoin(process.env.VUE_APP_BASE_URL, '/lib/MathJax.js'));
  }
}

function typesetMath(container: any, callback: any) {
  try {
    if (typeof callback === 'function') {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, container], callback);
    } else {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, container]);
    }
  } catch (error) {
    throw new Error(error.message + 'typesetMath');
  }
}
export async function render(container: any, timeout = 3000) {
  await loadMathJax();

  return new Promise<void>((resolve, reject) => {
    const handle = setTimeout(() => {
      console.error('typeset timeout');
      resolve();
    }, timeout);
    try {
      console.log(window.api.typesetMath);
      // window.api.typesetMath(container, () => {
      //   clearTimeout(handle);
      //   resolve();
      // });
      // typesetMath(container, () => {
        // clearTimeout(handle);
        // resolve();
      // });
    } catch (e) {
      clearTimeout(handle);
      reject(e);
    }
  });
}
