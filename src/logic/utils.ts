/**
 * Created by jzj on 2018/12/16.
 */
'use strict';
// import { shell } from 'electron';
export function fileName(file: string) {
  return window.api.pathBasename(file, '.md');
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

const sampleFile = window.api.pathJoin(process.env.VUE_APP_BASE_URL, 'static/sample.md');

export function isSampleFile(file: any) {
  return file === sampleFile;
}

export function getSampleFile() {
  return sampleFile;
}

export function openSampleFile() {
  window.api.send('menu.sample');
  // remote.getCurrentWebContents().send('menu.sample');
}

export function openSettings() {
  window.api.send('menu.settings');
  // remote.getCurrentWebContents().send('menu.settings');
}

//链接监听，如果带有data-href，那么就是打开应用内链接，否则就是用外部浏览器打开链接
function linkListener(this: any, e: any) {
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
  if (href && /^https?:\/\//.test(href)) {
    e.preventDefault();
    window.api.shell.openExternal(href);
  }
}

//设置链接
export function setLinks(node: any) {
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

/**
 * insert script to document head
 *
 * @param document
 * @param src script src. file:///xxx.js
 * @param text script text. var a = 1...
 * @return {undefined|Promise<any>}
 */
export function loadScript(document: any, src: any, text: any = null): undefined | Promise<any> {
  return (
    (src || text) &&
    new Promise<void>((resolve, reject) => {
      try {
        console.log('document:', document);
        const script = document.createElement('script');
        script.type = 'text/javascript';
        if (src != undefined) {
          script.src = src;
        }
        if (text != undefined) {
          script.text = text;
        }

        script.addEventListener('load', () => {
          console.log('script load success [' + (src || text) + ']');
          resolve();
        });
        console.log('script:', script);
        document.getElementsByTagName('head')[0].appendChild(script);
      } catch (error) {
        console.error('script load failed [' + (src || text) + ']', error);
        reject(error);
      }
    })
  );
}
