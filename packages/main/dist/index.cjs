"use strict";
const electron = require("electron");
const path = require("path");
require("url");
const Store = require("electron-store");
const electronUpdater = require("electron-updater");
const _interopDefaultLegacy = (e) => e && typeof e === "object" && "default" in e ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
const Store__default = /* @__PURE__ */ _interopDefaultLegacy(Store);
electron.ipcMain.on("exePath", function(event, arg) {
  event.returnValue = path__default.default.dirname(electron.app.getPath("exe"));
});
electron.ipcMain.on("addRecentDocument", function(event, arg) {
  console.log(arg);
  event.returnValue = electron.app.addRecentDocument(arg);
});
electron.ipcMain.on("version", function(event, arg) {
  event.returnValue = electron.app.getVersion();
});
electron.ipcMain.on("platform", function(event, arg) {
  event.returnValue = process.platform;
});
electron.ipcMain.on("argv", function(event, arg) {
  event.returnValue = process.argv;
});
electron.ipcMain.on("__static", function(event, arg) {
  event.returnValue = __dirname;
});
electron.ipcMain.on("menu.settings", function(event, arg) {
  event.reply("menu.settings", arg);
});
electron.ipcMain.on("menu.sample", function(event, arg) {
  event.reply("menu.sample", arg);
});
electron.ipcMain.on("ondragstart", (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: "/path/to/icon.png"
  });
});
const en = {
  file: "File",
  open: "Open",
  openRecent: "Open Recent",
  clearRecent: "Clear",
  save: "Save",
  publish: "Publish",
  language: "Language",
  settings: "Settings",
  edit: "Edit",
  undo: "Undo",
  redo: "Redo",
  cut: "Cut",
  copy: "Copy",
  paste: "Paste",
  selectAll: "Select All",
  reload: "Reload",
  fileTree: "File tree",
  closeTab: "Close Current File",
  reloadFile: "Reload File",
  toggleFullScreen: "Toggle Full Screen",
  toggleDevTools: "Toggle Developer Tools",
  window: "Window",
  minimize: "Minimize",
  close: "Close",
  help: "Help",
  learnMore: "Learn More",
  checkUpdate: "Check Update",
  openWelcomePage: "Open Welcome Page",
  viewSampleFile: "View Sample File",
  tutorials: "Tutorials",
  about: "About ",
  services: "Services",
  hide: "Hide ",
  hideOthers: "Hide Others",
  showAll: "Show All",
  quit: "Quit",
  bringAllToFront: "Bring All to Front",
  theme: "Theme",
  light: "Light",
  dark: "Dark"
};
const zh = {
  file: "\u6587\u4EF6",
  open: "\u6253\u5F00",
  openRecent: "\u6253\u5F00\u6700\u8FD1\u4F7F\u7528\u7684",
  clearRecent: "\u6E05\u9664",
  save: "\u4FDD\u5B58",
  publish: "\u53D1\u5E03",
  language: "\u8BED\u8A00",
  settings: "\u8BBE\u7F6E",
  edit: "\u7F16\u8F91",
  undo: "\u64A4\u9500",
  redo: "\u91CD\u505A",
  cut: "\u526A\u5207",
  copy: "\u590D\u5236",
  paste: "\u7C98\u8D34",
  selectAll: "\u5168\u9009",
  reload: "\u91CD\u65B0\u52A0\u8F7D",
  fileTree: "\u6587\u4EF6\u5217\u8868",
  closeTab: "\u5173\u95ED\u5F53\u524D\u6587\u4EF6",
  reloadFile: "\u91CD\u65B0\u8F7D\u5165\u6587\u4EF6",
  toggleFullScreen: "\u5207\u6362\u5168\u5C4F",
  toggleDevTools: "\u5207\u6362\u5F00\u53D1\u8005\u5DE5\u5177",
  window: "\u7A97\u53E3",
  minimize: "\u6700\u5C0F\u5316",
  close: "\u5173\u95ED",
  help: "\u5E2E\u52A9",
  learnMore: "\u4E86\u89E3\u66F4\u591A",
  checkUpdate: "\u68C0\u67E5\u66F4\u65B0",
  openWelcomePage: "\u6253\u5F00\u6B22\u8FCE\u9875",
  viewSampleFile: "\u67E5\u770B\u793A\u4F8B\u6587\u6863",
  tutorials: "\u4F7F\u7528\u6559\u7A0B",
  about: "\u5173\u4E8E",
  services: "\u670D\u52A1",
  hide: "\u9690\u85CF",
  hideOthers: "\u9690\u85CF\u5176\u4ED6",
  showAll: "\u663E\u793A\u5168\u90E8",
  quit: "\u9000\u51FA",
  bringAllToFront: "\u524D\u7F6E\u5168\u90E8\u7A97\u53E3",
  theme: "\u4E3B\u9898",
  light: "\u6D45\u8272",
  dark: "\u6DF1\u8272"
};
const options = {
  name: "settings",
  cwd: "setting",
  defaults: {
    theme: true,
    language: "zh"
  }
};
const store = new Store__default.default(options);
function getLang() {
  return store.get("language", "zh");
}
function setLang(lang) {
  return store.set("language", lang);
}
function getTheme() {
  return store.get("theme", true);
}
function setTheme(theme) {
  return store.set("theme", theme);
}
electronUpdater.autoUpdater.autoDownload = false;
electronUpdater.autoUpdater.on("error", (error) => {
  electron.dialog.showErrorBox("Error: ", error == null ? "unknown" : (error.stack || error).toString());
});
electronUpdater.autoUpdater.on("update-available", () => {
  electron.dialog.showMessageBox({
    type: "info",
    title: "\u8F6F\u4EF6\u66F4\u65B0",
    message: "\u53D1\u73B0\u65B0\u7248\u672C\uFF0C\u786E\u5B9A\u66F4\u65B0\uFF1F",
    buttons: ["\u786E\u5B9A", "\u53D6\u6D88"]
  }).then((buttonIndex) => {
    if (buttonIndex.response === 0) {
      electronUpdater.autoUpdater.downloadUpdate();
    }
  });
});
electronUpdater.autoUpdater.on("update-not-available", () => {
  electron.dialog.showMessageBox({
    title: "\u6CA1\u6709\u53EF\u66F4\u65B0\u7248\u672C",
    message: "\u5F53\u524D\u7248\u672C\u5DF2\u662F\u6700\u65B0"
  });
});
electronUpdater.autoUpdater.on("update-downloaded", () => {
  electron.dialog.showMessageBox({
    title: "\u4E0B\u8F7D\u5B8C\u6210",
    message: "\u6700\u65B0\u7248\u672C\u5DF2\u4E0B\u8F7D\u5B8C\u6210, \u9000\u51FA\u7A0B\u5E8F\u8FDB\u884C\u5B89\u88C5"
  }).then(() => {
    setImmediate(() => electronUpdater.autoUpdater.quitAndInstall());
  });
});
function checkForUpdates() {
  electronUpdater.autoUpdater.checkForUpdates();
}
function menuInit(mainWindow) {
  const webContents = mainWindow.webContents, lang = getLang(), theme = getTheme(), l = lang === "zh" ? zh : en;
  function setLanguage(lang2) {
    setLang(lang2);
    webContents.send("menu.language", lang2);
    menuInit(mainWindow);
  }
  function setThemeConf(newTheme) {
    setTheme(newTheme);
    webContents.send("menu.theme", newTheme);
  }
  const template = [
    {
      label: l.file,
      submenu: [
        {
          label: l.open,
          accelerator: "CmdOrCtrl+O",
          click: function() {
            electron.dialog.showOpenDialog(mainWindow, { properties: ["openFile"], filters: [{ name: "Markdown", extensions: ["md"] }] }).then((result) => {
              if (!result.canceled && result.filePaths.length > 0) {
                webContents.send("menu.open", result.filePaths[0]);
              }
            }).catch((err) => {
              console.log(err);
            });
          }
        },
        {
          type: "separator"
        },
        {
          label: l.save,
          accelerator: "CmdOrCtrl+S",
          click: function() {
            webContents.send("menu.save");
          }
        },
        {
          label: l.publish,
          accelerator: "CmdOrCtrl+P",
          click: function() {
            webContents.send("menu.publish");
          }
        },
        {
          type: "separator"
        },
        {
          label: l.settings,
          click: function() {
            webContents.send("menu.settings");
          }
        },
        {
          label: l.language,
          submenu: [
            {
              label: "\u7B80\u4F53\u4E2D\u6587",
              type: "radio",
              checked: lang === "zh",
              click: function() {
                setLanguage("zh");
              }
            },
            {
              label: "English",
              type: "radio",
              checked: lang === "en",
              click: function() {
                setLanguage("en");
              }
            }
          ]
        }
      ]
    },
    {
      label: l.edit,
      submenu: [
        {
          label: l.undo,
          accelerator: "CmdOrCtrl+Z",
          role: "undo"
        },
        {
          label: l.redo,
          accelerator: "Shift+CmdOrCtrl+Z",
          role: "redo"
        },
        {
          type: "separator"
        },
        {
          label: l.cut,
          accelerator: "CmdOrCtrl+X",
          role: "cut"
        },
        {
          label: l.copy,
          accelerator: "CmdOrCtrl+C",
          role: "copy"
        },
        {
          label: l.paste,
          accelerator: "CmdOrCtrl+V",
          role: "paste"
        },
        {
          label: l.selectAll,
          accelerator: "CmdOrCtrl+A",
          role: "selectall"
        }
      ]
    },
    {
      label: l.window,
      role: "window",
      submenu: [
        {
          label: l.fileTree,
          accelerator: function() {
            return "Ctrl+Shift+L";
          }(),
          click: function() {
            webContents.send("menu.showfile");
          }
        },
        {
          label: l.toggleFullScreen,
          accelerator: function() {
            if (process.platform === "darwin")
              return "Ctrl+Command+F";
            else
              return "F11";
          }(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
        {
          label: l.minimize,
          accelerator: "CmdOrCtrl+M",
          role: "minimize"
        },
        {
          label: l.reloadFile,
          accelerator: "F5",
          click: function() {
            webContents.send("menu.reloadfile");
          }
        },
        {
          label: l.closeTab,
          accelerator: function() {
            return "Ctrl+F4";
          }(),
          click: function() {
            webContents.send("menu.closetab");
          }
        },
        {
          type: "separator"
        },
        {
          label: l.reload,
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload();
          }
        },
        {
          label: l.toggleDevTools,
          accelerator: function() {
            return "Ctrl+Shift+I";
          }(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.toggleDevTools();
          }
        },
        {
          type: "separator"
        },
        {
          label: l.close,
          accelerator: "CmdOrCtrl+W",
          role: "close"
        }
      ]
    },
    {
      label: l.theme,
      role: "theme",
      submenu: [
        {
          label: l.light,
          type: "radio",
          checked: theme,
          click: function() {
            setThemeConf(true);
          }
        },
        {
          label: l.dark,
          type: "radio",
          checked: !theme,
          click: function() {
            setThemeConf(false);
          }
        }
      ]
    },
    {
      label: l.help,
      role: "help",
      submenu: [
        {
          label: l.openWelcomePage,
          click: function() {
            webContents.send("menu.welcome");
          }
        },
        {
          label: l.viewSampleFile,
          click: function() {
            webContents.send("menu.sample");
          }
        },
        {
          label: l.tutorials,
          click: function() {
            electron.shell.openExternal("https://gitee.com/xaotuman/push-markdown/blob/master/docs/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.md");
          }
        },
        {
          label: l.learnMore,
          click: function() {
            electron.app.getAppPath();
            electron.shell.openExternal("https://szx.life/push-markdown%E9%87%8D%E6%9E%84/");
          }
        },
        {
          type: "separator"
        },
        {
          label: l.checkUpdate,
          click: function() {
            checkForUpdates();
          }
        },
        {
          type: "separator"
        },
        {
          label: l.about,
          click: function() {
            electron.dialog.showMessageBox({
              title: "\u5173\u4E8E\u8F6F\u4EF6",
              icon: "public/app.ico",
              message: "push-markdown v" + electron.app.getVersion(),
              detail: `Node.js: ${process.versions.node}
Electron: ${process.versions.electron}
Chromium: ${process.versions.chrome}
Platform: ${process.platform}
Install: ${electron.app.getAppPath()}

\u4F5C\u8005\uFF1Aszx
\u4F5C\u8005\u535A\u5BA2\uFF1Ahttps://szx.life
\u6E90\u7801\u53D1\u5E03\u5730\u5740\uFF1Ahttps://gitee.com/xaotuman/push-markdown
\u8F6F\u4EF6\u53D1\u5E03\u5730\u5740\uFF1Ahttp://download.szx.life`
            });
          }
        }
      ]
    }
  ];
  if (process.platform === "darwin") {
    const name = electron.app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          label: l.about + name,
          role: "about"
        },
        {
          type: "separator"
        },
        {
          label: l.services,
          role: "services",
          submenu: []
        },
        {
          type: "separator"
        },
        {
          label: l.hide + name,
          accelerator: "Command+H",
          role: "hide"
        },
        {
          label: l.hideOthers,
          accelerator: "Command+Shift+H",
          role: "hideothers"
        },
        {
          label: l.showAll,
          role: "unhide"
        },
        {
          type: "separator"
        },
        {
          label: l.quit,
          accelerator: "Command+Q",
          click: function() {
            electron.app.quit();
          }
        }
      ]
    });
    const windowMenu = template.find(function(m) {
      return m.role === "window";
    });
    if (windowMenu) {
      windowMenu.submenu.push(
        {
          type: "separator"
        },
        {
          label: l.bringAllToFront,
          role: "front"
        }
      );
    }
  }
  const menu = electron.Menu.buildFromTemplate(template);
  electron.Menu.setApplicationMenu(menu);
}
async function createWindow() {
  const browserWindow = new electron.BrowserWindow({
    minHeight: 180,
    minWidth: 320,
    width: 1500,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      webviewTag: false,
      preload: path.join(__dirname, "../../preload/dist/index.cjs")
    }
  });
  browserWindow.on("ready-to-show", () => {
    menuInit(browserWindow);
    browserWindow == null ? void 0 : browserWindow.show();
    {
      browserWindow == null ? void 0 : browserWindow.webContents.openDevTools();
    }
  });
  const pageUrl = "http://127.0.0.1:5173/";
  await browserWindow.loadURL(pageUrl);
  return browserWindow;
}
async function restoreOrCreateWindow() {
  let window = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
  if (window === void 0) {
    window = await createWindow();
  }
  if (window.isMinimized()) {
    window.restore();
  }
  window.focus();
}
const isSingleInstance = electron.app.requestSingleInstanceLock();
if (!isSingleInstance) {
  electron.app.quit();
  process.exit(0);
}
electron.app.on("second-instance", restoreOrCreateWindow);
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0)
    restoreOrCreateWindow();
});
electron.app.whenReady().then(() => {
  restoreOrCreateWindow();
  electron.protocol.registerFileProtocol("atom", (request, callback) => {
    const url = request.url.replace(/^atom:\/\//, "");
    const decodedUrl = decodeURI(url);
    try {
      return callback({ path: path.normalize(decodedUrl) });
    } catch (error) {
      console.error("ERROR: registerLocalResourceProtocol: Could not get file path:", error);
    }
  });
}).catch((e) => console.error("Failed create window:", e));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6WyIuLi9zcmMvaXBjLW1lc3NhZ2UudHMiLCIuLi9zcmMvYXBwLW1lbnUvbWVudS1sYW5nLnRzIiwiLi4vc3JjL2FwcC1tZW51L3N0b3JlLnRzIiwiLi4vc3JjL2FwcC1tZW51L3VwZGF0ZXIudHMiLCIuLi9zcmMvYXBwLW1lbnUvaW5kZXgudHMiLCIuLi9zcmMvbWFpbldpbmRvdy50cyIsIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjEtMDctMDUgMjA6NTc6MTBcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wOC0wMiAyMDoxOTozOVxyXG4gKiBARGVzY3JpcHRpb246XHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxpcGMtbWVzc2FnZS50c1xyXG4gKi9cclxuXHJcbmltcG9ydCB7IGFwcCwgaXBjTWFpbiB9IGZyb20gJ2VsZWN0cm9uJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG4vKlxyXG4gIC8vIOWunumqjOaAp+i0qFxyXG4gIGlwY01haW4ub24oJ3RvTWFpbicsIChldmVudCwgYXJncykgPT4ge1xyXG4gICAgLy8gZXZlbnQucmVwbHkoJ2Zyb21NYWluJywgJ+WQjuaSpOatpTg4OCcpO1xyXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdmcm9tTWFpbicsICflkI7mkqTmraU3NzcnKTtcclxuICB9KTtcclxuXHJcbiAgLy8g54S25ZCO5Zyo5riy5p+T6L+b56iL5Lit5L2/55So5LiL6Z2i55qE6L+Z5q616K+t5Y+lXHJcbiAgLy8g5LuO5Li76L+b56iL6YCa6YGTRnJvbU1haW7mjqXlj5fkv6Hmga9cclxuICBpcGMucmVjZWl2ZSgnZnJvbU1haW4nLCAoZGF0YTogYW55KSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhgUmVjZWl2ZWQgJHtkYXRhfSBmcm9tIG1haW4gcHJvY2Vzc2ApO1xyXG4gIH0pO1xyXG4gIC8vIOWPkemAgeS/oeaBr+e7meS4u+i/m+eoi+mAmumBk3RvTWFpblxyXG4gIGlwYy5zZW5kKCd0b01haW4nLCAnc29tZSBkYXRhJyk7XHJcbiovXHJcbi8vIOiOt+W+l+W9k+WJjeWuieijheWMhei3r+W+hFxyXG5pcGNNYWluLm9uKCdleGVQYXRoJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyBldmVudC5yZXBseSgnZXhlUGF0aCcsIHBhdGguZGlybmFtZShhcHAuZ2V0UGF0aCgnZXhlJykpKTtcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IHBhdGguZGlybmFtZShhcHAuZ2V0UGF0aCgnZXhlJykpO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ2FkZFJlY2VudERvY3VtZW50JywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyBldmVudC5yZXBseSgnZXhlUGF0aCcsIHBhdGguZGlybmFtZShhcHAuZ2V0UGF0aCgnZXhlJykpKTtcclxuICBjb25zb2xlLmxvZyhhcmcpO1xyXG4gIGV2ZW50LnJldHVyblZhbHVlID0gYXBwLmFkZFJlY2VudERvY3VtZW50KGFyZyk7XHJcbn0pO1xyXG5cclxuLy8g6I635b6X5b2T5YmN54mI5pys5Y+3XHJcbmlwY01haW4ub24oJ3ZlcnNpb24nLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIC8vICAgZXZlbnQucmVwbHkoJ3ZlcnNpb24nLCBhcHAuZ2V0VmVyc2lvbigpKTtcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IGFwcC5nZXRWZXJzaW9uKCk7XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5vbigncGxhdGZvcm0nLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIC8vICAgZXZlbnQucmVwbHkoJ3ZlcnNpb24nLCBhcHAuZ2V0VmVyc2lvbigpKTtcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IHByb2Nlc3MucGxhdGZvcm07XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5vbignYXJndicsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgLy8gICBldmVudC5yZXBseSgndmVyc2lvbicsIGFwcC5nZXRWZXJzaW9uKCkpO1xyXG4gIGV2ZW50LnJldHVyblZhbHVlID0gcHJvY2Vzcy5hcmd2O1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ19fc3RhdGljJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyBldmVudC5yZXBseSgnZXhlUGF0aCcsIHBhdGguZGlybmFtZShhcHAuZ2V0UGF0aCgnZXhlJykpKTtcclxuICAvLyBldmVudC5yZXR1cm5WYWx1ZSA9IF9fc3RhdGljO1xyXG4gIC8vIGV2ZW50LnJldHVyblZhbHVlID0gJy4vJztcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IF9fZGlybmFtZTtcclxufSk7XHJcblxyXG4vLyDkuK3ovazmtojmga/vvIzmuLLmn5Pov5vnqIvlj5Hnu5nkuLvov5vnqIvvvIzkuLvov5vnqIvlho3lj5Hnu5nmuLLmn5Pov5vnqItcclxuaXBjTWFpbi5vbignbWVudS5zZXR0aW5ncycsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgZXZlbnQucmVwbHkoJ21lbnUuc2V0dGluZ3MnLCBhcmcpO1xyXG59KTtcclxuXHJcbi8vIGlwY01haW4ub24oJ21lbnUuc2hvd2ZpbGUnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4vLyAgIGV2ZW50LnJlcGx5KCdtZW51LnNob3dmaWxlJywgYXJnKTtcclxuLy8gfSk7XHJcblxyXG4vLyDkuK3ovazmtojmga/vvIzmuLLmn5Pov5vnqIvlj5Hnu5nkuLvov5vnqIvvvIzkuLvov5vnqIvlho3lj5Hnu5nmuLLmn5Pov5vnqItcclxuaXBjTWFpbi5vbignbWVudS5zYW1wbGUnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIGV2ZW50LnJlcGx5KCdtZW51LnNhbXBsZScsIGFyZyk7XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5vbignb25kcmFnc3RhcnQnLCAoZXZlbnQsIGZpbGVQYXRoKSA9PiB7XHJcbiAgZXZlbnQuc2VuZGVyLnN0YXJ0RHJhZyh7XHJcbiAgICBmaWxlOiBmaWxlUGF0aCxcclxuICAgIGljb246ICcvcGF0aC90by9pY29uLnBuZydcclxuICB9KTtcclxufSk7XHJcblxyXG5leHBvcnQgeyBpcGNNYWluIGFzIGlwY01haW5Db2xsZWN0aW9uIH07XHJcbiIsIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMS0wNy0wNCAxOTowMDo1OFxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA4LTA0IDEyOjA5OjIxXHJcbiAqIEBEZXNjcmlwdGlvbjog56qX5Y+j55qE5aSa6K+t6KiA5pSv5oyBXHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxhcHAtbWVudVxcbWVudS1sYW5nLnRzXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVuID0ge1xyXG4gIGZpbGU6ICdGaWxlJyxcclxuICBvcGVuOiAnT3BlbicsXHJcbiAgb3BlblJlY2VudDogJ09wZW4gUmVjZW50JyxcclxuICBjbGVhclJlY2VudDogJ0NsZWFyJyxcclxuICBzYXZlOiAnU2F2ZScsXHJcbiAgcHVibGlzaDogJ1B1Ymxpc2gnLFxyXG4gIGxhbmd1YWdlOiAnTGFuZ3VhZ2UnLFxyXG4gIHNldHRpbmdzOiAnU2V0dGluZ3MnLFxyXG4gIGVkaXQ6ICdFZGl0JyxcclxuICB1bmRvOiAnVW5kbycsXHJcbiAgcmVkbzogJ1JlZG8nLFxyXG4gIGN1dDogJ0N1dCcsXHJcbiAgY29weTogJ0NvcHknLFxyXG4gIHBhc3RlOiAnUGFzdGUnLFxyXG4gIHNlbGVjdEFsbDogJ1NlbGVjdCBBbGwnLFxyXG4gIHJlbG9hZDogJ1JlbG9hZCcsXHJcbiAgZmlsZVRyZWU6ICdGaWxlIHRyZWUnLFxyXG4gIGNsb3NlVGFiOiAnQ2xvc2UgQ3VycmVudCBGaWxlJyxcclxuICByZWxvYWRGaWxlOiAnUmVsb2FkIEZpbGUnLFxyXG4gIHRvZ2dsZUZ1bGxTY3JlZW46ICdUb2dnbGUgRnVsbCBTY3JlZW4nLFxyXG4gIHRvZ2dsZURldlRvb2xzOiAnVG9nZ2xlIERldmVsb3BlciBUb29scycsXHJcbiAgd2luZG93OiAnV2luZG93JyxcclxuICBtaW5pbWl6ZTogJ01pbmltaXplJyxcclxuICBjbG9zZTogJ0Nsb3NlJyxcclxuICBoZWxwOiAnSGVscCcsXHJcbiAgbGVhcm5Nb3JlOiAnTGVhcm4gTW9yZScsXHJcbiAgY2hlY2tVcGRhdGU6ICdDaGVjayBVcGRhdGUnLFxyXG4gIG9wZW5XZWxjb21lUGFnZTogJ09wZW4gV2VsY29tZSBQYWdlJyxcclxuICB2aWV3U2FtcGxlRmlsZTogJ1ZpZXcgU2FtcGxlIEZpbGUnLFxyXG4gIHR1dG9yaWFsczogJ1R1dG9yaWFscycsXHJcbiAgYWJvdXQ6ICdBYm91dCAnLFxyXG4gIHNlcnZpY2VzOiAnU2VydmljZXMnLFxyXG4gIGhpZGU6ICdIaWRlICcsXHJcbiAgaGlkZU90aGVyczogJ0hpZGUgT3RoZXJzJyxcclxuICBzaG93QWxsOiAnU2hvdyBBbGwnLFxyXG4gIHF1aXQ6ICdRdWl0JyxcclxuICBicmluZ0FsbFRvRnJvbnQ6ICdCcmluZyBBbGwgdG8gRnJvbnQnLFxyXG4gIHRoZW1lOiAnVGhlbWUnLFxyXG4gIGxpZ2h0OiAnTGlnaHQnLFxyXG4gIGRhcms6ICdEYXJrJ1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHpoID0ge1xyXG4gIGZpbGU6ICfmlofku7YnLFxyXG4gIG9wZW46ICfmiZPlvIAnLFxyXG4gIG9wZW5SZWNlbnQ6ICfmiZPlvIDmnIDov5Hkvb/nlKjnmoQnLFxyXG4gIGNsZWFyUmVjZW50OiAn5riF6ZmkJyxcclxuICBzYXZlOiAn5L+d5a2YJyxcclxuICBwdWJsaXNoOiAn5Y+R5biDJyxcclxuICBsYW5ndWFnZTogJ+ivreiogCcsXHJcbiAgc2V0dGluZ3M6ICforr7nva4nLFxyXG4gIGVkaXQ6ICfnvJbovpEnLFxyXG4gIHVuZG86ICfmkqTplIAnLFxyXG4gIHJlZG86ICfph43lgZonLFxyXG4gIGN1dDogJ+WJquWIhycsXHJcbiAgY29weTogJ+WkjeWIticsXHJcbiAgcGFzdGU6ICfnspjotLQnLFxyXG4gIHNlbGVjdEFsbDogJ+WFqOmAiScsXHJcbiAgcmVsb2FkOiAn6YeN5paw5Yqg6L29JyxcclxuICBmaWxlVHJlZTogJ+aWh+S7tuWIl+ihqCcsXHJcbiAgY2xvc2VUYWI6ICflhbPpl63lvZPliY3mlofku7YnLFxyXG4gIHJlbG9hZEZpbGU6ICfph43mlrDovb3lhaXmlofku7YnLFxyXG4gIHRvZ2dsZUZ1bGxTY3JlZW46ICfliIfmjaLlhajlsY8nLFxyXG4gIHRvZ2dsZURldlRvb2xzOiAn5YiH5o2i5byA5Y+R6ICF5bel5YW3JyxcclxuICB3aW5kb3c6ICfnqpflj6MnLFxyXG4gIG1pbmltaXplOiAn5pyA5bCP5YyWJyxcclxuICBjbG9zZTogJ+WFs+mXrScsXHJcbiAgaGVscDogJ+W4ruWKqScsXHJcbiAgbGVhcm5Nb3JlOiAn5LqG6Kej5pu05aSaJyxcclxuICBjaGVja1VwZGF0ZTogJ+ajgOafpeabtOaWsCcsXHJcbiAgb3BlbldlbGNvbWVQYWdlOiAn5omT5byA5qyi6L+O6aG1JyxcclxuICB2aWV3U2FtcGxlRmlsZTogJ+afpeeci+ekuuS+i+aWh+ahoycsXHJcbiAgdHV0b3JpYWxzOiAn5L2/55So5pWZ56iLJyxcclxuICBhYm91dDogJ+WFs+S6jicsXHJcbiAgc2VydmljZXM6ICfmnI3liqEnLFxyXG4gIGhpZGU6ICfpmpDol48nLFxyXG4gIGhpZGVPdGhlcnM6ICfpmpDol4/lhbbku5YnLFxyXG4gIHNob3dBbGw6ICfmmL7npLrlhajpg6gnLFxyXG4gIHF1aXQ6ICfpgIDlh7onLFxyXG4gIGJyaW5nQWxsVG9Gcm9udDogJ+WJjee9ruWFqOmDqOeql+WPoycsXHJcbiAgdGhlbWU6ICfkuLvpopgnLFxyXG4gIGxpZ2h0OiAn5rWF6ImyJyxcclxuICBkYXJrOiAn5rex6ImyJ1xyXG59O1xyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjEtMDctMDQgMTg6NDc6NDRcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wOC0wNSAwMDowNDo1NFxyXG4gKiBARGVzY3JpcHRpb246IGVsZWN0cm9uLXNvdHJl5a2Y5YKo6K+t6KiA5YC8XHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxhcHAtbWVudVxcc3RvcmUudHNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgU3RvcmUgZnJvbSAnZWxlY3Ryb24tc3RvcmUnO1xyXG5cclxuY29uc3Qgb3B0aW9ucyA9IHtcclxuICBuYW1lOiAnc2V0dGluZ3MnLFxyXG4gIGN3ZDogJ3NldHRpbmcnLFxyXG4gIGRlZmF1bHRzOiB7XHJcbiAgICB0aGVtZTogdHJ1ZSxcclxuICAgIGxhbmd1YWdlOiAnemgnXHJcbiAgfVxyXG59O1xyXG4vLyDlrZjlgqjnmoTmlofku7blkI3kuLpzZXR0aW5nc1xyXG5jb25zdCBzdG9yZSA9IG5ldyBTdG9yZShvcHRpb25zKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRMYW5nKCkge1xyXG4gIHJldHVybiBzdG9yZS5nZXQoJ2xhbmd1YWdlJywgJ3poJyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRMYW5nKGxhbmc6IHN0cmluZykge1xyXG4gIHJldHVybiBzdG9yZS5zZXQoJ2xhbmd1YWdlJywgbGFuZyk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRoZW1lKCkge1xyXG4gIHJldHVybiBzdG9yZS5nZXQoJ3RoZW1lJywgdHJ1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRUaGVtZSh0aGVtZTogYm9vbGVhbikge1xyXG4gIHJldHVybiBzdG9yZS5zZXQoJ3RoZW1lJywgdGhlbWUpO1xyXG59XHJcbiIsIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMi0wOC0wNCAxMToyODo1OVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA4LTA0IDEzOjE5OjM5XHJcbiAqIEBEZXNjcmlwdGlvbjpcclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxtYWluXFxzcmNcXGFwcC1tZW51XFx1cGRhdGVyLnRzXHJcbiAqL1xyXG5pbXBvcnQgeyBkaWFsb2cgfSBmcm9tICdlbGVjdHJvbic7XHJcbmltcG9ydCB7IGF1dG9VcGRhdGVyIH0gZnJvbSAnZWxlY3Ryb24tdXBkYXRlcic7XHJcblxyXG5hdXRvVXBkYXRlci5hdXRvRG93bmxvYWQgPSBmYWxzZTtcclxuXHJcbmF1dG9VcGRhdGVyLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xyXG4gIGRpYWxvZy5zaG93RXJyb3JCb3goJ0Vycm9yOiAnLCBlcnJvciA9PSBudWxsID8gJ3Vua25vd24nIDogKGVycm9yLnN0YWNrIHx8IGVycm9yKS50b1N0cmluZygpKTtcclxufSk7XHJcblxyXG5hdXRvVXBkYXRlci5vbigndXBkYXRlLWF2YWlsYWJsZScsICgpID0+IHtcclxuICBkaWFsb2dcclxuICAgIC5zaG93TWVzc2FnZUJveCh7XHJcbiAgICAgIHR5cGU6ICdpbmZvJyxcclxuICAgICAgdGl0bGU6ICfova/ku7bmm7TmlrAnLFxyXG4gICAgICBtZXNzYWdlOiAn5Y+R546w5paw54mI5pys77yM56Gu5a6a5pu05paw77yfJyxcclxuICAgICAgYnV0dG9uczogWyfnoa7lrponLCAn5Y+W5raIJ11cclxuICAgIH0pXHJcbiAgICAudGhlbigoYnV0dG9uSW5kZXgpID0+IHtcclxuICAgICAgaWYgKGJ1dHRvbkluZGV4LnJlc3BvbnNlID09PSAwKSB7XHJcbiAgICAgICAgYXV0b1VwZGF0ZXIuZG93bmxvYWRVcGRhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuYXV0b1VwZGF0ZXIub24oJ3VwZGF0ZS1ub3QtYXZhaWxhYmxlJywgKCkgPT4ge1xyXG4gIGRpYWxvZy5zaG93TWVzc2FnZUJveCh7XHJcbiAgICB0aXRsZTogJ+ayoeacieWPr+abtOaWsOeJiOacrCcsXHJcbiAgICBtZXNzYWdlOiAn5b2T5YmN54mI5pys5bey5piv5pyA5pawJ1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbmF1dG9VcGRhdGVyLm9uKCd1cGRhdGUtZG93bmxvYWRlZCcsICgpID0+IHtcclxuICBkaWFsb2dcclxuICAgIC5zaG93TWVzc2FnZUJveCh7XHJcbiAgICAgIHRpdGxlOiAn5LiL6L295a6M5oiQJyxcclxuICAgICAgbWVzc2FnZTogJ+acgOaWsOeJiOacrOW3suS4i+i9veWujOaIkCwg6YCA5Ye656iL5bqP6L+b6KGM5a6J6KOFJ1xyXG4gICAgfSlcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgc2V0SW1tZWRpYXRlKCgpID0+IGF1dG9VcGRhdGVyLnF1aXRBbmRJbnN0YWxsKCkpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuLy8gZXhwb3J0IHRoaXMgdG8gTWVudUl0ZW0gY2xpY2sgY2FsbGJhY2tcclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlcygpIHtcclxuICBhdXRvVXBkYXRlci5jaGVja0ZvclVwZGF0ZXMoKTtcclxufVxyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjItMDctMjMgMTk6NTc6MzFcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wOC0wNSAwMDoxMzo1MVxyXG4gKiBARGVzY3JpcHRpb246XHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxhcHAtbWVudVxcaW5kZXgudHNcclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vZGlhbG9n5qih5Z2X5o+Q5L6b5LqGYXBp5p2l5bGV56S65Y6f55Sf55qE57O757uf5a+56K+d5qGG77yM5L6L5aaC5omT5byA5paH5Lu25qGG77yMYWxlcnTmoYZcclxuaW1wb3J0IHsgTWVudSwgYXBwLCBkaWFsb2csIHNoZWxsLCBCcm93c2VyV2luZG93IH0gZnJvbSAnZWxlY3Ryb24nO1xyXG5pbXBvcnQgKiBhcyBsYW5ndWFnZSBmcm9tICcuL21lbnUtbGFuZyc7XHJcbmltcG9ydCB7IHNldExhbmcsIHNldFRoZW1lLCBnZXRMYW5nLCBnZXRUaGVtZSB9IGZyb20gJy4vc3RvcmUnO1xyXG5pbXBvcnQgeyBjaGVja0ZvclVwZGF0ZXMgfSBmcm9tICcuL3VwZGF0ZXInO1xyXG4vLyDliqDovb3oj5zljZXmoI9cclxuZXhwb3J0IGZ1bmN0aW9uIG1lbnVJbml0KG1haW5XaW5kb3c6IEJyb3dzZXJXaW5kb3cpIHtcclxuICAvLyB3ZWJDb250ZW50c+Wug+i0n+i0o+a4suafk+W5tuaOp+WItue9kemhtVxyXG4gIGNvbnN0IHdlYkNvbnRlbnRzID0gbWFpbldpbmRvdy53ZWJDb250ZW50cyxcclxuICAgIGxhbmcgPSBnZXRMYW5nKCksIC8vIOW9k+WJjeeahOivreiogFxyXG4gICAgdGhlbWUgPSBnZXRUaGVtZSgpLCAvL+W9k+WJjeeahOS4u+mimFxyXG4gICAgbCA9IGxhbmcgPT09ICd6aCcgPyBsYW5ndWFnZS56aCA6IGxhbmd1YWdlLmVuO1xyXG4gIC8vIOiuvue9ruivreiogFxyXG4gIGZ1bmN0aW9uIHNldExhbmd1YWdlKGxhbmc6IHN0cmluZykge1xyXG4gICAgc2V0TGFuZyhsYW5nKTtcclxuICAgIC8vIOmAmui/hyBjaGFubmVsIOWPkemAgeW8guatpea2iOaBr+e7mea4suafk+i/m+eoi1xyXG4gICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5sYW5ndWFnZScsIGxhbmcpO1xyXG4gICAgLy8g6YeN5paw5riy5p+T6I+c5Y2V5qCPXHJcbiAgICBtZW51SW5pdChtYWluV2luZG93KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNldFRoZW1lQ29uZihuZXdUaGVtZTogYm9vbGVhbikge1xyXG4gICAgc2V0VGhlbWUobmV3VGhlbWUpO1xyXG4gICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS50aGVtZScsIG5ld1RoZW1lKTtcclxuICB9XHJcbiAgLy8g6I+c5Y2V5qCP5qih5p2/XHJcbiAgY29uc3QgdGVtcGxhdGU6IGFueVtdID0gW1xyXG4gICAge1xyXG4gICAgICBsYWJlbDogbC5maWxlLFxyXG4gICAgICAvL+aWh+S7tuS4i+aLieWxnuaAp1xyXG4gICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwub3BlbixcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK08nLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZGlhbG9nXHJcbiAgICAgICAgICAgICAgLnNob3dPcGVuRGlhbG9nKG1haW5XaW5kb3csIHsgcHJvcGVydGllczogWydvcGVuRmlsZSddLCBmaWx0ZXJzOiBbeyBuYW1lOiAnTWFya2Rvd24nLCBleHRlbnNpb25zOiBbJ21kJ10gfV0gfSlcclxuICAgICAgICAgICAgICAudGhlbigocmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LmNhbmNlbGVkICYmIHJlc3VsdC5maWxlUGF0aHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51Lm9wZW4nLCByZXN1bHQuZmlsZVBhdGhzWzBdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgLy8g5YiG6ZqU5qiq57q/XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuc2F2ZSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1MnLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5zYXZlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5wdWJsaXNoLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUCcsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnB1Ymxpc2gnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5zZXR0aW5ncyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUuc2V0dGluZ3MnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmxhbmd1YWdlLFxyXG4gICAgICAgICAgc3VibWVudTogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbGFiZWw6ICfnroDkvZPkuK3mlocnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdyYWRpbycsXHJcbiAgICAgICAgICAgICAgY2hlY2tlZDogbGFuZyA9PT0gJ3poJyxcclxuICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0TGFuZ3VhZ2UoJ3poJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbGFiZWw6ICdFbmdsaXNoJyxcclxuICAgICAgICAgICAgICB0eXBlOiAncmFkaW8nLFxyXG4gICAgICAgICAgICAgIGNoZWNrZWQ6IGxhbmcgPT09ICdlbicsXHJcbiAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNldExhbmd1YWdlKCdlbicpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIC8v56ys5LqM5Liq6I+c5Y2VXHJcbiAgICB7XHJcbiAgICAgIGxhYmVsOiBsLmVkaXQsXHJcbiAgICAgIHN1Ym1lbnU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC51bmRvLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrWicsXHJcbiAgICAgICAgICByb2xlOiAndW5kbydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnJlZG8sXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ1NoaWZ0K0NtZE9yQ3RybCtaJyxcclxuICAgICAgICAgIHJvbGU6ICdyZWRvJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmN1dCxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1gnLFxyXG4gICAgICAgICAgcm9sZTogJ2N1dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmNvcHksXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtDJyxcclxuICAgICAgICAgIHJvbGU6ICdjb3B5J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwucGFzdGUsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtWJyxcclxuICAgICAgICAgIHJvbGU6ICdwYXN0ZSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnNlbGVjdEFsbCxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK0EnLFxyXG4gICAgICAgICAgcm9sZTogJ3NlbGVjdGFsbCdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICAvLyDnqpflj6Poj5zljZVcclxuICAgIHtcclxuICAgICAgbGFiZWw6IGwud2luZG93LFxyXG4gICAgICByb2xlOiAnd2luZG93JyxcclxuICAgICAgc3VibWVudTogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmZpbGVUcmVlLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnQ3RybCtTaGlmdCtMJztcclxuICAgICAgICAgIH0pKCksXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnNob3dmaWxlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC50b2dnbGVGdWxsU2NyZWVuLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJykgcmV0dXJuICdDdHJsK0NvbW1hbmQrRic7XHJcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuICdGMTEnO1xyXG4gICAgICAgICAgfSkoKSxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoaXRlbTogYW55LCBmb2N1c2VkV2luZG93OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKGZvY3VzZWRXaW5kb3cpIGZvY3VzZWRXaW5kb3cuc2V0RnVsbFNjcmVlbighZm9jdXNlZFdpbmRvdy5pc0Z1bGxTY3JlZW4oKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5taW5pbWl6ZSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK00nLFxyXG4gICAgICAgICAgcm9sZTogJ21pbmltaXplJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwucmVsb2FkRmlsZSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnRjUnLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5yZWxvYWRmaWxlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5jbG9zZVRhYixcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ0N0cmwrRjQnO1xyXG4gICAgICAgICAgfSkoKSxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUuY2xvc2V0YWInKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5yZWxvYWQsXHJcbiAgICAgICAgICAvLyBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtSJyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoaXRlbTogYW55LCBmb2N1c2VkV2luZG93OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKGZvY3VzZWRXaW5kb3cpIGZvY3VzZWRXaW5kb3cucmVsb2FkKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC50b2dnbGVEZXZUb29scyxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ0N0cmwrU2hpZnQrSSc7XHJcbiAgICAgICAgICB9KSgpLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIChpdGVtOiBhbnksIGZvY3VzZWRXaW5kb3c6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoZm9jdXNlZFdpbmRvdykgZm9jdXNlZFdpbmRvdy50b2dnbGVEZXZUb29scygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmNsb3NlLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrVycsXHJcbiAgICAgICAgICByb2xlOiAnY2xvc2UnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIOS4u+mimOiPnOWNlVxyXG4gICAge1xyXG4gICAgICBsYWJlbDogbC50aGVtZSxcclxuICAgICAgcm9sZTogJ3RoZW1lJyxcclxuICAgICAgc3VibWVudTogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmxpZ2h0LFxyXG4gICAgICAgICAgdHlwZTogJ3JhZGlvJyxcclxuICAgICAgICAgIGNoZWNrZWQ6IHRoZW1lLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VGhlbWVDb25mKHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuZGFyayxcclxuICAgICAgICAgIHR5cGU6ICdyYWRpbycsXHJcbiAgICAgICAgICBjaGVja2VkOiAhdGhlbWUsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZXRUaGVtZUNvbmYoZmFsc2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyDluK7liqnoj5zljZVcclxuICAgIHtcclxuICAgICAgbGFiZWw6IGwuaGVscCxcclxuICAgICAgcm9sZTogJ2hlbHAnLFxyXG4gICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwub3BlbldlbGNvbWVQYWdlLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS53ZWxjb21lJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC52aWV3U2FtcGxlRmlsZSxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUuc2FtcGxlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC50dXRvcmlhbHMsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBhcHAuZ2V0QXBwUGF0aCgpO1xyXG4gICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vZ2l0ZWUuY29tL3hhb3R1bWFuL3B1c2gtbWFya2Rvd24vYmxvYi9tYXN0ZXIvZG9jcy8lRTQlQkQlQkYlRTclOTQlQTglRTYlOTUlOTklRTclQTglOEIubWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmxlYXJuTW9yZSxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFwcC5nZXRBcHBQYXRoKCk7XHJcbiAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9zengubGlmZS9wdXNoLW1hcmtkb3duJUU5JTg3JThEJUU2JTlFJTg0LycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmNoZWNrVXBkYXRlLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2hlY2tGb3JVcGRhdGVzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuYWJvdXQsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkaWFsb2cuc2hvd01lc3NhZ2VCb3goe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiAn5YWz5LqO6L2v5Lu2JyxcclxuICAgICAgICAgICAgICBpY29uOiAncHVibGljL2FwcC5pY28nLFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdwdXNoLW1hcmtkb3duIHYnICsgYXBwLmdldFZlcnNpb24oKSxcclxuICAgICAgICAgICAgICBkZXRhaWw6IGBOb2RlLmpzOiAke3Byb2Nlc3MudmVyc2lvbnMubm9kZX1cclxuRWxlY3Ryb246ICR7cHJvY2Vzcy52ZXJzaW9ucy5lbGVjdHJvbn1cclxuQ2hyb21pdW06ICR7cHJvY2Vzcy52ZXJzaW9ucy5jaHJvbWV9XHJcblBsYXRmb3JtOiAke3Byb2Nlc3MucGxhdGZvcm19XHJcbkluc3RhbGw6ICR7YXBwLmdldEFwcFBhdGgoKX1cclxuXHJcbuS9nOiAhe+8mnN6eFxyXG7kvZzogIXljZrlrqLvvJpodHRwczovL3N6eC5saWZlXHJcbua6kOeggeWPkeW4g+WcsOWdgO+8mmh0dHBzOi8vZ2l0ZWUuY29tL3hhb3R1bWFuL3B1c2gtbWFya2Rvd25cclxu6L2v5Lu25Y+R5biD5Zyw5Z2A77yaaHR0cDovL2Rvd25sb2FkLnN6eC5saWZlYFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICBdO1xyXG5cclxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcclxuICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9IGFwcC5nZXROYW1lKCk7XHJcbiAgICB0ZW1wbGF0ZS51bnNoaWZ0KHtcclxuICAgICAgbGFiZWw6IG5hbWUsXHJcbiAgICAgIHN1Ym1lbnU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5hYm91dCArIG5hbWUsXHJcbiAgICAgICAgICByb2xlOiAnYWJvdXQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuc2VydmljZXMsXHJcbiAgICAgICAgICByb2xlOiAnc2VydmljZXMnLFxyXG4gICAgICAgICAgc3VibWVudTogW11cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5oaWRlICsgbmFtZSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ29tbWFuZCtIJyxcclxuICAgICAgICAgIHJvbGU6ICdoaWRlJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuaGlkZU90aGVycyxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ29tbWFuZCtTaGlmdCtIJyxcclxuICAgICAgICAgIHJvbGU6ICdoaWRlb3RoZXJzJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuc2hvd0FsbCxcclxuICAgICAgICAgIHJvbGU6ICd1bmhpZGUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwucXVpdCxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ29tbWFuZCtRJyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFwcC5xdWl0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHdpbmRvd01lbnUgPSB0ZW1wbGF0ZS5maW5kKGZ1bmN0aW9uIChtKSB7XHJcbiAgICAgIHJldHVybiBtLnJvbGUgPT09ICd3aW5kb3cnO1xyXG4gICAgfSk7XHJcbiAgICBpZiAod2luZG93TWVudSkge1xyXG4gICAgICB3aW5kb3dNZW51LnN1Ym1lbnUucHVzaChcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuYnJpbmdBbGxUb0Zyb250LFxyXG4gICAgICAgICAgcm9sZTogJ2Zyb250J1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IG1lbnUgPSBNZW51LmJ1aWxkRnJvbVRlbXBsYXRlKHRlbXBsYXRlKTtcclxuICBNZW51LnNldEFwcGxpY2F0aW9uTWVudShtZW51KTtcclxufVxyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjItMDctMjMgMTM6NDA6MzFcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wOC0wNSAxMTowNzoyMVxyXG4gKiBARGVzY3JpcHRpb246IOS4u+eql+WPo+iuvue9rlxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcbWFpbldpbmRvdy50c1xyXG4gKi9cclxuaW1wb3J0IHsgQnJvd3NlcldpbmRvdyB9IGZyb20gJ2VsZWN0cm9uJztcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBVUkwgfSBmcm9tICd1cmwnO1xyXG5cclxuaW1wb3J0IHsgbWVudUluaXQgfSBmcm9tICcuL2FwcC1tZW51JztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpIHtcclxuICBjb25zdCBicm93c2VyV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xyXG4gICAgbWluSGVpZ2h0OiAxODAsXHJcbiAgICBtaW5XaWR0aDogMzIwLFxyXG4gICAgd2lkdGg6IDE1MDAsXHJcbiAgICBoZWlnaHQ6IDgwMCxcclxuICAgIHNob3c6IGZhbHNlLCAvLyDkvb/nlKjkuovku7YgcmVhZHktdG8tc2hvdyDmnaXlsZXnpLrnqpflj6NcclxuICAgIC8vIHdlYua4suafk+i/m+eoi+iuvue9rlxyXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcclxuICAgICAgbm9kZUludGVncmF0aW9uOiBmYWxzZSwgLy/pu5jorqTkuI3lvIDlkK9ub2Rl6ZuG5oiQ77yM5Li65LqG5a6J5YWo8J+YilxyXG4gICAgICBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLCAvL+m7mOiupOW8gOWQr+S4iuS4i+aWh+malOemu++8jOS4uuS6huWuieWFqPCfmIpcclxuICAgICAgd2ViU2VjdXJpdHk6IHRydWUsIC8vIOWFs+mXrei3qOWfn+mZkOWItu+8jOS4uuS6huWuieWFqPCfmIpcclxuICAgICAgd2Vidmlld1RhZzogZmFsc2UsIC8vIOS4jeefpemBk+aYr+WVpe+8jOWFs+WwseWujOS6i+S6hu+8jOS4uuS6huWuieWFqPCfmIpcclxuICAgICAgcHJlbG9hZDogam9pbihfX2Rpcm5hbWUsICcuLi8uLi9wcmVsb2FkL2Rpc3QvaW5kZXguY2pzJyksXHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgLyoqXHJcbiAgICogSWYgeW91IGluc3RhbGwgYHNob3c6IHRydWVgIHRoZW4gaXQgY2FuIGNhdXNlIGlzc3VlcyB3aGVuIHRyeWluZyB0byBjbG9zZSB0aGUgd2luZG93LlxyXG4gICAqIFVzZSBgc2hvdzogZmFsc2VgIGFuZCBsaXN0ZW5lciBldmVudHMgYHJlYWR5LXRvLXNob3dgIHRvIGZpeCB0aGVzZSBpc3N1ZXMuXHJcbiAgICpcclxuICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi9lbGVjdHJvbi9pc3N1ZXMvMjUwMTJcclxuICAgKi9cclxuXHJcbiAgYnJvd3NlcldpbmRvdy5vbigncmVhZHktdG8tc2hvdycsICgpID0+IHtcclxuICAgIG1lbnVJbml0KGJyb3dzZXJXaW5kb3cpO1xyXG4gICAgYnJvd3NlcldpbmRvdz8uc2hvdygpO1xyXG4gICAgLy8g5aaC5p6c5pivZGV2546v5aKD77yM6aG65bim5omT5byAZGV2dG9vbHNcclxuICAgIGlmIChpbXBvcnQubWV0YS5lbnYuREVWKSB7XHJcbiAgICAgIGJyb3dzZXJXaW5kb3c/LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvKipcclxuICAgKiBVUkwgZm9yIG1haW4gd2luZG93LlxyXG4gICAqIFZpdGUgZGV2IHNlcnZlciBmb3IgZGV2ZWxvcG1lbnQuXHJcbiAgICogYGZpbGU6Ly8uLi9yZW5kZXJlci9pbmRleC5odG1sYCBmb3IgcHJvZHVjdGlvbiBhbmQgdGVzdFxyXG4gICAqL1xyXG4gIGNvbnN0IHBhZ2VVcmwgPVxyXG4gICAgaW1wb3J0Lm1ldGEuZW52LkRFViAmJiBpbXBvcnQubWV0YS5lbnYuVklURV9ERVZfU0VSVkVSX1VSTCAhPT0gdW5kZWZpbmVkID8gaW1wb3J0Lm1ldGEuZW52LlZJVEVfREVWX1NFUlZFUl9VUkwgOiBuZXcgVVJMKCcuLi9yZW5kZXJlci9kaXN0L2luZGV4Lmh0bWwnLCAnZmlsZTovLycgKyBfX2Rpcm5hbWUpLnRvU3RyaW5nKCk7XHJcblxyXG4gIGF3YWl0IGJyb3dzZXJXaW5kb3cubG9hZFVSTChwYWdlVXJsKTtcclxuXHJcbiAgcmV0dXJuIGJyb3dzZXJXaW5kb3c7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXN0b3JlIGV4aXN0aW5nIEJyb3dzZXJXaW5kb3cgb3IgQ3JlYXRlIG5ldyBCcm93c2VyV2luZG93XHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzdG9yZU9yQ3JlYXRlV2luZG93KCkge1xyXG4gIGxldCB3aW5kb3cgPSBCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKS5maW5kKCh3KSA9PiAhdy5pc0Rlc3Ryb3llZCgpKTtcclxuXHJcbiAgaWYgKHdpbmRvdyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB3aW5kb3cgPSBhd2FpdCBjcmVhdGVXaW5kb3coKTtcclxuICB9XHJcblxyXG4gIGlmICh3aW5kb3cuaXNNaW5pbWl6ZWQoKSkge1xyXG4gICAgd2luZG93LnJlc3RvcmUoKTtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5mb2N1cygpO1xyXG59XHJcbiIsIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMi0wNy0yMyAxMzo0MDozMVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA4LTA1IDExOjA2OjE4XHJcbiAqIEBEZXNjcmlwdGlvbjogZWxlY3Ryb27nmoTlupTnlKjlkK/liqhcclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxtYWluXFxzcmNcXGluZGV4LnRzXHJcbiAqL1xyXG5pbXBvcnQgeyBhcHAsIEJyb3dzZXJXaW5kb3csIHByb3RvY29sIH0gZnJvbSAnZWxlY3Ryb24nO1xyXG5pbXBvcnQgeyBub3JtYWxpemUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgaXBjTWFpbkNvbGxlY3Rpb24gfSBmcm9tICcuL2lwYy1tZXNzYWdlJztcclxuaW1wb3J0IHsgcmVzdG9yZU9yQ3JlYXRlV2luZG93IH0gZnJvbSAnLi9tYWluV2luZG93JztcclxuXHJcbi8qKlxyXG4gKiDlj6rmi6XmnInkuIDkuKrlrp7kvovvvIzpmLLmraLmnInlpJrkuKrlrp7kvotcclxuICovXHJcbmNvbnN0IGlzU2luZ2xlSW5zdGFuY2UgPSBhcHAucmVxdWVzdFNpbmdsZUluc3RhbmNlTG9jaygpO1xyXG5pZiAoIWlzU2luZ2xlSW5zdGFuY2UpIHtcclxuICBhcHAucXVpdCgpO1xyXG4gIHByb2Nlc3MuZXhpdCgwKTtcclxufVxyXG5hcHAub24oJ3NlY29uZC1pbnN0YW5jZScsIHJlc3RvcmVPckNyZWF0ZVdpbmRvdyk7XHJcbi8qKlxyXG4gKiDlhbPpl63noazku7bliqDpgJ/vvIzov5nkuKrmnInlvoXllYbmprfvvIzpmaTpnZ7mnInlhbzlrrnmgKfpl67pophcclxuICovXHJcbi8vIGFwcC5kaXNhYmxlSGFyZHdhcmVBY2NlbGVyYXRpb24oKTtcclxuXHJcbi8qKlxyXG4gKiDlhbPpl63nqpflj6PvvIzmiYDmnInov5vnqIvpg73pgIDlh7pcclxuICovXHJcbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XHJcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XHJcbiAgICBhcHAucXVpdCgpO1xyXG4gIH1cclxufSk7XHJcblxyXG4vKipcclxuICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL3YxNC14LXkvYXBpL2FwcCNldmVudC1hY3RpdmF0ZS1tYWNvcyBFdmVudDogJ2FjdGl2YXRlJ1xyXG4gKi9cclxuYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcclxuICBpZiAoQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkubGVuZ3RoID09PSAwKSByZXN0b3JlT3JDcmVhdGVXaW5kb3coKTtcclxufSk7XHJcblxyXG4vKipcclxuICog5Yib5bu65bqU55So56qX5Y+j5b2T5ZCO5Y+w6L+b56iL5bey57uP5YeG5aSH5aW9XHJcbiAqL1xyXG5hcHBcclxuICAud2hlblJlYWR5KClcclxuICAudGhlbigoKSA9PiB7XHJcbiAgICByZXN0b3JlT3JDcmVhdGVXaW5kb3coKTtcclxuICAgIGlwY01haW5Db2xsZWN0aW9uO1xyXG4gICAgcHJvdG9jb2wucmVnaXN0ZXJGaWxlUHJvdG9jb2woJ2F0b20nLCAocmVxdWVzdCwgY2FsbGJhY2spID0+IHtcclxuICAgICAgY29uc3QgdXJsID0gcmVxdWVzdC51cmwucmVwbGFjZSgvXmF0b206XFwvXFwvLywgJycpO1xyXG4gICAgICBjb25zdCBkZWNvZGVkVXJsID0gZGVjb2RlVVJJKHVybCk7IC8vIE5lZWRlZCBpbiBjYXNlIFVSTCBjb250YWlucyBzcGFjZXNcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gY2FsbGJhY2soeyBwYXRoOiBub3JtYWxpemUoZGVjb2RlZFVybCkgfSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRVJST1I6IHJlZ2lzdGVyTG9jYWxSZXNvdXJjZVByb3RvY29sOiBDb3VsZCBub3QgZ2V0IGZpbGUgcGF0aDonLCBlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmNhdGNoKChlKSA9PiBjb25zb2xlLmVycm9yKCdGYWlsZWQgY3JlYXRlIHdpbmRvdzonLCBlKSk7XHJcbiJdLCJuYW1lcyI6WyJpcGNNYWluIiwicGF0aCIsImFwcCIsIlN0b3JlIiwiYXV0b1VwZGF0ZXIiLCJkaWFsb2ciLCJsYW5ndWFnZS56aCIsImxhbmd1YWdlLmVuIiwibGFuZyIsInNoZWxsIiwiTWVudSIsIkJyb3dzZXJXaW5kb3ciLCJqb2luIiwicHJvdG9jb2wiLCJub3JtYWxpemUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQTJCQUEsU0FBQSxRQUFRLEdBQUcsV0FBVyxTQUFVLE9BQU8sS0FBSztBQUUxQyxRQUFNLGNBQWNDLHNCQUFLLFFBQVFDLFNBQUFBLElBQUksUUFBUSxLQUFLLENBQUM7QUFDckQsQ0FBQztBQUVERixTQUFBLFFBQVEsR0FBRyxxQkFBcUIsU0FBVSxPQUFPLEtBQUs7QUFFcEQsVUFBUSxJQUFJLEdBQUc7QUFDVCxRQUFBLGNBQWNFLFNBQUFBLElBQUksa0JBQWtCLEdBQUc7QUFDL0MsQ0FBQztBQUdERixTQUFBLFFBQVEsR0FBRyxXQUFXLFNBQVUsT0FBTyxLQUFLO0FBRXBDLFFBQUEsY0FBY0UsYUFBSTtBQUMxQixDQUFDO0FBRURGLFNBQUEsUUFBUSxHQUFHLFlBQVksU0FBVSxPQUFPLEtBQUs7QUFFM0MsUUFBTSxjQUFjLFFBQVE7QUFDOUIsQ0FBQztBQUVEQSxTQUFBLFFBQVEsR0FBRyxRQUFRLFNBQVUsT0FBTyxLQUFLO0FBRXZDLFFBQU0sY0FBYyxRQUFRO0FBQzlCLENBQUM7QUFFREEsU0FBQSxRQUFRLEdBQUcsWUFBWSxTQUFVLE9BQU8sS0FBSztBQUkzQyxRQUFNLGNBQWM7QUFDdEIsQ0FBQztBQUdEQSxTQUFBLFFBQVEsR0FBRyxpQkFBaUIsU0FBVSxPQUFPLEtBQUs7QUFDMUMsUUFBQSxNQUFNLGlCQUFpQixHQUFHO0FBQ2xDLENBQUM7QUFPREEsU0FBQSxRQUFRLEdBQUcsZUFBZSxTQUFVLE9BQU8sS0FBSztBQUN4QyxRQUFBLE1BQU0sZUFBZSxHQUFHO0FBQ2hDLENBQUM7QUFFREEsU0FBQSxRQUFRLEdBQUcsZUFBZSxDQUFDLE9BQU8sYUFBYTtBQUM3QyxRQUFNLE9BQU8sVUFBVTtBQUFBLElBQ3JCLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUFBLENBQ1A7QUFDSCxDQUFDO0FDdEVNLE1BQU0sS0FBSztBQUFBLEVBQ2hCLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLFlBQVk7QUFBQSxFQUNaLGFBQWE7QUFBQSxFQUNiLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLFVBQVU7QUFBQSxFQUNWLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLEtBQUs7QUFBQSxFQUNMLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxFQUNSLFVBQVU7QUFBQSxFQUNWLFVBQVU7QUFBQSxFQUNWLFlBQVk7QUFBQSxFQUNaLGtCQUFrQjtBQUFBLEVBQ2xCLGdCQUFnQjtBQUFBLEVBQ2hCLFFBQVE7QUFBQSxFQUNSLFVBQVU7QUFBQSxFQUNWLE9BQU87QUFBQSxFQUNQLE1BQU07QUFBQSxFQUNOLFdBQVc7QUFBQSxFQUNYLGFBQWE7QUFBQSxFQUNiLGlCQUFpQjtBQUFBLEVBQ2pCLGdCQUFnQjtBQUFBLEVBQ2hCLFdBQVc7QUFBQSxFQUNYLE9BQU87QUFBQSxFQUNQLFVBQVU7QUFBQSxFQUNWLE1BQU07QUFBQSxFQUNOLFlBQVk7QUFBQSxFQUNaLFNBQVM7QUFBQSxFQUNULE1BQU07QUFBQSxFQUNOLGlCQUFpQjtBQUFBLEVBQ2pCLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE1BQU07QUFDUjtBQUVPLE1BQU0sS0FBSztBQUFBLEVBQ2hCLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLFlBQVk7QUFBQSxFQUNaLGFBQWE7QUFBQSxFQUNiLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLFVBQVU7QUFBQSxFQUNWLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLEtBQUs7QUFBQSxFQUNMLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxFQUNSLFVBQVU7QUFBQSxFQUNWLFVBQVU7QUFBQSxFQUNWLFlBQVk7QUFBQSxFQUNaLGtCQUFrQjtBQUFB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
