/*
 * @Author: szx
 * @Date: 2021-07-04 18:42:15
 * @LastEditTime: 2021-11-16 20:31:11
 * @Description: 菜单栏设置
 * @FilePath: \push-markdown\src\config\app-menu.ts
 */

'use strict';

//dialog模块提供了api来展示原生的系统对话框，例如打开文件框，alert框
import { Menu, app, dialog, shell, BrowserWindow } from 'electron';

import * as langConfig from '@/common/api/lang-config';
import * as language from '@/config/menu-lang';

// 加载菜单栏
export function init(mainWindow: BrowserWindow) {
  // webContents它负责渲染并控制网页
  const webContents = mainWindow.webContents;

  // 设置语言
  function setLanguage(lang: string) {
    langConfig.setLanguage(lang);
    // 通过 channel 发送异步消息给渲染进程
    webContents.send('menu.language', lang);
    // 重新渲染菜单栏
    init(mainWindow);
  }

  // 获取语言设置
  const lang = langConfig.getLanguage();
  const l = lang === 'zh' ? language.zh : language.en;

  // 菜单栏模板
  const template: any[] = [
    {
      label: l.file,
      //文件下拉属性
      submenu: [
        {
          label: l.open,
          accelerator: 'CmdOrCtrl+O',
          click: function () {
            dialog
              .showOpenDialog(mainWindow, { properties: ['openFile'], filters: [{ name: 'Markdown', extensions: ['md'] }] })
              .then((result: any) => {
                if (!result.canceled && result.filePaths.length > 0) {
                  webContents.send('menu.open', result.filePaths[0]);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        },
        {
          // 分隔横线
          type: 'separator'
        },
        {
          label: l.save,
          accelerator: 'CmdOrCtrl+S',
          click: function () {
            webContents.send('menu.save');
          }
        },
        {
          label: l.publish,
          accelerator: 'CmdOrCtrl+P',
          click: function () {
            webContents.send('menu.publish');
          }
        },
        {
          type: 'separator'
        },
        {
          label: l.settings,
          click: function () {
            webContents.send('menu.settings');
          }
        },
        {
          label: l.language,
          submenu: [
            {
              label: '简体中文',
              type: 'checkbox',
              checked: lang === 'zh',
              click: function () {
                setLanguage('zh');
              }
            },
            {
              label: 'English',
              type: 'checkbox',
              checked: lang === 'en',
              click: function () {
                setLanguage('en');
              }
            }
          ]
        }
      ]
    },
    //第二个菜单
    {
      label: l.edit,
      submenu: [
        {
          label: l.undo,
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: l.redo,
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: l.cut,
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: l.copy,
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: l.paste,
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: l.selectAll,
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    },
    {
      label: l.window,
      role: 'window',
      submenu: [
        {
          label: l.fileTree,
          accelerator: (function () {
            return 'Ctrl+Shift+L';
          })(),
          click: function () {
            webContents.send('menu.showfile');
          }
        },
        {
          label: l.toggleFullScreen,
          accelerator: (function () {
            if (process.platform === 'darwin') return 'Ctrl+Command+F';
            else return 'F11';
          })(),
          click: function (item: any, focusedWindow: any) {
            if (focusedWindow) focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
        {
          label: l.minimize,
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          type: 'separator'
        },
        {
          label: l.reload,
          // accelerator: 'CmdOrCtrl+R',
          click: function (item: any, focusedWindow: any) {
            if (focusedWindow) focusedWindow.reload();
          }
        },
        {
          label: l.toggleDevTools,
          accelerator: (function () {
            return 'Ctrl+Shift+I';
          })(),
          click: function (item: any, focusedWindow: any) {
            if (focusedWindow) focusedWindow.toggleDevTools();
          }
        },
        {
          type: 'separator'
        },
        {
          label: l.close,
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    },
    {
      label: l.help,
      role: 'help',
      submenu: [
        {
          label: l.openWelcomePage,
          click: function () {
            webContents.send('menu.welcome');
          }
        },
        {
          label: l.viewSampleFile,
          click: function () {
            webContents.send('menu.sample');
          }
        },
        {
          label: l.tutorials,
          click: function () {
            // app.getAppPath();
            shell.openExternal('https://gitee.com/xaotuman/push-markdown/blob/master/docs/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.md');
          }
        },
        {
          label: l.learnMore,
          click: function () {
            app.getAppPath();
            shell.openExternal('https://gitee.com/xaotuman/push-markdown');
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    const name: string = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          label: l.about + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: l.services,
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: l.hide + name,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: l.hideOthers,
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: l.showAll,
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: l.quit,
          accelerator: 'Command+Q',
          click: function () {
            app.quit();
          }
        }
      ]
    });
    const windowMenu = template.find(function (m) {
      return m.role === 'window';
    });
    if (windowMenu) {
      windowMenu.submenu.push(
        {
          type: 'separator'
        },
        {
          label: l.bringAllToFront,
          role: 'front'
        }
      );
    }
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
