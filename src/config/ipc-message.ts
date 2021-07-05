/*
 * @Author: szx
 * @Date: 2021-07-05 20:57:10
 * @LastEditTime: 2021-07-05 20:58:44
 * @Description:
 * @FilePath: \push-markdown\src\config\ipc-message.ts
 */

import { app, ipcMain } from 'electron';

import path from 'path';

//异步消息
// ipcMain.on('asynchronous-message', function (event, arg) {
//   console.log(arg); // prints "ping"
//   var exePath = path.dirname(app.getPath('exe'));
//   event.sender.send('asynchronous-reply', exePath);
// });

//同步消息
ipcMain.on('synchronous-message', function (event, arg) {
  var exePath = path.dirname(app.getPath('exe'));
  event.returnValue = exePath;
});
