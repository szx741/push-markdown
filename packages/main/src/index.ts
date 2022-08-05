/*
 * @Author: szx
 * @Date: 2022-07-23 13:40:31
 * @LastEditTime: 2022-08-05 11:06:18
 * @Description: electron的应用启动
 * @FilePath: \push-markdown\packages\main\src\index.ts
 */
import { app, BrowserWindow, protocol } from 'electron';
import { normalize } from 'path';
import { ipcMainCollection } from './ipc-message';
import { restoreOrCreateWindow } from './mainWindow';

/**
 * 只拥有一个实例，防止有多个实例
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);
/**
 * 关闭硬件加速，这个有待商榷，除非有兼容性问题
 */
// app.disableHardwareAcceleration();

/**
 * 关闭窗口，所有进程都退出
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) restoreOrCreateWindow();
});

/**
 * 创建应用窗口当后台进程已经准备好
 */
app
  .whenReady()
  .then(() => {
    restoreOrCreateWindow();
    ipcMainCollection;
    protocol.registerFileProtocol('atom', (request, callback) => {
      const url = request.url.replace(/^atom:\/\//, '');
      const decodedUrl = decodeURI(url); // Needed in case URL contains spaces
      try {
        return callback({ path: normalize(decodedUrl) });
      } catch (error) {
        console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error);
      }
    });
  })
  .catch((e) => console.error('Failed create window:', e));
