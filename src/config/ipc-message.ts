/*
 * @Author: szx
 * @Date: 2021-07-05 20:57:10
 * @LastEditTime: 2021-08-30 20:04:09
 * @Description:
 * @FilePath: \push-markdown\src\config\ipc-message.ts
 */

import { app, ipcMain } from 'electron';

import path from 'path';
/*
  // 实验性质
  ipcMain.on('toMain', (event, args) => {
    // event.reply('fromMain', '后撤步888');
    mainWindow.webContents.send('fromMain', '后撤步777');
  });

  // 然后在渲染进程中使用下面的这段语句
  // 从主进程通道FromMain接受信息
  window.api.receive('fromMain', (data: any) => {
    console.log(`Received ${data} from main process`);
  });
  // 发送信息给主进程通道toMain
  window.api.send('toMain', 'some data');
*/
// 获得当前安装包路径
ipcMain.on('exePath', function (event, arg) {
  // event.reply('exePath', path.dirname(app.getPath('exe')));
  event.returnValue = path.dirname(app.getPath('exe'));
});

ipcMain.on('addRecentDocument', function (event, arg) {
  // event.reply('exePath', path.dirname(app.getPath('exe')));
  console.log(arg);
  event.returnValue = app.addRecentDocument(arg);
});

// 获得当前版本号
ipcMain.on('version', function (event, arg) {
  //   event.reply('version', app.getVersion());
  event.returnValue = app.getVersion();
});

ipcMain.on('platform', function (event, arg) {
  //   event.reply('version', app.getVersion());
  event.returnValue = process.platform;
});

ipcMain.on('argv', function (event, arg) {
  //   event.reply('version', app.getVersion());
  event.returnValue = process.argv;
});

ipcMain.on('process.versions', function (event, arg) {
  //   event.reply('version', app.getVersion());
  event.returnValue = process.versions;
});

ipcMain.on('__static', function (event, arg) {
  // event.reply('exePath', path.dirname(app.getPath('exe')));
  event.returnValue = __static;
});

// 中转消息，渲染进程发给主进程，主进程再发给渲染进程
ipcMain.on('menu.settings', function (event, arg) {
  event.reply('menu.settings', arg);
});
// 中转消息，渲染进程发给主进程，主进程再发给渲染进程
ipcMain.on('menu.sample', function (event, arg) {
  event.reply('menu.sample', arg);
});

import Store from 'electron-store';

Store.initRenderer();

export { ipcMain as ipcMainCollection };
