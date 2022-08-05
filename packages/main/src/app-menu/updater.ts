/*
 * @Author: szx
 * @Date: 2022-08-04 11:28:59
 * @LastEditTime: 2022-08-04 13:19:39
 * @Description:
 * @FilePath: \push-markdown\packages\main\src\app-menu\updater.ts
 */
import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

autoUpdater.autoDownload = false;

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString());
});

autoUpdater.on('update-available', () => {
  dialog
    .showMessageBox({
      type: 'info',
      title: '软件更新',
      message: '发现新版本，确定更新？',
      buttons: ['确定', '取消']
    })
    .then((buttonIndex) => {
      if (buttonIndex.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
});

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: '没有可更新版本',
    message: '当前版本已是最新'
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog
    .showMessageBox({
      title: '下载完成',
      message: '最新版本已下载完成, 退出程序进行安装'
    })
    .then(() => {
      setImmediate(() => autoUpdater.quitAndInstall());
    });
});

// export this to MenuItem click callback
export function checkForUpdates() {
  autoUpdater.checkForUpdates();
}