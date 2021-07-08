/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2021-07-08 14:04:06
 * @Description:
 * @FilePath: \push-markdown\src\logic\useRecord.ts
 */
/**
 * Created by jzj on 2020-04-04.
 */
'use strict';

export function getTabs() {
  const tabs = window.api.storeRecordGet('tabs', [{ type: 'welcome' }]).filter((tab: any) => {
    return tab.type !== 'markdown' || window.api.fsExistsSync(tab.file);
  });
  tabs.forEach((tab: any) => {
    tab.modified = false;
  });
  return tabs;
}

export function saveTabs(tabs: any) {
  return window.api.storeRecordSet(
    'tabs',
    tabs.map((tab: any) => {
      return { type: tab.type, title: tab.title, file: tab.file };
    })
  );
}

export function getCurrentTab() {
  return window.api.storeRecordGet('tab-current', 0);
}

export function saveCurrentTab(index: any) {
  return window.api.storeRecordSet('tab-current', index);
}
