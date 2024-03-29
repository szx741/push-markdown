/*
 * @Author: szx
 * @Date: 2022-08-04 11:28:59
 * @LastEditTime: 2023-04-09 19:07:37
 * @Description:
 * @FilePath: \push-markdown\packages\main\src\app-menu\updater.ts
 */
import { dialog, app } from 'electron';
import { UpdateInfo, autoUpdater } from 'electron-updater';
import { resolve } from 'path';
const iconPath = resolve(app.getAppPath(), '../public/app.ico');

autoUpdater.autoDownload = false;

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString());
});

autoUpdater.on('update-available', (updateInfo: UpdateInfo) => {
  dialog
    .showMessageBox({
      icon: iconPath,
      type: 'info',
      title: '软件更新',
      message: `发现新版本 ${updateInfo.version}，更新日期为${updateInfo.releaseDate}，确定更新？`,
      detail: updateInfo.releaseNotes?.toString(),
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
    icon: iconPath,
    title: '没有可更新版本',
    message: '当前版本已是最新'
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog
    .showMessageBox({
      icon: iconPath,
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
