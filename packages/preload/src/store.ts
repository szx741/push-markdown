/*
 * @Author: szx
 * @Date: 2022-07-23 20:09:35
 * @LastEditTime: 2022-07-26 22:01:02
 * @Description:
 * @FilePath: \push-markdown\packages\preload\src\store.ts
 */
import Store from 'electron-store';

const storeSettings = new Store({ name: 'settings' });
const storeRecord = new Store({ name: 'use-record' });
export const store = {
  getLanguage() {
    return storeSettings.get('language', 'zh');
  },
  getTheme() {
    return storeSettings.get('theme', 'github');
  },
  getStoreSettingsClear() {
    return storeSettings.clear();
  },
  storeSettingsSet(key: any, value: any) {
    return storeSettings.set(key, value);
  },
  storeSettingsGet(key: any, value: any): any {
    return storeSettings.get(key, value);
  },
  storeRecordSet(key: any, value: any) {
    return storeRecord.set(key, value);
  },
  storeRecordGet(key: any, value: any): any {
    return storeRecord.get(key, value);
  },
  setShowFile(value: any) {
    return storeSettings.set('show-file', value);
  },
  getShowFile(): boolean {
    const res = storeSettings.get('show-file', true);
    if (typeof res === 'boolean') return res;
    else return true;
  },
  newStore(name: string) {
    return new Store({ name }).path;
  },
  storeSet(name: string, key: any, value: any) {
    const store = new Store({ name });
    return store.set(key, value);
  },
  storeGet(name: string, key: any, value?: any): any {
    const store = new Store({ name });
    return store.get(key);
  }
};
