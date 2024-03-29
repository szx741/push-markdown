/*
 * @Author: szx
 * @Date: 2021-07-05 20:57:10
 * @LastEditTime: 2023-04-08 13:17:10
 * @Description:
 * @FilePath: \push-markdown\packages\main\src\ipc-message.ts
 */

import { app, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';

/*
  // 实验性质
  ipcMain.on('toMain', (event, args) => {
    // event.reply('fromMain', '后撤步888');
    mainWindow.webContents.send('fromMain', '后撤步777');
  });

  // 然后在渲染进程中使用下面的这段语句
  // 从主进程通道FromMain接受信息
  ipc.receive('fromMain', (data: any) => {
    console.log(`Received ${data} from main process`);
  });
  // 发送信息给主进程通道toMain
  ipc.send('toMain', 'some data');
*/
// 获得当前安装包路径
ipcMain.on('exePath', function (event, arg) {
  // event.reply('exePath', path.dirname(app.getPath('exe')));
  event.returnValue = path.dirname(app.getPath('exe'));
});

ipcMain.on('addRecentDocument', function (event, arg) {
  // event.reply('exePath', path.dirname(app.getPath('exe')));
  // console.log(arg);
  event.returnValue = app.addRecentDocument(arg);
});

ipcMain.on('openDir', function (event, arg) {
  dialog
    .showOpenDialog({
      properties: ['openDirectory']
    })
    .then((result) => {
      if (!result.canceled) {
        const folderPath = result.filePaths[0];
        const allFile = fs.readdirSync(folderPath);
        let allMd = allFile.filter((file: string) => {
          const stats = fs.lstatSync(path.join(folderPath, file));
          if (stats.isFile() && path.extname(file) === '.md') return true;
          else return false;
        });
        event.reply('openDir', {
          folderPath,
          allMd
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
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

ipcMain.on('__static', function (event, arg) {
  // event.reply('exePath', path.dirname(app.getPath('exe')));
  // event.returnValue = __static;
  // event.returnValue = './';
  event.returnValue = __dirname;
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

export { ipcMain as ipcMainCollection };
