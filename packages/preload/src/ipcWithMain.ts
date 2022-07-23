/*
 * @Author: szx
 * @Date: 2022-07-23 20:03:15
 * @LastEditTime: 2022-07-23 21:15:22
 * @Description:
 * @FilePath: \push-markdown\packages\preload\src\ipcWithMain.ts
 */
import { ipcRenderer } from 'electron';
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
export const ipc = {
  // 渲染进程单方面发送消息
  send: (channel: string, data?: any) => {
    // whitelist channels
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: any) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event: any, ...args: any) => func(...args));
    }
  },
  syncMsg: (channel: string, data?: any) => {
    if (validChannels.includes(channel)) {
      return ipcRenderer.sendSync(channel, data); // prints "pong"
    }
  }
};
