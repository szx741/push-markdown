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
