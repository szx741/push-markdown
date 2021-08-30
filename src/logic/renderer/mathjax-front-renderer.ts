/*
 * @Author: szx
 * @Date: 2021-07-10 15:38:00
 * @LastEditTime: 2021-08-30 17:11:18
 * @Description:
 * @FilePath: \push-markdown\src\logic\renderer\mathjax-front-renderer.ts
 */
/**
 * MathJax front renderer. Render mathjax code into math formula in browser enverionment.
 *
 * Created by jzj on 2018/12/22.
 */
'use strict';

// import { typesetMath, mathJaxPath } from 'c-electron';
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
    console.log(window.api.pathJoin(window.api.syncMsg('__static'), '/lib/MathJax.js'));
    await loadScript(document, 'atom://' + window.api.pathJoin(window.api.syncMsg('__static'), '/lib/MathJax.js'));
    // await loadScript(document, '../../../public/lib/MathJax.js');
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
  console.log('container1:', container);

  await loadMathJax();
  console.log('container2:', container);
  return new Promise<void>((resolve, reject) => {
    const handle = setTimeout(() => {
      console.error('typeset timeout');
      resolve();
    }, timeout);
    try {
      console.log(window.api.typesetMath);
      window.api.typesetMath(container, () => {
        clearTimeout(handle);
        resolve();
      });
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
