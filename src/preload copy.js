/*
 * @Author: szx
 * @Date: 2021-07-04 19:54:12
 * @LastEditTime: 2021-07-06 16:30:36
 * @Description:
 * @FilePath: \push-markdown\src\preload.js
 */
/* eslint-disable */
const log = require('electron-log');
const fs = require('fs-extra');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ['toMain', 'exePath', 'version'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ['fromMain', 'exePath', 'version'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});

// window.log = log.functions;

// window.test = function () {
//   console.log(fs);
// };
// window.writeFileSync = function (errorLogPath: string, errorLog: Object) {
//   fs.writeFileSync(errorLogPath, JSON.stringify(errorLog) + '\n', { flag: 'a' });
// };
