/*
 * @Author: szx
 * @Date: 2022-07-23 20:09:35
 * @LastEditTime: 2022-08-02 23:31:16
 * @Description:
 * @FilePath: \push-markdown\packages\preload\src\store.ts
 */
import Store from 'electron-store';
const options = {
  name: 'settings',
  defaults: {
    publish: {
      abstractMode: 'article',
      mathjax: true,
      abstractNum: 120,
      highlight: false
    },
    sites: [
      {
        name: 'Sample Site Config',
        url: 'https://www.example.com/xmlrpc.php',
        username: 'username',
        password: '',
        selected: false
      }
    ],
    application: {
      theme: true,
      language: 'zh',
      filelist: true
    },
    detail: {
      noCheck: true,
      forcedUpdate: false,
      getNetPic: false
    }
  }
};
const storeSettings = new Store(options);
const storeRecord = new Store({ name: 'use-record' });
export const store = {
  getLanguage() {
    return storeSettings.get('language', 'zh');
  },
  storeSettingsClear() {
    return storeSettings.clear();
  },
  storeSettingsSet(key: any, value: any): void {
    storeSettings.set(key, value);
  },
  storeSettingsGet(key: any, value?: any): any {
    return storeSettings.get(key, value);
  },
  storeRecordSet(key: any, value: any) {
    return storeRecord.set(key, value);
  },
  storeRecordGet(key: any, value: any): any {
    return storeRecord.get(key, value);
  },
  setShowFile(value: boolean) {
    return storeSettings.set('filelist', value);
  },
  getShowFile(): boolean {
    const res = storeSettings.get('filelist');
    if (typeof res === 'boolean') return res;
    else return true;
  },
  getTheme(): any {
    return storeSettings.get('theme', true);
  },
  setTheme(theme: boolean) {
    return storeSettings.set('theme', theme);
  },
  openInEditor() {
    storeSettings.openInEditor();
  },
  getSettingsPath() {
    return storeSettings.path;
  },

  getokok() {
    return storeSettings.get('publish.abstractMode.nimasl');
  },
  setokok() {
    storeSettings.set('fe.fe.nimagresl', 'uiui');
  }
};

// [uid:'site.url && site.username]:{
//   posts:{
//     [post.url]:postId
//   }
//   images:{
//     [imageName]:imageUrl;
//   }
// }
