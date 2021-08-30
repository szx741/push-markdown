/*
 * @Author: szx
 * @Date: 2021-07-04 14:00:50
 * @LastEditTime: 2021-08-30 22:04:27
 * @Description:
 * @FilePath: \push-markdown\src\background.ts
 */
'use strict';
// 主进程使用 BrowserWindow 实例创建页面，销毁后进程也会被终止
import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import * as AppMenu from '@/config/app-menu';
import path from 'path';
import { ipcMainCollection } from '@/config/ipc-message';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

// APP窗口大小
let mainWindow: BrowserWindow;
async function createWindow() {
  mainWindow = new BrowserWindow({
    minHeight: 180,
    minWidth: 320,
    // hasShadow: true,
    width: 1600,
    height: 800,
    // frame: false,

    // titleBarStyle: 'default', // add this line
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), //这里只能用.js结尾，用ts结尾的就不能引入
      // enableRemoteModule: true,
      // nodeIntegration: true,  //默认不开启node集成，为了安全😊
      contextIsolation: true, //上下文隔离，开起来吧，为了安全😊
      webSecurity: true // 关闭跨域限制，为了安全😊
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
    // mainWindow.loadURL('app://./index.html');
    const winURL = isDevelopment ? 'http://localhost:8080' : `file://${__dirname}/index.html`;
    mainWindow.loadURL(winURL);
  }
  log.info('create window', process.env.NODE_ENV);
  //加载应用的菜单栏
  AppMenu.init(mainWindow);
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
  //进程之间的监听
  ipcMainCollection;
  // 创建窗口
  createWindow();
});

// 注册拦截器，使用atom://来代替file://，这样子也不需要关闭webSecurity https://www.electronjs.org/docs/api/protocol
app.whenReady().then(() => {
  protocol.registerFileProtocol('atom', (request, callback) => {
    const url = request.url.replace(/^atom:\/\//, '')
    // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
    const decodedUrl = decodeURI(url) // Needed in case URL contains spaces
    try {
      return callback({ path: path.normalize(decodedUrl) })
    }
    catch (error) {
      console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error)
    }
    // const url = decodeURI(request.url).substr(7);
    // callback({ path: path.normalize(url) });
  });
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
