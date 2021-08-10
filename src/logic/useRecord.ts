/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2021-08-11 00:09:56
 * @Description:
 * @FilePath: \push-markdown\src\logic\useRecord.ts
 */
/**
 * Created by jzj on 2020-04-04.
 */
'use strict';

export function getTabs() {
  const tabs = window.api.storeRecordGet('tabs', [{ type: 'welcome' }]).filter((tab: any) => {
    console.log('tab.file:', tab.file);
    console.log(window.api.fsExistsSync(tab.file));
    return tab.type !== 'markdown' || window.api.fsExistsSync(tab.file);
  });
  tabs.forEach((tab: any) => {
    tab.modified = false;
  });
  return tabs;
}

export function saveTabs(tabs: any) {
  tabs = JSON.parse(JSON.stringify(tabs));
  console.log('saveTabs:', tabs);
  return window.api.storeRecordSet(
    'tabs',
    tabs.map((tab: any) => {
      return { type: tab.type, title: tab.title, file: tab.file };
    })
  );
}

export function getCurrentTab() {
  console.log('getCurrentTab:', window.api.storeRecordGet('tab-current', 0));
  return window.api.storeRecordGet('tab-current', 0);
}

export function saveCurrentTab(index: any) {
  return window.api.storeRecordSet('tab-current', index);
}
