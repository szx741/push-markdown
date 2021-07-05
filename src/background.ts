/*
 * @Author: szx
 * @Date: 2021-07-04 14:00:50
 * @LastEditTime: 2021-07-05 21:54:48
 * @Description:
 * @FilePath: \push-markdown\src\background.ts
 */
'use strict';
// 主进程使用 BrowserWindow 实例创建页面，销毁后进程也会被终止
import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import * as AppMenu from '@/main/app-menu';
import path from 'path';
import { browserWindowOption, winURL } from '@/config/browser.options';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

// APP窗口大小
let mainWindow: BrowserWindow | null;
async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow(browserWindowOption);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    // mainWindow.loadURL('app://./index.html');
    mainWindow.loadURL(winURL);
  }
  log.info('create window', process.env.NODE_ENV);
  //加载应用的菜单栏
  AppMenu.init(mainWindow);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// 当Electron完成初始化并准备创建浏览器窗口时，这个方法将被调用。
// 有些API只有在这个事件发生后才能使用。
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }

  // 同步方法
  ipcMain.on('exePath', function (event, arg) {
    event.returnValue = path.dirname(app.getPath('exe'));
  });
  ipcMain.on('version', function (event, arg) {
    event.returnValue = path.dirname(app.getVersion());
  });
  createWindow();
});

// 在开发模式下应父进程的要求干净地退出。
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
