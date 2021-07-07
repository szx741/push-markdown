/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2021-07-07 17:04:00
 * @Description:
 * @FilePath: \push-markdown\src\logic\useRecord.ts
 */
/**
 * Created by jzj on 2020-04-04.
 */
'use strict';

const fs = require('fs');
const Store = require('electron-store');

const store = new Store({ name: 'use-record' });

export function getTabs() {
  let tabs = store.get('tabs', [{ type: 'welcome' }]).filter((tab: any) => {
    return tab.type !== 'markdown' || fs.existsSync(tab.file);
  });
  tabs.forEach((tab: any) => {
    tab.modified = false;
  });
  return tabs;
}

export function saveTabs(tabs: any) {
  return store.set(
    'tabs',
    tabs.map((tab: any) => {
      return { type: tab.type, title: tab.title, file: tab.file };
    })
  );
}

export function getCurrentTab() {
  return store.get('tab-current', 0);
}

export function saveCurrentTab(index: any) {
  return store.set('tab-current', index);
}
