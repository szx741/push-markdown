/*
 * @Author: szx
 * @Date: 2021-07-04 19:54:12
 * @LastEditTime: 2021-09-21 16:21:20
 * @Description:
 * @FilePath: \push-markdown\src\preload.ts
 */
/* eslint-disable */
import { contextBridge, ipcRenderer, shell } from 'electron';
import fs from 'fs-extra';
import Store from 'electron-store';
import path from 'path';
import request from 'request';
import md5File from 'md5-file';
import MetaWeblog from 'metaweblog-api';
// 存储的文件名为settings
const storeSettings = new Store({ name: 'settings' });
const storeRecord = new Store({ name: 'use-record' });

const validChannels = [
  'fromMain',
  'exePath',
  'version',
  'menu.language',
  'menu.welcome',
  'menu.sample',
  'addRecentDocument',
  'menu.save',
  'menu.settings',
  'menu.open',
  'menu.publish',
  'process.versions',
  '__static'
];

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: any) => {
    // whitelist channels
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: Function) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  syncMsg: function (channel: string, data: any) {
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
    return storeSettings.set(key, value);
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
  fsReadFileSync: fs.readFileSync,
  shell: shell,
  pathBasename: path.basename,
  pathJoin: path.join,
  pathIsAbsolute: path.isAbsolute,
  pathDirname: path.dirname,
  pathExtname: path.extname,
  fsWriteFile: fs.writeFile,
  fsWriteFileSync: fs.writeFileSync,
  fsExistsSync: fs.existsSync,
  newStore(name: string) {
    return new Store({ name }).path;
  },
  storeSet(name: string, key: any, value: any) {
    const store = new Store({ name });
    return store.set(key, value);
  },
  storeGet(name: string, key: any, value: any) {
    const store = new Store({ name });
    return store.get(key);
  },
  md5(file: any) {
    return md5File.sync(file);
  },
  async checkUrlValid(url: string) {
    return (
      url &&
      new Promise((resolve, reject) => {
        request.head(url, function (error: any, response: any, body: any) {
          resolve(!error && response && response.statusCode === 200);
        });
      })
    );
  },
  metaWeblog(url: string) {
    return new MetaWeblog(url);
  }
});
