/*
 * @Author: szx
 * @Date: 2021-07-04 19:54:12
 * @LastEditTime: 2021-07-12 14:42:41
 * @Description:
 * @FilePath: \push-markdown\src\preload.ts
 */
/* eslint-disable */
import { typesetMath, mathJaxPath } from 'mathjax-electron';
import { contextBridge, ipcRenderer, shell } from 'electron';
import fs from 'fs-extra';
import Store from 'electron-store';
import path from 'path';
import _filenamify from 'filenamify';
import md5File from 'md5-file';

// const filenamify = (s: any) => _filenamify(s, { replacement: '-' });

import { copyFileSync } from 'fs';
// 存储的文件名为settings
const storeSettings = new Store({ name: 'settings' });
const storeRecord = new Store({ name: 'use-record' });
const storeCache = new Store({ name: 'cache-post-xaotuman' });
// const storeCache = new Store({ name: 'cache-post-http://82.157.179.143/xmlrpc.php-xaotuman' });

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
  'process.versions'
];

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
  shell: shell,
  pathBasename: path.basename,
  pathJoin: path.join,
  pathIsAbsolute: path.isAbsolute,
  pathDirname: path.dirname,
  pathExtname: path.extname,
  fsWriteFileSync: fs.writeFileSync,
  fsExistsSync: fs.existsSync,
  typesetMath: typesetMath,
  storeCachePath(key: any, value: any) {
    return storeCache.path;
  },
  storeCacheSet(key: any, value: any) {
    return storeCache.set(key, value);
  },
  storeCacheGet(key: any, value: any) {
    return storeCache.get(key, value);
  },
  // filenamify: filenamify,
  mathJaxPath: mathJaxPath,
  md5(file: any) {
    return md5File(file);
  }
});
