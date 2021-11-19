/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2021-11-19 17:20:55
 * @Description:
 * @FilePath: \push-markdown\src\logic\useRecord.ts
 */
'use strict';

interface Tabs {
  type: string;
  modified?: boolean;
  file?: string;
}
export function getTabs() {
  const tabs: Array<Tabs> = window.api.storeRecordGet('tabs', [{ type: 'welcome' }]).filter((tab: any) => {
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
