/*
 * @Author: szx
 * @Date: 2022-07-23 13:40:31
 * @LastEditTime: 2022-08-05 12:15:12
 * @Description: 主窗口设置
 * @FilePath: \push-markdown\packages\main\src\mainWindow.ts
 */
import { BrowserWindow } from 'electron';
import { join } from 'path';
import { URL } from 'url';

import { menuInit } from './app-menu';

async function createWindow() {
  const browserWindow = new BrowserWindow({
    minHeight: 180,
    minWidth: 320,
    width: 1500,
    height: 800,
    show: false, // 使用事件 ready-to-show 来展示窗口
    // web渲染进程设置
    webPreferences: {
      nodeIntegration: false, //默认不开启node集成，为了安全😊
      contextIsolation: true, //默认开启上下文隔离，为了安全😊
      webSecurity: true, // 关闭跨域限制，为了安全😊
      webviewTag: false, // 不知道是啥，关就完事了，为了安全😊
      sandbox: false, //千万不要开启，要不然预加载脚本也会受限
      preload: join(__dirname, '../../preload/dist/index.cjs')
    }
  });
  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */

  browserWindow.on('ready-to-show', () => {
    menuInit(browserWindow);
    browserWindow?.show();
    // 如果是dev环境，顺带打开devtools
    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined ? import.meta.env.VITE_DEV_SERVER_URL : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

  await browserWindow.loadURL(pageUrl);

  return browserWindow;
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
