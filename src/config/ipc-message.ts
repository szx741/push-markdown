/*
 * @Author: szx
 * @Date: 2021-07-05 20:57:10
 * @LastEditTime: 2021-11-19 13:07:06
 * @Description:
 * @FilePath: \push-markdown\src\config\ipc-message.ts
 */

import { app, ipcMain } from 'electron';
import path from 'path';
import Store from 'electron-store';
import MetaWeblog from 'metaweblog-api';
let metaweblog: MetaWeblog;

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

// ipcMain.on('menu.showfile', function (event, arg) {
//   event.reply('menu.showfile', arg);
// });

// 中转消息，渲染进程发给主进程，主进程再发给渲染进程
ipcMain.on('menu.sample', function (event, arg) {
  event.reply('menu.sample', arg);
});

ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: '/path/to/icon.png'
  });
});

// 中转消息，渲染进程发给主进程，主进程再发给渲染进程
// ipcMain.on('new-media-object', async function (event, meta: any, blogId: string, username: string, password: string, mediaObject: any) {
ipcMain.on('new-media-object', async function (event, arg) {
  try {
    if (arg[0] == true) {
      arg[6] = Buffer.from(arg[6], 'base64');
    }
    const mediaObject = {
      name: arg[4],
      type: arg[5],
      bits: arg[6],
      overwrite: true
    };
    // const meta = new MetaWeblog(arg[0]);
    const res: any = await metaweblog.newMediaObject(arg[1], arg[2], arg[3], mediaObject);
    event.returnValue = [true, res.url];
  } catch (err: any) {
    event.returnValue = [false, err.toString()];
  }
});

ipcMain.on('new-metaweblog', function (event, arg) {
  metaweblog = new MetaWeblog(arg);
  event.returnValue = true;
});

// ipcMain.on('new-media-object', async function (event, arg) {
//   console.log('meta', meta);
//   const result = await meta.newMediaObject(blogId, username, password, mediaObject);
//   console.log('new-media-object:', result);
//   event.reply('new-media-object', result);
// });

Store.initRenderer();

export { ipcMain as ipcMainCollection };
