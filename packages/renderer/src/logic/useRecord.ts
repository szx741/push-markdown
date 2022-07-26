/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2022-07-26 21:51:26
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\logic\useRecord.ts
 */
'use strict';
import { store, nodeFs } from '#preload';
interface Tabs {
  type: string;
  modified?: boolean;
  file?: string;
}
export function getTabs() {
  const tabs: Array<Tabs> = store.storeRecordGet('tabs', [{ type: 'welcome' }]).filter((tab: any) => {
    return tab.type !== 'markdown' || nodeFs.fsExistsSync(tab.file);
  });
  tabs.forEach((tab: any) => {
    tab.modified = false;
  });
  return tabs;
}

export function saveTabs(tabs: any) {
  return store.storeRecordSet(
    'tabs',
    tabs.map((tab: any) => {
      return { type: tab.type, title: tab.title, file: tab.file };
    })
  );
}

export function getCurrentTab(): number {
  return store.storeRecordGet('tab-current', 0);
}

export function saveCurrentTab(index: number) {
  return store.storeRecordSet('tab-current', index);
}
