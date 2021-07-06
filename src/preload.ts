/*
 * @Author: szx
 * @Date: 2021-07-04 19:54:12
 * @LastEditTime: 2021-07-06 21:40:17
 * @Description:
 * @FilePath: \push-markdown\src\preload.ts
 */
/* eslint-disable */

import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs-extra';
import Store from 'electron-store';

// 存储的文件名为settings
const store = new Store({ name: 'settings' });

const validChannels = ['fromMain', 'exePath', 'version', 'menu.language'];

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: any) => {
    // whitelist channels
    let validChannels = ['toMain', 'exePath', 'version'];
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
    return store.get('language', 'zh');
  },
  fsWriteFileSync: fs.writeFileSync
});
