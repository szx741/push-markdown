/*
 * @Author: szx
 * @Date: 2022-07-19 14:54:10
 * @LastEditTime: 2022-07-23 19:56:14
 * @Description:
 * @FilePath: \push-markdown\packages\main\src\theme-store.ts
 */
'use strict';

import Store from 'electron-store';

// 存储的文件名为settings
const store = new Store({ name: 'settings' });

export function getTheme() {
  return store.get('theme', 'github');
}

export function setTheme(theme: string) {
  return store.set('theme', theme);
}
