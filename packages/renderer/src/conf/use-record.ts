/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2022-08-04 19:54:38
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\conf\use-record.ts
 */
'use strict';
import { store, nodeFs } from '#preload';
export interface Tab {
  type: 'welcome' | 'settings' | 'markdown'; //就这三种情况，welcome就是欢迎界面，settings就是设置界面，markdown就是markdown界面
  title?: string;
  modified?: boolean; // 文件是否修改
  filePath: string;
}
const defaultRecord = {
  type: 'welcome',
  modified: false,
  filePath: ''
};

/**
 * 获取本地缓存的标签排布
 */
export function getTabs() {
  const record = store.storeRecordGet('tabs', [defaultRecord]);
  const tabs: Tab[] = record.filter((tab: any) => {
    return tab.type !== 'markdown' || nodeFs.fsExistsSync(tab.filePath);
  });
  tabs.forEach((tab: Tab) => (tab.modified = false));
  return tabs;
}

export function saveTabs(tabs: Tab[]) {
  return store.storeRecordSet(
    'tabs',
    tabs.map((tab: any) => {
      return { type: tab.type, title: tab.title, filePath: tab.filePath };
    })
  );
}

export function getCurrentTab(): number {
  return store.storeRecordGet('tab-current', 0);
}

export function saveCurrentTab(index: number) {
  return store.storeRecordSet('tab-current', index);
}
