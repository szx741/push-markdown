/*
 * @Author: szx
 * @Date: 2021-07-04 14:00:50
 * @LastEditTime: 2021-07-04 20:04:26
 * @Description:
 * @FilePath: \push-markdown\src\background.ts
 */
'use strict';
// 主进程使用 BrowserWindow 实例创建页面，销毁后进程也会被终止
import { app, protocol, BrowserWindow } from 'electron';
import log from 'electron-log';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import * as AppMenu from './main/app-menu';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

// APP窗口大小
async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // preload: './preload.ts',
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION as unknown as boolean as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      // 取消跨域限制
      webSecurity: false
    },
    // eslint-disable-next-line
    icon: `${__static}/app.ico`
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html');
  }
  log.info('create window', process.env.NODE_ENV);
  //加载应用的菜单栏
  AppMenu.init(mainWindow);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
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
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
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
