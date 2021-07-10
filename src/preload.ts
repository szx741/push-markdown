/*
 * @Author: szx
 * @Date: 2021-07-04 19:54:12
 * @LastEditTime: 2021-07-10 20:57:17
 * @Description:
 * @FilePath: \push-markdown\src\preload.ts
 */
/* eslint-disable */
import { typesetMath, mathJaxPath } from 'mathjax-electron';
import { contextBridge, ipcRenderer, shell } from 'electron';
import fs from 'fs-extra';
import Store from 'electron-store';
import path from 'path';
import { copyFileSync } from 'fs';
// 存储的文件名为settings
const storeSettings = new Store({ name: 'settings' });
const storeRecord = new Store({ name: 'use-record' });

const validChannels = ['fromMain', 'exePath', 'version', 'menu.language', 'menu.welcome', 'menu.sample', 'addRecentDocument'];

// import { Titlebar, Color } from 'custom-electron-titlebar';
// import url from 'url';
// window.addEventListener('DOMContentLoaded', () => {
//   new Titlebar({
//     backgroundColor: Color.fromHex('#2f3241'),
//     icon: url.format(path.join(__dirname, '/images', '/icon.png'))
//   });

//   const replaceText = (selector: any, text: any) => {
//     const element = document.getElementById(selector);
//     if (element) element.innerText = text;
//   };

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type]);
//   }
// });

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: any) => {
    // whitelist channels
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: Function) => {
    // let validChannels = ['fromMain', 'exePath', 'version'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  syncMsg: function (channel: string, data: any) {
    // let validChannels = ['fromMain', 'exePath', 'version'];
    if (validChannels.includes(channel)) {
      return ipcRenderer.sendSync(channel, data); // prints "pong"
    }
  },
  getLanguage() {
    return storeSettings.get('language', 'zh');
  },
  getStoreSettingsClear() {
    return storeSettings.clear();
  },
  storeSettingsSet(key: any, value: any) {
    return storeSettings.get(key, value);
  },
  storeSettingsGet(key: any, value: any) {
    return storeSettings.get(key, value);
  },
  storeRecordSet(key: any, value: any) {
    return storeRecord.set(key, value);
  },
  storeRecordGet(key: any, value: any) {
    return storeRecord.get(key, value);
  },
  fsReadFile: fs.readFile,
  shell: shell,
  pathBasename: path.basename,
  pathJoin: path.join,
  fsWriteFileSync: fs.writeFileSync,
  fsExistsSync: fs.existsSync,
  typesetMath: typesetMath,
  // mathJaxPath() {
  //   console.log(mathJaxPath);
  //   return mathJaxPath;
  // }
  mathJaxPath:mathJaxPath
});
