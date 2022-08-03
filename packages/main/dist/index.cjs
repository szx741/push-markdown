"use strict";
const electron = require("electron");
const path = require("path");
require("url");
const Store = require("electron-store");
const _interopDefaultLegacy = (e) => e && typeof e === "object" && "default" in e ? e : { default: e };
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
const path__namespace = /* @__PURE__ */ _interopNamespace(path);
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
const store = new Store__default.default({ name: "settings" });
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
            electron.shell.openExternal("https://gitee.com/xaotuman/push-markdown");
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
      windowMenu.submenu.push({
        type: "separator"
      }, {
        label: l.bringAllToFront,
        role: "front"
      });
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
      return callback({ path: path__namespace.normalize(decodedUrl) });
    } catch (error) {
      console.error("ERROR: registerLocalResourceProtocol: Could not get file path:", error);
    }
  });
}).catch((e) => console.error("Failed create window:", e));
{
  electron.app.whenReady().then(() => Promise.resolve().then(() => /* @__PURE__ */ _interopNamespace(require("electron-devtools-installer")))).then(({ default: installExtension, VUEJS3_DEVTOOLS }) => installExtension(VUEJS3_DEVTOOLS, {
    loadExtensionOptions: {
      allowFileAccess: true
    }
  })).catch((e) => console.error("Failed install extension:", e));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6WyIuLi9zcmMvaXBjLW1lc3NhZ2UudHMiLCIuLi9zcmMvYXBwLW1lbnUvbWVudS1sYW5nLnRzIiwiLi4vc3JjL2FwcC1tZW51L3N0b3JlLnRzIiwiLi4vc3JjL2FwcC1tZW51L2luZGV4LnRzIiwiLi4vc3JjL21haW5XaW5kb3cudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQEF1dGhvcjogc3p4XHJcbiAqIEBEYXRlOiAyMDIxLTA3LTA1IDIwOjU3OjEwXHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDgtMDIgMjA6MTk6MzlcclxuICogQERlc2NyaXB0aW9uOlxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcaXBjLW1lc3NhZ2UudHNcclxuICovXHJcblxyXG5pbXBvcnQgeyBhcHAsIGlwY01haW4gfSBmcm9tICdlbGVjdHJvbic7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuLypcclxuICAvLyDlrp7pqozmgKfotKhcclxuICBpcGNNYWluLm9uKCd0b01haW4nLCAoZXZlbnQsIGFyZ3MpID0+IHtcclxuICAgIC8vIGV2ZW50LnJlcGx5KCdmcm9tTWFpbicsICflkI7mkqTmraU4ODgnKTtcclxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZnJvbU1haW4nLCAn5ZCO5pKk5q2lNzc3Jyk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIOeEtuWQjuWcqOa4suafk+i/m+eoi+S4reS9v+eUqOS4i+mdoueahOi/meauteivreWPpVxyXG4gIC8vIOS7juS4u+i/m+eoi+mAmumBk0Zyb21NYWlu5o6l5Y+X5L+h5oGvXHJcbiAgaXBjLnJlY2VpdmUoJ2Zyb21NYWluJywgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coYFJlY2VpdmVkICR7ZGF0YX0gZnJvbSBtYWluIHByb2Nlc3NgKTtcclxuICB9KTtcclxuICAvLyDlj5HpgIHkv6Hmga/nu5nkuLvov5vnqIvpgJrpgZN0b01haW5cclxuICBpcGMuc2VuZCgndG9NYWluJywgJ3NvbWUgZGF0YScpO1xyXG4qL1xyXG4vLyDojrflvpflvZPliY3lronoo4XljIXot6/lvoRcclxuaXBjTWFpbi5vbignZXhlUGF0aCcsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgLy8gZXZlbnQucmVwbHkoJ2V4ZVBhdGgnLCBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKTtcclxufSk7XHJcblxyXG5pcGNNYWluLm9uKCdhZGRSZWNlbnREb2N1bWVudCcsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgLy8gZXZlbnQucmVwbHkoJ2V4ZVBhdGgnLCBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKSk7XHJcbiAgY29uc29sZS5sb2coYXJnKTtcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IGFwcC5hZGRSZWNlbnREb2N1bWVudChhcmcpO1xyXG59KTtcclxuXHJcbi8vIOiOt+W+l+W9k+WJjeeJiOacrOWPt1xyXG5pcGNNYWluLm9uKCd2ZXJzaW9uJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyAgIGV2ZW50LnJlcGx5KCd2ZXJzaW9uJywgYXBwLmdldFZlcnNpb24oKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBhcHAuZ2V0VmVyc2lvbigpO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ3BsYXRmb3JtJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyAgIGV2ZW50LnJlcGx5KCd2ZXJzaW9uJywgYXBwLmdldFZlcnNpb24oKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBwcm9jZXNzLnBsYXRmb3JtO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ2FyZ3YnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIC8vICAgZXZlbnQucmVwbHkoJ3ZlcnNpb24nLCBhcHAuZ2V0VmVyc2lvbigpKTtcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IHByb2Nlc3MuYXJndjtcclxufSk7XHJcblxyXG5pcGNNYWluLm9uKCdfX3N0YXRpYycsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgLy8gZXZlbnQucmVwbHkoJ2V4ZVBhdGgnLCBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKSk7XHJcbiAgLy8gZXZlbnQucmV0dXJuVmFsdWUgPSBfX3N0YXRpYztcclxuICAvLyBldmVudC5yZXR1cm5WYWx1ZSA9ICcuLyc7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBfX2Rpcm5hbWU7XHJcbn0pO1xyXG5cclxuLy8g5Lit6L2s5raI5oGv77yM5riy5p+T6L+b56iL5Y+R57uZ5Li76L+b56iL77yM5Li76L+b56iL5YaN5Y+R57uZ5riy5p+T6L+b56iLXHJcbmlwY01haW4ub24oJ21lbnUuc2V0dGluZ3MnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIGV2ZW50LnJlcGx5KCdtZW51LnNldHRpbmdzJywgYXJnKTtcclxufSk7XHJcblxyXG4vLyBpcGNNYWluLm9uKCdtZW51LnNob3dmaWxlJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuLy8gICBldmVudC5yZXBseSgnbWVudS5zaG93ZmlsZScsIGFyZyk7XHJcbi8vIH0pO1xyXG5cclxuLy8g5Lit6L2s5raI5oGv77yM5riy5p+T6L+b56iL5Y+R57uZ5Li76L+b56iL77yM5Li76L+b56iL5YaN5Y+R57uZ5riy5p+T6L+b56iLXHJcbmlwY01haW4ub24oJ21lbnUuc2FtcGxlJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICBldmVudC5yZXBseSgnbWVudS5zYW1wbGUnLCBhcmcpO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ29uZHJhZ3N0YXJ0JywgKGV2ZW50LCBmaWxlUGF0aCkgPT4ge1xyXG4gIGV2ZW50LnNlbmRlci5zdGFydERyYWcoe1xyXG4gICAgZmlsZTogZmlsZVBhdGgsXHJcbiAgICBpY29uOiAnL3BhdGgvdG8vaWNvbi5wbmcnXHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IHsgaXBjTWFpbiBhcyBpcGNNYWluQ29sbGVjdGlvbiB9O1xyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjEtMDctMDQgMTk6MDA6NThcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wNy0zMSAxMzo1MDo1NVxyXG4gKiBARGVzY3JpcHRpb246IOeql+WPo+eahOWkmuivreiogOaUr+aMgVxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcYXBwLW1lbnVcXG1lbnUtbGFuZy50c1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjb25zdCBlbiA9IHtcclxuICBmaWxlOiAnRmlsZScsXHJcbiAgb3BlbjogJ09wZW4nLFxyXG4gIG9wZW5SZWNlbnQ6ICdPcGVuIFJlY2VudCcsXHJcbiAgY2xlYXJSZWNlbnQ6ICdDbGVhcicsXHJcbiAgc2F2ZTogJ1NhdmUnLFxyXG4gIHB1Ymxpc2g6ICdQdWJsaXNoJyxcclxuICBsYW5ndWFnZTogJ0xhbmd1YWdlJyxcclxuICBzZXR0aW5nczogJ1NldHRpbmdzJyxcclxuICBlZGl0OiAnRWRpdCcsXHJcbiAgdW5kbzogJ1VuZG8nLFxyXG4gIHJlZG86ICdSZWRvJyxcclxuICBjdXQ6ICdDdXQnLFxyXG4gIGNvcHk6ICdDb3B5JyxcclxuICBwYXN0ZTogJ1Bhc3RlJyxcclxuICBzZWxlY3RBbGw6ICdTZWxlY3QgQWxsJyxcclxuICByZWxvYWQ6ICdSZWxvYWQnLFxyXG4gIGZpbGVUcmVlOiAnRmlsZSB0cmVlJyxcclxuICBjbG9zZVRhYjogJ0Nsb3NlIEN1cnJlbnQgRmlsZScsXHJcbiAgcmVsb2FkRmlsZTogJ1JlbG9hZCBGaWxlJyxcclxuICB0b2dnbGVGdWxsU2NyZWVuOiAnVG9nZ2xlIEZ1bGwgU2NyZWVuJyxcclxuICB0b2dnbGVEZXZUb29sczogJ1RvZ2dsZSBEZXZlbG9wZXIgVG9vbHMnLFxyXG4gIHdpbmRvdzogJ1dpbmRvdycsXHJcbiAgbWluaW1pemU6ICdNaW5pbWl6ZScsXHJcbiAgY2xvc2U6ICdDbG9zZScsXHJcbiAgaGVscDogJ0hlbHAnLFxyXG4gIGxlYXJuTW9yZTogJ0xlYXJuIE1vcmUnLFxyXG4gIG9wZW5XZWxjb21lUGFnZTogJ09wZW4gV2VsY29tZSBQYWdlJyxcclxuICB2aWV3U2FtcGxlRmlsZTogJ1ZpZXcgU2FtcGxlIEZpbGUnLFxyXG4gIHR1dG9yaWFsczogJ1R1dG9yaWFscycsXHJcbiAgYWJvdXQ6ICdBYm91dCAnLFxyXG4gIHNlcnZpY2VzOiAnU2VydmljZXMnLFxyXG4gIGhpZGU6ICdIaWRlICcsXHJcbiAgaGlkZU90aGVyczogJ0hpZGUgT3RoZXJzJyxcclxuICBzaG93QWxsOiAnU2hvdyBBbGwnLFxyXG4gIHF1aXQ6ICdRdWl0JyxcclxuICBicmluZ0FsbFRvRnJvbnQ6ICdCcmluZyBBbGwgdG8gRnJvbnQnLFxyXG4gIHRoZW1lOiAnVGhlbWUnLFxyXG4gIGxpZ2h0OiAnTGlnaHQnLFxyXG4gIGRhcms6ICdEYXJrJ1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHpoID0ge1xyXG4gIGZpbGU6ICfmlofku7YnLFxyXG4gIG9wZW46ICfmiZPlvIAnLFxyXG4gIG9wZW5SZWNlbnQ6ICfmiZPlvIDmnIDov5Hkvb/nlKjnmoQnLFxyXG4gIGNsZWFyUmVjZW50OiAn5riF6ZmkJyxcclxuICBzYXZlOiAn5L+d5a2YJyxcclxuICBwdWJsaXNoOiAn5Y+R5biDJyxcclxuICBsYW5ndWFnZTogJ+ivreiogCcsXHJcbiAgc2V0dGluZ3M6ICforr7nva4nLFxyXG4gIGVkaXQ6ICfnvJbovpEnLFxyXG4gIHVuZG86ICfmkqTplIAnLFxyXG4gIHJlZG86ICfph43lgZonLFxyXG4gIGN1dDogJ+WJquWIhycsXHJcbiAgY29weTogJ+WkjeWIticsXHJcbiAgcGFzdGU6ICfnspjotLQnLFxyXG4gIHNlbGVjdEFsbDogJ+WFqOmAiScsXHJcbiAgcmVsb2FkOiAn6YeN5paw5Yqg6L29JyxcclxuICBmaWxlVHJlZTogJ+aWh+S7tuWIl+ihqCcsXHJcbiAgY2xvc2VUYWI6ICflhbPpl63lvZPliY3mlofku7YnLFxyXG4gIHJlbG9hZEZpbGU6ICfph43mlrDovb3lhaXmlofku7YnLFxyXG4gIHRvZ2dsZUZ1bGxTY3JlZW46ICfliIfmjaLlhajlsY8nLFxyXG4gIHRvZ2dsZURldlRvb2xzOiAn5YiH5o2i5byA5Y+R6ICF5bel5YW3JyxcclxuICB3aW5kb3c6ICfnqpflj6MnLFxyXG4gIG1pbmltaXplOiAn5pyA5bCP5YyWJyxcclxuICBjbG9zZTogJ+WFs+mXrScsXHJcbiAgaGVscDogJ+W4ruWKqScsXHJcbiAgbGVhcm5Nb3JlOiAn5LqG6Kej5pu05aSaJyxcclxuICBvcGVuV2VsY29tZVBhZ2U6ICfmiZPlvIDmrKLov47pobUnLFxyXG4gIHZpZXdTYW1wbGVGaWxlOiAn5p+l55yL56S65L6L5paH5qGjJyxcclxuICB0dXRvcmlhbHM6ICfkvb/nlKjmlZnnqIsnLFxyXG4gIGFib3V0OiAn5YWz5LqOJyxcclxuICBzZXJ2aWNlczogJ+acjeWKoScsXHJcbiAgaGlkZTogJ+makOiXjycsXHJcbiAgaGlkZU90aGVyczogJ+makOiXj+WFtuS7licsXHJcbiAgc2hvd0FsbDogJ+aYvuekuuWFqOmDqCcsXHJcbiAgcXVpdDogJ+mAgOWHuicsXHJcbiAgYnJpbmdBbGxUb0Zyb250OiAn5YmN572u5YWo6YOo56qX5Y+jJyxcclxuICB0aGVtZTogJ+S4u+mimCcsXHJcbiAgbGlnaHQ6ICfmtYXoibInLFxyXG4gIGRhcms6ICfmt7HoibInXHJcbn07XHJcbiIsIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMS0wNy0wNCAxODo0Nzo0NFxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA3LTMxIDE1OjM1OjMxXHJcbiAqIEBEZXNjcmlwdGlvbjogZWxlY3Ryb24tc290cmXlrZjlgqjor63oqIDlgLxcclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxtYWluXFxzcmNcXGFwcC1tZW51XFxzdG9yZS50c1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBTdG9yZSBmcm9tICdlbGVjdHJvbi1zdG9yZSc7XHJcblxyXG4vLyDlrZjlgqjnmoTmlofku7blkI3kuLpzZXR0aW5nc1xyXG5jb25zdCBzdG9yZSA9IG5ldyBTdG9yZSh7IG5hbWU6ICdzZXR0aW5ncycgfSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGFuZygpIHtcclxuICByZXR1cm4gc3RvcmUuZ2V0KCdsYW5ndWFnZScsICd6aCcpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0TGFuZyhsYW5nOiBzdHJpbmcpIHtcclxuICByZXR1cm4gc3RvcmUuc2V0KCdsYW5ndWFnZScsIGxhbmcpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUaGVtZSgpIHtcclxuICByZXR1cm4gc3RvcmUuZ2V0KCd0aGVtZScsIHRydWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VGhlbWUodGhlbWU6IGJvb2xlYW4pIHtcclxuICByZXR1cm4gc3RvcmUuc2V0KCd0aGVtZScsIHRoZW1lKTtcclxufVxyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjItMDctMjMgMTk6NTc6MzFcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wOC0wMSAxNToxMjozMFxyXG4gKiBARGVzY3JpcHRpb246XHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxhcHAtbWVudVxcaW5kZXgudHNcclxuICovXHJcbi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMS0wNy0wNCAxODo0MjoxNVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA3LTIzIDE5OjU2OjMyXHJcbiAqIEBEZXNjcmlwdGlvbjog6I+c5Y2V5qCP6K6+572uXHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxhcHAtbWVudS50c1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vZGlhbG9n5qih5Z2X5o+Q5L6b5LqGYXBp5p2l5bGV56S65Y6f55Sf55qE57O757uf5a+56K+d5qGG77yM5L6L5aaC5omT5byA5paH5Lu25qGG77yMYWxlcnTmoYZcclxuaW1wb3J0IHsgTWVudSwgYXBwLCBkaWFsb2csIHNoZWxsLCBCcm93c2VyV2luZG93IH0gZnJvbSAnZWxlY3Ryb24nO1xyXG5cclxuaW1wb3J0ICogYXMgbGFuZ3VhZ2UgZnJvbSAnLi9tZW51LWxhbmcnO1xyXG5pbXBvcnQgeyBzZXRMYW5nLCBzZXRUaGVtZSwgZ2V0TGFuZywgZ2V0VGhlbWUgfSBmcm9tICcuL3N0b3JlJztcclxuXHJcbi8vIOWKoOi9veiPnOWNleagj1xyXG5leHBvcnQgZnVuY3Rpb24gbWVudUluaXQobWFpbldpbmRvdzogQnJvd3NlcldpbmRvdykge1xyXG4gIC8vIHdlYkNvbnRlbnRz5a6D6LSf6LSj5riy5p+T5bm25o6n5Yi2572R6aG1XHJcbiAgY29uc3Qgd2ViQ29udGVudHMgPSBtYWluV2luZG93LndlYkNvbnRlbnRzLFxyXG4gICAgbGFuZyA9IGdldExhbmcoKSwgLy8g5b2T5YmN55qE6K+t6KiAXHJcbiAgICB0aGVtZSA9IGdldFRoZW1lKCksIC8v5b2T5YmN55qE5Li76aKYXHJcbiAgICBsID0gbGFuZyA9PT0gJ3poJyA/IGxhbmd1YWdlLnpoIDogbGFuZ3VhZ2UuZW47XHJcbiAgLy8g6K6+572u6K+t6KiAXHJcbiAgZnVuY3Rpb24gc2V0TGFuZ3VhZ2UobGFuZzogc3RyaW5nKSB7XHJcbiAgICBzZXRMYW5nKGxhbmcpO1xyXG4gICAgLy8g6YCa6L+HIGNoYW5uZWwg5Y+R6YCB5byC5q2l5raI5oGv57uZ5riy5p+T6L+b56iLXHJcbiAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51Lmxhbmd1YWdlJywgbGFuZyk7XHJcbiAgICAvLyDph43mlrDmuLLmn5Poj5zljZXmoI9cclxuICAgIG1lbnVJbml0KG1haW5XaW5kb3cpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0VGhlbWVDb25mKG5ld1RoZW1lOiBib29sZWFuKSB7XHJcbiAgICBzZXRUaGVtZShuZXdUaGVtZSk7XHJcbiAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnRoZW1lJywgbmV3VGhlbWUpO1xyXG4gIH1cclxuICAvLyDoj5zljZXmoI/mqKHmnb9cclxuICBjb25zdCB0ZW1wbGF0ZTogYW55W10gPSBbXHJcbiAgICB7XHJcbiAgICAgIGxhYmVsOiBsLmZpbGUsXHJcbiAgICAgIC8v5paH5Lu25LiL5ouJ5bGe5oCnXHJcbiAgICAgIHN1Ym1lbnU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5vcGVuLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrTycsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkaWFsb2dcclxuICAgICAgICAgICAgICAuc2hvd09wZW5EaWFsb2cobWFpbldpbmRvdywgeyBwcm9wZXJ0aWVzOiBbJ29wZW5GaWxlJ10sIGZpbHRlcnM6IFt7IG5hbWU6ICdNYXJrZG93bicsIGV4dGVuc2lvbnM6IFsnbWQnXSB9XSB9KVxyXG4gICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQuY2FuY2VsZWQgJiYgcmVzdWx0LmZpbGVQYXRocy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUub3BlbicsIHJlc3VsdC5maWxlUGF0aHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAvLyDliIbpmpTmqKrnur9cclxuICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5zYXZlLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUycsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnNhdmUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnB1Ymxpc2gsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtQJyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUucHVibGlzaCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnNldHRpbmdzLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5zZXR0aW5ncycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwubGFuZ3VhZ2UsXHJcbiAgICAgICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBsYWJlbDogJ+eugOS9k+S4reaWhycsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3JhZGlvJyxcclxuICAgICAgICAgICAgICBjaGVja2VkOiBsYW5nID09PSAnemgnLFxyXG4gICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRMYW5ndWFnZSgnemgnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBsYWJlbDogJ0VuZ2xpc2gnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdyYWRpbycsXHJcbiAgICAgICAgICAgICAgY2hlY2tlZDogbGFuZyA9PT0gJ2VuJyxcclxuICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0TGFuZ3VhZ2UoJ2VuJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgLy/nrKzkuozkuKroj5zljZVcclxuICAgIHtcclxuICAgICAgbGFiZWw6IGwuZWRpdCxcclxuICAgICAgc3VibWVudTogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnVuZG8sXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtaJyxcclxuICAgICAgICAgIHJvbGU6ICd1bmRvJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwucmVkbyxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnU2hpZnQrQ21kT3JDdHJsK1onLFxyXG4gICAgICAgICAgcm9sZTogJ3JlZG8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuY3V0LFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrWCcsXHJcbiAgICAgICAgICByb2xlOiAnY3V0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuY29weSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK0MnLFxyXG4gICAgICAgICAgcm9sZTogJ2NvcHknXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5wYXN0ZSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1YnLFxyXG4gICAgICAgICAgcm9sZTogJ3Bhc3RlJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuc2VsZWN0QWxsLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrQScsXHJcbiAgICAgICAgICByb2xlOiAnc2VsZWN0YWxsJ1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIC8vIOeql+WPo+iPnOWNlVxyXG4gICAge1xyXG4gICAgICBsYWJlbDogbC53aW5kb3csXHJcbiAgICAgIHJvbGU6ICd3aW5kb3cnLFxyXG4gICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuZmlsZVRyZWUsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdDdHJsK1NoaWZ0K0wnO1xyXG4gICAgICAgICAgfSkoKSxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUuc2hvd2ZpbGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnRvZ2dsZUZ1bGxTY3JlZW4sXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSByZXR1cm4gJ0N0cmwrQ29tbWFuZCtGJztcclxuICAgICAgICAgICAgZWxzZSByZXR1cm4gJ0YxMSc7XHJcbiAgICAgICAgICB9KSgpLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIChpdGVtOiBhbnksIGZvY3VzZWRXaW5kb3c6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoZm9jdXNlZFdpbmRvdykgZm9jdXNlZFdpbmRvdy5zZXRGdWxsU2NyZWVuKCFmb2N1c2VkV2luZG93LmlzRnVsbFNjcmVlbigpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLm1pbmltaXplLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrTScsXHJcbiAgICAgICAgICByb2xlOiAnbWluaW1pemUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5yZWxvYWRGaWxlLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdGNScsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnJlbG9hZGZpbGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmNsb3NlVGFiLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnQ3RybCtGNCc7XHJcbiAgICAgICAgICB9KSgpLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5jbG9zZXRhYicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnJlbG9hZCxcclxuICAgICAgICAgIC8vIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1InLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIChpdGVtOiBhbnksIGZvY3VzZWRXaW5kb3c6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoZm9jdXNlZFdpbmRvdykgZm9jdXNlZFdpbmRvdy5yZWxvYWQoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnRvZ2dsZURldlRvb2xzLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnQ3RybCtTaGlmdCtJJztcclxuICAgICAgICAgIH0pKCksXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKGl0ZW06IGFueSwgZm9jdXNlZFdpbmRvdzogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChmb2N1c2VkV2luZG93KSBmb2N1c2VkV2luZG93LnRvZ2dsZURldlRvb2xzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuY2xvc2UsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtXJyxcclxuICAgICAgICAgIHJvbGU6ICdjbG9zZSdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcblxyXG4gICAgLy8g5Li76aKY6I+c5Y2VXHJcbiAgICB7XHJcbiAgICAgIGxhYmVsOiBsLnRoZW1lLFxyXG4gICAgICByb2xlOiAndGhlbWUnLFxyXG4gICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwubGlnaHQsXHJcbiAgICAgICAgICB0eXBlOiAncmFkaW8nLFxyXG4gICAgICAgICAgY2hlY2tlZDogdGhlbWUsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZXRUaGVtZUNvbmYodHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5kYXJrLFxyXG4gICAgICAgICAgdHlwZTogJ3JhZGlvJyxcclxuICAgICAgICAgIGNoZWNrZWQ6ICF0aGVtZSxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNldFRoZW1lQ29uZihmYWxzZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIOW4ruWKqeiPnOWNlVxyXG4gICAge1xyXG4gICAgICBsYWJlbDogbC5oZWxwLFxyXG4gICAgICByb2xlOiAnaGVscCcsXHJcbiAgICAgIHN1Ym1lbnU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5vcGVuV2VsY29tZVBhZ2UsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LndlbGNvbWUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnZpZXdTYW1wbGVGaWxlLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5zYW1wbGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnR1dG9yaWFscyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIGFwcC5nZXRBcHBQYXRoKCk7XHJcbiAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9naXRlZS5jb20veGFvdHVtYW4vcHVzaC1tYXJrZG93bi9ibG9iL21hc3Rlci9kb2NzLyVFNCVCRCVCRiVFNyU5NCVBOCVFNiU5NSU5OSVFNyVBOCU4Qi5tZCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwubGVhcm5Nb3JlLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLmdldEFwcFBhdGgoKTtcclxuICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2dpdGVlLmNvbS94YW90dW1hbi9wdXNoLW1hcmtkb3duJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgXTtcclxuXHJcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XHJcbiAgICBjb25zdCBuYW1lOiBzdHJpbmcgPSBhcHAuZ2V0TmFtZSgpO1xyXG4gICAgdGVtcGxhdGUudW5zaGlmdCh7XHJcbiAgICAgIGxhYmVsOiBuYW1lLFxyXG4gICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuYWJvdXQgKyBuYW1lLFxyXG4gICAgICAgICAgcm9sZTogJ2Fib3V0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnNlcnZpY2VzLFxyXG4gICAgICAgICAgcm9sZTogJ3NlcnZpY2VzJyxcclxuICAgICAgICAgIHN1Ym1lbnU6IFtdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuaGlkZSArIG5hbWUsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NvbW1hbmQrSCcsXHJcbiAgICAgICAgICByb2xlOiAnaGlkZSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmhpZGVPdGhlcnMsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NvbW1hbmQrU2hpZnQrSCcsXHJcbiAgICAgICAgICByb2xlOiAnaGlkZW90aGVycydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnNob3dBbGwsXHJcbiAgICAgICAgICByb2xlOiAndW5oaWRlJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnF1aXQsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NvbW1hbmQrUScsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhcHAucXVpdCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCB3aW5kb3dNZW51ID0gdGVtcGxhdGUuZmluZChmdW5jdGlvbiAobSkge1xyXG4gICAgICByZXR1cm4gbS5yb2xlID09PSAnd2luZG93JztcclxuICAgIH0pO1xyXG4gICAgaWYgKHdpbmRvd01lbnUpIHtcclxuICAgICAgd2luZG93TWVudS5zdWJtZW51LnB1c2goXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmJyaW5nQWxsVG9Gcm9udCxcclxuICAgICAgICAgIHJvbGU6ICdmcm9udCdcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBtZW51ID0gTWVudS5idWlsZEZyb21UZW1wbGF0ZSh0ZW1wbGF0ZSk7XHJcbiAgTWVudS5zZXRBcHBsaWNhdGlvbk1lbnUobWVudSk7XHJcbn1cclxuIiwiLypcclxuICogQEF1dGhvcjogc3p4XHJcbiAqIEBEYXRlOiAyMDIyLTA3LTIzIDEzOjQwOjMxXHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDgtMDMgMTk6NDk6NDFcclxuICogQERlc2NyaXB0aW9uOiDkuLvnqpflj6Porr7nva5cclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxtYWluXFxzcmNcXG1haW5XaW5kb3cudHNcclxuICovXHJcbmltcG9ydCB7IEJyb3dzZXJXaW5kb3cgfSBmcm9tICdlbGVjdHJvbic7XHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgVVJMIH0gZnJvbSAndXJsJztcclxuXHJcbmltcG9ydCB7IG1lbnVJbml0IH0gZnJvbSAnL0AvYXBwLW1lbnUnO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2luZG93KCkge1xyXG4gIGNvbnN0IGJyb3dzZXJXaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XHJcbiAgICBtaW5IZWlnaHQ6IDE4MCxcclxuICAgIG1pbldpZHRoOiAzMjAsXHJcbiAgICB3aWR0aDogMTUwMCxcclxuICAgIGhlaWdodDogODAwLFxyXG4gICAgc2hvdzogZmFsc2UsIC8vIOS9v+eUqOS6i+S7tiByZWFkeS10by1zaG93IOadpeWxleekuueql+WPo1xyXG4gICAgLy8gd2Vi5riy5p+T6L+b56iL6K6+572uXHJcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xyXG4gICAgICAvLyBub2RlSW50ZWdyYXRpb246IGZhbHNlLCAgLy/pu5jorqTkuI3lvIDlkK9ub2Rl6ZuG5oiQ77yM5Li65LqG5a6J5YWo8J+YilxyXG4gICAgICAvLyBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLCAvL+m7mOiupOW8gOWQr+S4iuS4i+aWh+malOemu++8jOS4uuS6huWuieWFqPCfmIpcclxuICAgICAgd2ViU2VjdXJpdHk6IHRydWUsIC8vIOWFs+mXrei3qOWfn+mZkOWItu+8jOS4uuS6huWuieWFqPCfmIpcclxuICAgICAgd2Vidmlld1RhZzogZmFsc2UsIC8vIOS4jeefpemBk+aYr+WVpe+8jOWFs+WwseWujOS6i+S6hu+8jOS4uuS6huWuieWFqPCfmIpcclxuICAgICAgcHJlbG9hZDogam9pbihfX2Rpcm5hbWUsICcuLi8uLi9wcmVsb2FkL2Rpc3QvaW5kZXguY2pzJylcclxuICAgIH1cclxuICB9KTtcclxuICAvKipcclxuICAgKiBJZiB5b3UgaW5zdGFsbCBgc2hvdzogdHJ1ZWAgdGhlbiBpdCBjYW4gY2F1c2UgaXNzdWVzIHdoZW4gdHJ5aW5nIHRvIGNsb3NlIHRoZSB3aW5kb3cuXHJcbiAgICogVXNlIGBzaG93OiBmYWxzZWAgYW5kIGxpc3RlbmVyIGV2ZW50cyBgcmVhZHktdG8tc2hvd2AgdG8gZml4IHRoZXNlIGlzc3Vlcy5cclxuICAgKlxyXG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy8yNTAxMlxyXG4gICAqL1xyXG5cclxuICBicm93c2VyV2luZG93Lm9uKCdyZWFkeS10by1zaG93JywgKCkgPT4ge1xyXG4gICAgbWVudUluaXQoYnJvd3NlcldpbmRvdyk7XHJcbiAgICBicm93c2VyV2luZG93Py5zaG93KCk7XHJcbiAgICAvLyDlpoLmnpzmmK9kZXbnjq/looPvvIzpobrluKbmiZPlvIBkZXZ0b29sc1xyXG4gICAgaWYgKGltcG9ydC5tZXRhLmVudi5ERVYpIHtcclxuICAgICAgYnJvd3NlcldpbmRvdz8ud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8qKlxyXG4gICAqIFVSTCBmb3IgbWFpbiB3aW5kb3cuXHJcbiAgICogVml0ZSBkZXYgc2VydmVyIGZvciBkZXZlbG9wbWVudC5cclxuICAgKiBgZmlsZTovLy4uL3JlbmRlcmVyL2luZGV4Lmh0bWxgIGZvciBwcm9kdWN0aW9uIGFuZCB0ZXN0XHJcbiAgICovXHJcbiAgY29uc3QgcGFnZVVybCA9XHJcbiAgICBpbXBvcnQubWV0YS5lbnYuREVWICYmIGltcG9ydC5tZXRhLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMICE9PSB1bmRlZmluZWQgPyBpbXBvcnQubWV0YS5lbnYuVklURV9ERVZfU0VSVkVSX1VSTCA6IG5ldyBVUkwoJy4uL3JlbmRlcmVyL2Rpc3QvaW5kZXguaHRtbCcsICdmaWxlOi8vJyArIF9fZGlybmFtZSkudG9TdHJpbmcoKTtcclxuXHJcbiAgYXdhaXQgYnJvd3NlcldpbmRvdy5sb2FkVVJMKHBhZ2VVcmwpO1xyXG5cclxuICByZXR1cm4gYnJvd3NlcldpbmRvdztcclxufVxyXG5cclxuLyoqXHJcbiAqIFJlc3RvcmUgZXhpc3RpbmcgQnJvd3NlcldpbmRvdyBvciBDcmVhdGUgbmV3IEJyb3dzZXJXaW5kb3dcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXN0b3JlT3JDcmVhdGVXaW5kb3coKSB7XHJcbiAgbGV0IHdpbmRvdyA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmZpbmQoKHcpID0+ICF3LmlzRGVzdHJveWVkKCkpO1xyXG5cclxuICBpZiAod2luZG93ID09PSB1bmRlZmluZWQpIHtcclxuICAgIHdpbmRvdyA9IGF3YWl0IGNyZWF0ZVdpbmRvdygpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHdpbmRvdy5pc01pbmltaXplZCgpKSB7XHJcbiAgICB3aW5kb3cucmVzdG9yZSgpO1xyXG4gIH1cclxuXHJcbiAgd2luZG93LmZvY3VzKCk7XHJcbn1cclxuIiwiLypcclxuICogQEF1dGhvcjogc3p4XHJcbiAqIEBEYXRlOiAyMDIyLTA3LTIzIDEzOjQwOjMxXHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDgtMDEgMjE6NDc6MTlcclxuICogQERlc2NyaXB0aW9uOiBlbGVjdHJvbueahOW6lOeUqOWQr+WKqFxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcaW5kZXgudHNcclxuICovXHJcbmltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgcHJvdG9jb2wgfSBmcm9tICdlbGVjdHJvbic7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGlwY01haW5Db2xsZWN0aW9uIH0gZnJvbSAnLi9pcGMtbWVzc2FnZSc7XHJcblxyXG5pbXBvcnQgeyByZXN0b3JlT3JDcmVhdGVXaW5kb3cgfSBmcm9tICcvQC9tYWluV2luZG93JztcclxuXHJcbi8qKlxyXG4gKiDlj6rmi6XmnInkuIDkuKrlrp7kvovvvIzpmLLmraLmnInlpJrkuKrlrp7kvotcclxuICovXHJcbmNvbnN0IGlzU2luZ2xlSW5zdGFuY2UgPSBhcHAucmVxdWVzdFNpbmdsZUluc3RhbmNlTG9jaygpO1xyXG5pZiAoIWlzU2luZ2xlSW5zdGFuY2UpIHtcclxuICBhcHAucXVpdCgpO1xyXG4gIHByb2Nlc3MuZXhpdCgwKTtcclxufVxyXG5hcHAub24oJ3NlY29uZC1pbnN0YW5jZScsIHJlc3RvcmVPckNyZWF0ZVdpbmRvdyk7XHJcbi8qKlxyXG4gKiDlhbPpl63noazku7bliqDpgJ/vvIzov5nkuKrmnInlvoXllYbmprfvvIzpmaTpnZ7mnInlhbzlrrnmgKfpl67pophcclxuICovXHJcbi8vIGFwcC5kaXNhYmxlSGFyZHdhcmVBY2NlbGVyYXRpb24oKTtcclxuXHJcbi8qKlxyXG4gKiDlhbPpl63nqpflj6PvvIzmiYDmnInov5vnqIvpg73pgIDlh7pcclxuICovXHJcbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XHJcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XHJcbiAgICBhcHAucXVpdCgpO1xyXG4gIH1cclxufSk7XHJcblxyXG4vKipcclxuICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL3YxNC14LXkvYXBpL2FwcCNldmVudC1hY3RpdmF0ZS1tYWNvcyBFdmVudDogJ2FjdGl2YXRlJ1xyXG4gKi9cclxuYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcclxuICBpZiAoQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkubGVuZ3RoID09PSAwKSByZXN0b3JlT3JDcmVhdGVXaW5kb3coKTtcclxufSk7XHJcblxyXG4vKipcclxuICog5Yib5bu65bqU55So56qX5Y+j5b2T5ZCO5Y+w6L+b56iL5bey57uP5YeG5aSH5aW9XHJcbiAqL1xyXG5hcHBcclxuICAud2hlblJlYWR5KClcclxuICAudGhlbigoKSA9PiB7XHJcbiAgICByZXN0b3JlT3JDcmVhdGVXaW5kb3coKTtcclxuICAgIGlwY01haW5Db2xsZWN0aW9uO1xyXG4gICAgcHJvdG9jb2wucmVnaXN0ZXJGaWxlUHJvdG9jb2woJ2F0b20nLCAocmVxdWVzdCwgY2FsbGJhY2spID0+IHtcclxuICAgICAgY29uc3QgdXJsID0gcmVxdWVzdC51cmwucmVwbGFjZSgvXmF0b206XFwvXFwvLywgJycpO1xyXG4gICAgICBjb25zdCBkZWNvZGVkVXJsID0gZGVjb2RlVVJJKHVybCk7IC8vIE5lZWRlZCBpbiBjYXNlIFVSTCBjb250YWlucyBzcGFjZXNcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gY2FsbGJhY2soeyBwYXRoOiBwYXRoLm5vcm1hbGl6ZShkZWNvZGVkVXJsKSB9KTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdFUlJPUjogcmVnaXN0ZXJMb2NhbFJlc291cmNlUHJvdG9jb2w6IENvdWxkIG5vdCBnZXQgZmlsZSBwYXRoOicsIGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuY2F0Y2goKGUpID0+IGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCBjcmVhdGUgd2luZG93OicsIGUpKTtcclxuXHJcbi8qKlxyXG4gKiDlpoLmnpzmmK/mtYvor5Xnjq/looPvvIzlronoo4VWdWUuanPnmoTosIPor5Xmj5Lku7ZcclxuICovXHJcbmlmIChpbXBvcnQubWV0YS5lbnYuREVWKSB7XHJcbiAgYXBwXHJcbiAgICAud2hlblJlYWR5KClcclxuICAgIC50aGVuKCgpID0+IGltcG9ydCgnZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyJykpXHJcbiAgICAudGhlbigoeyBkZWZhdWx0OiBpbnN0YWxsRXh0ZW5zaW9uLCBWVUVKUzNfREVWVE9PTFMgfSkgPT5cclxuICAgICAgaW5zdGFsbEV4dGVuc2lvbihWVUVKUzNfREVWVE9PTFMsIHtcclxuICAgICAgICBsb2FkRXh0ZW5zaW9uT3B0aW9uczoge1xyXG4gICAgICAgICAgYWxsb3dGaWxlQWNjZXNzOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgKVxyXG4gICAgLmNhdGNoKChlKSA9PiBjb25zb2xlLmVycm9yKCdGYWlsZWQgaW5zdGFsbCBleHRlbnNpb246JywgZSkpO1xyXG59XHJcblxyXG4vKipcclxuICog5Zyo55Sf5Lqn5qih5byP5LiL77yM5qOA5p+l5bqU55So55qE54mI5pys5pu05pawXHJcbiAqL1xyXG5pZiAoaW1wb3J0Lm1ldGEuZW52LlBST0QpIHtcclxuICBhcHBcclxuICAgIC53aGVuUmVhZHkoKVxyXG4gICAgLnRoZW4oKCkgPT4gaW1wb3J0KCdlbGVjdHJvbi11cGRhdGVyJykpXHJcbiAgICAudGhlbigoeyBhdXRvVXBkYXRlciB9KSA9PiBhdXRvVXBkYXRlci5jaGVja0ZvclVwZGF0ZXNBbmROb3RpZnkoKSlcclxuICAgIC5jYXRjaCgoZSkgPT4gY29uc29sZS5lcnJvcignRmFpbGVkIGNoZWNrIHVwZGF0ZXM6JywgZSkpO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJpcGNNYWluIiwicGF0aCIsImFwcCIsIlN0b3JlIiwibGFuZ3VhZ2UuemgiLCJsYW5ndWFnZS5lbiIsImRpYWxvZyIsInNoZWxsIiwiTWVudSIsIkJyb3dzZXJXaW5kb3ciLCJqb2luIiwicHJvdG9jb2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQUEsU0FBQSxRQUFRLEdBQUcsV0FBVyxTQUFVLE9BQU8sS0FBSztBQUUxQyxRQUFNLGNBQWNDLHNCQUFLLFFBQVFDLFNBQUFBLElBQUksUUFBUSxLQUFLLENBQUM7QUFDckQsQ0FBQztBQUVERixTQUFBLFFBQVEsR0FBRyxxQkFBcUIsU0FBVSxPQUFPLEtBQUs7QUFFcEQsVUFBUSxJQUFJLEdBQUc7QUFDVCxRQUFBLGNBQWNFLFNBQUFBLElBQUksa0JBQWtCLEdBQUc7QUFDL0MsQ0FBQztBQUdERixTQUFBLFFBQVEsR0FBRyxXQUFXLFNBQVUsT0FBTyxLQUFLO0FBRXBDLFFBQUEsY0FBY0UsYUFBSTtBQUMxQixDQUFDO0FBRURGLFNBQUEsUUFBUSxHQUFHLFlBQVksU0FBVSxPQUFPLEtBQUs7QUFFM0MsUUFBTSxjQUFjLFFBQVE7QUFDOUIsQ0FBQztBQUVEQSxTQUFBLFFBQVEsR0FBRyxRQUFRLFNBQVUsT0FBTyxLQUFLO0FBRXZDLFFBQU0sY0FBYyxRQUFRO0FBQzlCLENBQUM7QUFFREEsU0FBQSxRQUFRLEdBQUcsWUFBWSxTQUFVLE9BQU8sS0FBSztBQUkzQyxRQUFNLGNBQWM7QUFDdEIsQ0FBQztBQUdEQSxTQUFBLFFBQVEsR0FBRyxpQkFBaUIsU0FBVSxPQUFPLEtBQUs7QUFDMUMsUUFBQSxNQUFNLGlCQUFpQixHQUFHO0FBQ2xDLENBQUM7QUFPREEsU0FBQSxRQUFRLEdBQUcsZUFBZSxTQUFVLE9BQU8sS0FBSztBQUN4QyxRQUFBLE1BQU0sZUFBZSxHQUFHO0FBQ2hDLENBQUM7QUFFREEsU0FBQSxRQUFRLEdBQUcsZUFBZSxDQUFDLE9BQU8sYUFBYTtBQUM3QyxRQUFNLE9BQU8sVUFBVTtBQUFB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
