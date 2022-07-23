/*
 * @Author: szx
 * @Date: 2021-07-04 18:47:44
 * @LastEditTime: 2022-07-23 19:55:44
 * @Description: electron-sotre存储语言值
 * @FilePath: \push-markdown\packages\main\src\language-store.ts
 */

'use strict';

import Store from 'electron-store';

// 存储的文件名为settings
const store = new Store({ name: 'settings' });

export function getLanguage() {
  return store.get('language', 'zh');
}

export function setLanguage(lang: string) {
  return store.set('language', lang);
}
