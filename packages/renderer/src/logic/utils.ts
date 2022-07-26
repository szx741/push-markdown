/*
 * @Author: szx
 * @Date: 2021-08-27 17:11:08
 * @LastEditTime: 2022-07-26 19:33:25
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\logic\utils.ts
 */
'use strict';
import { other, nodePath, ipc } from '#preload';

export function fileName(file: string) {
  return nodePath.pathBasename(file, '.md');
}

export function toStr(src: any) {
  return (src && typeof src === 'string' && src) || null;
}

export function toStrArr(src: any) {
  if (src) {
    if (typeof src === 'string') {
      return [src];
    } else if (src instanceof Array) {
      return src.map((s) => toStr(s)).filter((s) => s);
    }
  }
  return null;
}

// console.log(import.meta.url);
// import sampleUrl from '/public/sample.md';
// console.log(sampleUrl, import.meta.url);
const sampleFile = nodePath.pathJoin(ipc.syncMsg('__static'), '/sample.md');

export function isSampleFile(file: any) {
  return file === sampleFile;
}

export function getSampleFile() {
  return sampleFile;
}

export function openSampleFile() {
  ipc.send('menu.sample');
}

export function openSettings() {
  ipc.send('menu.settings');
}

//链接监听，如果带有data-href，那么就是打开应用内链接，否则就是用外部浏览器打开链接
function linkListener(this: HTMLAnchorElement, e: MouseEvent) {
  const attribute = this.getAttribute('data-href');
  if (attribute) {
    switch (attribute) {
      case 'settings':
        e.preventDefault();
        openSettings();
        return;
      case 'sample':
        e.preventDefault();
        openSampleFile();
        return;
    }
  }
  const href = this.href;
  if (href) {
    if (/^https?:\/\//.test(href)) {
      e.preventDefault();
      other.shell.openExternal(href);
    } else {
      e.preventDefault();
    }
  }
}

//设置链接
export function setLinks(node: HTMLDivElement) {
  if (node) {
    const elements = node.getElementsByTagName('a');
    if (elements) {
      for (const el of elements) {
        el.removeEventListener('click', linkListener);
        el.addEventListener('click', linkListener, false);
      }
    }
  }
}

export function setTextareaTabKey(textarea: any) {
  if (textarea) {
    textarea.onkeydown = function (e: any) {
      if (e.keyCode === 9 || e.which === 9) {
        e.preventDefault();
        const s = this.selectionStart;
        this.value = this.value.substring(0, this.selectionStart) + '\t' + this.value.substring(this.selectionEnd);
        this.selectionEnd = s + 1;
      }
    };
  }
}
