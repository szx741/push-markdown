/*
 * @Author: szx
 * @Date: 2021-07-05 20:57:10
 * @LastEditTime: 2021-07-06 16:56:57
 * @Description:
 * @FilePath: \push-markdown\src\config\ipc-message.ts
 */

import { app, ipcMain } from 'electron';

import path from 'path';
import fs from 'fs-extra';

//实验性质
ipcMain.on('toMain', (event, args) => {
  event.reply('fromMain', '后撤步888');
  // mainWindow.webContents.send('fromMain', '后撤步777');
});

/*
  然后在渲染进程中使用下面的这段语句
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

// 获得当前版本号
ipcMain.on('version', function (event, arg) {
  //   event.reply('version', app.getVersion());
  event.returnValue = app.getVersion();
});

export { ipcMain as ipcMainCollection };