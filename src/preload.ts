/*
 * @Author: szx
 * @Date: 2021-07-04 19:54:12
 * @LastEditTime: 2022-07-21 21:29:42
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
// import slug from 'limax';
// import { JSDOM } from 'jsdom';
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
  'menu.showfile',
  'menu.closetab',
  'menu.reloadfile',
  'process.versions',
  'menu.theme',
  'new-media-object',
  'new-metaweblog',
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
      ipcRenderer.on(channel, (event: any, ...args: any) => func(...args));
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
  getTheme() {
    return storeSettings.get('theme', 'github');
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
  setShowFile(value: any) {
    return storeSettings.set('show-file', value);
  },
  getShowFile() {
    return storeSettings.get('show-file', true);
  },
  fsReadFile: fs.readFile,
  fsReadFileSync(file: string) {
    try {
      return fs.readFileSync(file, { encoding: 'base64' });
    } catch {
      return false;
    }
  },
  bufReadFileSync(file: string) {
    try {
      const pic = fs.readFileSync(file, { encoding: 'base64' });
      // console.log(Buffer.from(pic, 'base64'));
      return Buffer.from(pic, 'base64');
    } catch {
      return false;
    }
  },
  shell: shell,
  pathBasename: path.basename,
  pathJoin: path.join,
  pathIsAbsolute: path.isAbsolute,
  pathDirname: path.dirname,
  pathExtname: path.extname,
  pathResolve: path.resolve,
  fsWriteFile: fs.writeFile,
  fsWriteFileSync: fs.writeFileSync,
  fsExistsSync: fs.existsSync,
  fsReaddirSync: fs.readdirSync,
  fsStatSync: fs.statSync,
  fsLstatSync: fs.lstatSync,
  isFileOrDir(_path: string, file: string) {
    try {
      let stat = fs.lstatSync(path.join(_path, file));
      return [stat.isFile(), stat.isDirectory()];
    } catch (e) {
      return [false, false];
    }
  },
  isDir(path: string) {
    try {
      var stat = fs.lstatSync(path);
      return stat.isDirectory();
    } catch (e) {
      // lstatSync throws an error if path doesn't exist
      return false;
    }
  },
  fsLstat: fs.lstat,
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
        request.head(encodeURI(url), function (error: any, response: any, body: any) {
          // console.log(error, response, body);
          resolve(!error && response && response.statusCode === 200);
        });
      })
    );
  },
  metaWeblog(url: string) {
    return new MetaWeblog(url);
  },
  // slug(text: string) {
  //   return slug(text, { tone: false });
  // }
  // jsdom() {
  //   return new JSDOM();
  // }
});
