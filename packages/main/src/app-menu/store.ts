/*
 * @Author: szx
 * @Date: 2021-07-04 18:47:44
 * @LastEditTime: 2022-07-31 15:35:31
 * @Description: electron-sotre存储语言值
 * @FilePath: \push-markdown\packages\main\src\app-menu\store.ts
 */

'use strict';

import Store from 'electron-store';

// 存储的文件名为settings
const store = new Store({ name: 'settings' });

export function getLang() {
  return store.get('language', 'zh');
}

export function setLang(lang: string) {
  return store.set('language', lang);
}
export function getTheme() {
  return store.get('theme', true);
}

export function setTheme(theme: boolean) {
  return store.set('theme', theme);
}
