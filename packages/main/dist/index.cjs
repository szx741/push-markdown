"use strict";
const electron = require("electron");
const path = require("path");
const Store = require("electron-store");
const MetaWeblog = require("metaweblog-api");
require("url");
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
const MetaWeblog__default = /* @__PURE__ */ _interopDefaultLegacy(MetaWeblog);
let metaweblog;
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
electron.ipcMain.on("process.versions", function(event, arg) {
  event.returnValue = process.versions;
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
electron.ipcMain.on("new-media-object", async function(event, arg) {
  try {
    metaweblog = new MetaWeblog__default.default(arg[7]);
    if (arg[0] == true) {
      arg[6] = Buffer.from(arg[6], "base64");
    }
    const mediaObject = {
      name: arg[4],
      type: arg[5],
      bits: arg[6],
      overwrite: true
    };
    const res = await metaweblog.newMediaObject(arg[1], arg[2], arg[3], mediaObject);
    event.returnValue = [true, res.url];
  } catch (err) {
    event.returnValue = [false, err.toString()];
  }
});
electron.ipcMain.on("new-metaweblog", function(event, arg) {
  metaweblog = new MetaWeblog__default.default(arg);
  event.returnValue = true;
});
Store__default.default.initRenderer();
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
          checked: theme === "light",
          click: function() {
            setThemeConf(true);
          }
        },
        {
          label: l.dark,
          type: "radio",
          checked: theme === "dark",
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
    width: 1600,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6WyIuLi9zcmMvaXBjLW1lc3NhZ2UudHMiLCIuLi9zcmMvYXBwLW1lbnUvbWVudS1sYW5nLnRzIiwiLi4vc3JjL2FwcC1tZW51L3N0b3JlLnRzIiwiLi4vc3JjL2FwcC1tZW51L2luZGV4LnRzIiwiLi4vc3JjL21haW5XaW5kb3cudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQEF1dGhvcjogc3p4XHJcbiAqIEBEYXRlOiAyMDIxLTA3LTA1IDIwOjU3OjEwXHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDctMjYgMTU6MTI6MTlcclxuICogQERlc2NyaXB0aW9uOlxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcaXBjLW1lc3NhZ2UudHNcclxuICovXHJcblxyXG5pbXBvcnQgeyBhcHAsIGlwY01haW4gfSBmcm9tICdlbGVjdHJvbic7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgU3RvcmUgZnJvbSAnZWxlY3Ryb24tc3RvcmUnO1xyXG5pbXBvcnQgTWV0YVdlYmxvZyBmcm9tICdtZXRhd2VibG9nLWFwaSc7XHJcbmxldCBtZXRhd2VibG9nOiBNZXRhV2VibG9nO1xyXG5cclxuLypcclxuICAvLyDlrp7pqozmgKfotKhcclxuICBpcGNNYWluLm9uKCd0b01haW4nLCAoZXZlbnQsIGFyZ3MpID0+IHtcclxuICAgIC8vIGV2ZW50LnJlcGx5KCdmcm9tTWFpbicsICflkI7mkqTmraU4ODgnKTtcclxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZnJvbU1haW4nLCAn5ZCO5pKk5q2lNzc3Jyk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIOeEtuWQjuWcqOa4suafk+i/m+eoi+S4reS9v+eUqOS4i+mdoueahOi/meauteivreWPpVxyXG4gIC8vIOS7juS4u+i/m+eoi+mAmumBk0Zyb21NYWlu5o6l5Y+X5L+h5oGvXHJcbiAgaXBjLnJlY2VpdmUoJ2Zyb21NYWluJywgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coYFJlY2VpdmVkICR7ZGF0YX0gZnJvbSBtYWluIHByb2Nlc3NgKTtcclxuICB9KTtcclxuICAvLyDlj5HpgIHkv6Hmga/nu5nkuLvov5vnqIvpgJrpgZN0b01haW5cclxuICBpcGMuc2VuZCgndG9NYWluJywgJ3NvbWUgZGF0YScpO1xyXG4qL1xyXG4vLyDojrflvpflvZPliY3lronoo4XljIXot6/lvoRcclxuaXBjTWFpbi5vbignZXhlUGF0aCcsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgLy8gZXZlbnQucmVwbHkoJ2V4ZVBhdGgnLCBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKTtcclxufSk7XHJcblxyXG5pcGNNYWluLm9uKCdhZGRSZWNlbnREb2N1bWVudCcsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgLy8gZXZlbnQucmVwbHkoJ2V4ZVBhdGgnLCBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKSk7XHJcbiAgY29uc29sZS5sb2coYXJnKTtcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IGFwcC5hZGRSZWNlbnREb2N1bWVudChhcmcpO1xyXG59KTtcclxuXHJcbi8vIOiOt+W+l+W9k+WJjeeJiOacrOWPt1xyXG5pcGNNYWluLm9uKCd2ZXJzaW9uJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyAgIGV2ZW50LnJlcGx5KCd2ZXJzaW9uJywgYXBwLmdldFZlcnNpb24oKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBhcHAuZ2V0VmVyc2lvbigpO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ3BsYXRmb3JtJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyAgIGV2ZW50LnJlcGx5KCd2ZXJzaW9uJywgYXBwLmdldFZlcnNpb24oKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBwcm9jZXNzLnBsYXRmb3JtO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ2FyZ3YnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIC8vICAgZXZlbnQucmVwbHkoJ3ZlcnNpb24nLCBhcHAuZ2V0VmVyc2lvbigpKTtcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IHByb2Nlc3MuYXJndjtcclxufSk7XHJcblxyXG5pcGNNYWluLm9uKCdwcm9jZXNzLnZlcnNpb25zJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyAgIGV2ZW50LnJlcGx5KCd2ZXJzaW9uJywgYXBwLmdldFZlcnNpb24oKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBwcm9jZXNzLnZlcnNpb25zO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ19fc3RhdGljJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyBldmVudC5yZXBseSgnZXhlUGF0aCcsIHBhdGguZGlybmFtZShhcHAuZ2V0UGF0aCgnZXhlJykpKTtcclxuICAvLyBldmVudC5yZXR1cm5WYWx1ZSA9IF9fc3RhdGljO1xyXG4gIC8vIGV2ZW50LnJldHVyblZhbHVlID0gJy4vJztcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IF9fZGlybmFtZTtcclxufSk7XHJcblxyXG4vLyDkuK3ovazmtojmga/vvIzmuLLmn5Pov5vnqIvlj5Hnu5nkuLvov5vnqIvvvIzkuLvov5vnqIvlho3lj5Hnu5nmuLLmn5Pov5vnqItcclxuaXBjTWFpbi5vbignbWVudS5zZXR0aW5ncycsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgZXZlbnQucmVwbHkoJ21lbnUuc2V0dGluZ3MnLCBhcmcpO1xyXG59KTtcclxuXHJcbi8vIGlwY01haW4ub24oJ21lbnUuc2hvd2ZpbGUnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4vLyAgIGV2ZW50LnJlcGx5KCdtZW51LnNob3dmaWxlJywgYXJnKTtcclxuLy8gfSk7XHJcblxyXG4vLyDkuK3ovazmtojmga/vvIzmuLLmn5Pov5vnqIvlj5Hnu5nkuLvov5vnqIvvvIzkuLvov5vnqIvlho3lj5Hnu5nmuLLmn5Pov5vnqItcclxuaXBjTWFpbi5vbignbWVudS5zYW1wbGUnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIGV2ZW50LnJlcGx5KCdtZW51LnNhbXBsZScsIGFyZyk7XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5vbignb25kcmFnc3RhcnQnLCAoZXZlbnQsIGZpbGVQYXRoKSA9PiB7XHJcbiAgZXZlbnQuc2VuZGVyLnN0YXJ0RHJhZyh7XHJcbiAgICBmaWxlOiBmaWxlUGF0aCxcclxuICAgIGljb246ICcvcGF0aC90by9pY29uLnBuZydcclxuICB9KTtcclxufSk7XHJcblxyXG4vLyDkuK3ovazmtojmga/vvIzmuLLmn5Pov5vnqIvlj5Hnu5nkuLvov5vnqIvvvIzkuLvov5vnqIvlho3lj5Hnu5nmuLLmn5Pov5vnqItcclxuaXBjTWFpbi5vbignbmV3LW1lZGlhLW9iamVjdCcsIGFzeW5jIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgdHJ5IHtcclxuICAgIG1ldGF3ZWJsb2cgPSBuZXcgTWV0YVdlYmxvZyhhcmdbN10pO1xyXG4gICAgaWYgKGFyZ1swXSA9PSB0cnVlKSB7XHJcbiAgICAgIGFyZ1s2XSA9IEJ1ZmZlci5mcm9tKGFyZ1s2XSwgJ2Jhc2U2NCcpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbWVkaWFPYmplY3QgPSB7XHJcbiAgICAgIG5hbWU6IGFyZ1s0XSxcclxuICAgICAgdHlwZTogYXJnWzVdLFxyXG4gICAgICBiaXRzOiBhcmdbNl0sXHJcbiAgICAgIG92ZXJ3cml0ZTogdHJ1ZVxyXG4gICAgfTtcclxuICAgIC8vIGNvbnN0IG1ldGEgPSBuZXcgTWV0YVdlYmxvZyhhcmdbMF0pO1xyXG4gICAgY29uc3QgcmVzOiBhbnkgPSBhd2FpdCBtZXRhd2VibG9nLm5ld01lZGlhT2JqZWN0KGFyZ1sxXSwgYXJnWzJdLCBhcmdbM10sIG1lZGlhT2JqZWN0KTtcclxuICAgIGV2ZW50LnJldHVyblZhbHVlID0gW3RydWUsIHJlcy51cmxdO1xyXG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICBldmVudC5yZXR1cm5WYWx1ZSA9IFtmYWxzZSwgZXJyLnRvU3RyaW5nKCldO1xyXG4gIH1cclxufSk7XHJcblxyXG5pcGNNYWluLm9uKCduZXctbWV0YXdlYmxvZycsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgbWV0YXdlYmxvZyA9IG5ldyBNZXRhV2VibG9nKGFyZyk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSB0cnVlO1xyXG59KTtcclxuXHJcbi8vIGlwY01haW4ub24oJ25ldy1tZWRpYS1vYmplY3QnLCBhc3luYyBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4vLyAgIGNvbnNvbGUubG9nKCdtZXRhJywgbWV0YSk7XHJcbi8vICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbWV0YS5uZXdNZWRpYU9iamVjdChibG9nSWQsIHVzZXJuYW1lLCBwYXNzd29yZCwgbWVkaWFPYmplY3QpO1xyXG4vLyAgIGNvbnNvbGUubG9nKCduZXctbWVkaWEtb2JqZWN0OicsIHJlc3VsdCk7XHJcbi8vICAgZXZlbnQucmVwbHkoJ25ldy1tZWRpYS1vYmplY3QnLCByZXN1bHQpO1xyXG4vLyB9KTtcclxuXHJcblN0b3JlLmluaXRSZW5kZXJlcigpO1xyXG5cclxuZXhwb3J0IHsgaXBjTWFpbiBhcyBpcGNNYWluQ29sbGVjdGlvbiB9O1xyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjEtMDctMDQgMTk6MDA6NThcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wNy0zMSAxMzo1MDo1NVxyXG4gKiBARGVzY3JpcHRpb246IOeql+WPo+eahOWkmuivreiogOaUr+aMgVxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcYXBwLW1lbnVcXG1lbnUtbGFuZy50c1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjb25zdCBlbiA9IHtcclxuICBmaWxlOiAnRmlsZScsXHJcbiAgb3BlbjogJ09wZW4nLFxyXG4gIG9wZW5SZWNlbnQ6ICdPcGVuIFJlY2VudCcsXHJcbiAgY2xlYXJSZWNlbnQ6ICdDbGVhcicsXHJcbiAgc2F2ZTogJ1NhdmUnLFxyXG4gIHB1Ymxpc2g6ICdQdWJsaXNoJyxcclxuICBsYW5ndWFnZTogJ0xhbmd1YWdlJyxcclxuICBzZXR0aW5nczogJ1NldHRpbmdzJyxcclxuICBlZGl0OiAnRWRpdCcsXHJcbiAgdW5kbzogJ1VuZG8nLFxyXG4gIHJlZG86ICdSZWRvJyxcclxuICBjdXQ6ICdDdXQnLFxyXG4gIGNvcHk6ICdDb3B5JyxcclxuICBwYXN0ZTogJ1Bhc3RlJyxcclxuICBzZWxlY3RBbGw6ICdTZWxlY3QgQWxsJyxcclxuICByZWxvYWQ6ICdSZWxvYWQnLFxyXG4gIGZpbGVUcmVlOiAnRmlsZSB0cmVlJyxcclxuICBjbG9zZVRhYjogJ0Nsb3NlIEN1cnJlbnQgRmlsZScsXHJcbiAgcmVsb2FkRmlsZTogJ1JlbG9hZCBGaWxlJyxcclxuICB0b2dnbGVGdWxsU2NyZWVuOiAnVG9nZ2xlIEZ1bGwgU2NyZWVuJyxcclxuICB0b2dnbGVEZXZUb29sczogJ1RvZ2dsZSBEZXZlbG9wZXIgVG9vbHMnLFxyXG4gIHdpbmRvdzogJ1dpbmRvdycsXHJcbiAgbWluaW1pemU6ICdNaW5pbWl6ZScsXHJcbiAgY2xvc2U6ICdDbG9zZScsXHJcbiAgaGVscDogJ0hlbHAnLFxyXG4gIGxlYXJuTW9yZTogJ0xlYXJuIE1vcmUnLFxyXG4gIG9wZW5XZWxjb21lUGFnZTogJ09wZW4gV2VsY29tZSBQYWdlJyxcclxuICB2aWV3U2FtcGxlRmlsZTogJ1ZpZXcgU2FtcGxlIEZpbGUnLFxyXG4gIHR1dG9yaWFsczogJ1R1dG9yaWFscycsXHJcbiAgYWJvdXQ6ICdBYm91dCAnLFxyXG4gIHNlcnZpY2VzOiAnU2VydmljZXMnLFxyXG4gIGhpZGU6ICdIaWRlICcsXHJcbiAgaGlkZU90aGVyczogJ0hpZGUgT3RoZXJzJyxcclxuICBzaG93QWxsOiAnU2hvdyBBbGwnLFxyXG4gIHF1aXQ6ICdRdWl0JyxcclxuICBicmluZ0FsbFRvRnJvbnQ6ICdCcmluZyBBbGwgdG8gRnJvbnQnLFxyXG4gIHRoZW1lOiAnVGhlbWUnLFxyXG4gIGxpZ2h0OiAnTGlnaHQnLFxyXG4gIGRhcms6ICdEYXJrJ1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHpoID0ge1xyXG4gIGZpbGU6ICfmlofku7YnLFxyXG4gIG9wZW46ICfmiZPlvIAnLFxyXG4gIG9wZW5SZWNlbnQ6ICfmiZPlvIDmnIDov5Hkvb/nlKjnmoQnLFxyXG4gIGNsZWFyUmVjZW50OiAn5riF6ZmkJyxcclxuICBzYXZlOiAn5L+d5a2YJyxcclxuICBwdWJsaXNoOiAn5Y+R5biDJyxcclxuICBsYW5ndWFnZTogJ+ivreiogCcsXHJcbiAgc2V0dGluZ3M6ICforr7nva4nLFxyXG4gIGVkaXQ6ICfnvJbovpEnLFxyXG4gIHVuZG86ICfmkqTplIAnLFxyXG4gIHJlZG86ICfph43lgZonLFxyXG4gIGN1dDogJ+WJquWIhycsXHJcbiAgY29weTogJ+WkjeWIticsXHJcbiAgcGFzdGU6ICfnspjotLQnLFxyXG4gIHNlbGVjdEFsbDogJ+WFqOmAiScsXHJcbiAgcmVsb2FkOiAn6YeN5paw5Yqg6L29JyxcclxuICBmaWxlVHJlZTogJ+aWh+S7tuWIl+ihqCcsXHJcbiAgY2xvc2VUYWI6ICflhbPpl63lvZPliY3mlofku7YnLFxyXG4gIHJlbG9hZEZpbGU6ICfph43mlrDovb3lhaXmlofku7YnLFxyXG4gIHRvZ2dsZUZ1bGxTY3JlZW46ICfliIfmjaLlhajlsY8nLFxyXG4gIHRvZ2dsZURldlRvb2xzOiAn5YiH5o2i5byA5Y+R6ICF5bel5YW3JyxcclxuICB3aW5kb3c6ICfnqpflj6MnLFxyXG4gIG1pbmltaXplOiAn5pyA5bCP5YyWJyxcclxuICBjbG9zZTogJ+WFs+mXrScsXHJcbiAgaGVscDogJ+W4ruWKqScsXHJcbiAgbGVhcm5Nb3JlOiAn5LqG6Kej5pu05aSaJyxcclxuICBvcGVuV2VsY29tZVBhZ2U6ICfmiZPlvIDmrKLov47pobUnLFxyXG4gIHZpZXdTYW1wbGVGaWxlOiAn5p+l55yL56S65L6L5paH5qGjJyxcclxuICB0dXRvcmlhbHM6ICfkvb/nlKjmlZnnqIsnLFxyXG4gIGFib3V0OiAn5YWz5LqOJyxcclxuICBzZXJ2aWNlczogJ+acjeWKoScsXHJcbiAgaGlkZTogJ+makOiXjycsXHJcbiAgaGlkZU90aGVyczogJ+makOiXj+WFtuS7licsXHJcbiAgc2hvd0FsbDogJ+aYvuekuuWFqOmDqCcsXHJcbiAgcXVpdDogJ+mAgOWHuicsXHJcbiAgYnJpbmdBbGxUb0Zyb250OiAn5YmN572u5YWo6YOo56qX5Y+jJyxcclxuICB0aGVtZTogJ+S4u+mimCcsXHJcbiAgbGlnaHQ6ICfmtYXoibInLFxyXG4gIGRhcms6ICfmt7HoibInXHJcbn07XHJcbiIsIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMS0wNy0wNCAxODo0Nzo0NFxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA3LTMxIDE1OjM1OjMxXHJcbiAqIEBEZXNjcmlwdGlvbjogZWxlY3Ryb24tc290cmXlrZjlgqjor63oqIDlgLxcclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxtYWluXFxzcmNcXGFwcC1tZW51XFxzdG9yZS50c1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBTdG9yZSBmcm9tICdlbGVjdHJvbi1zdG9yZSc7XHJcblxyXG4vLyDlrZjlgqjnmoTmlofku7blkI3kuLpzZXR0aW5nc1xyXG5jb25zdCBzdG9yZSA9IG5ldyBTdG9yZSh7IG5hbWU6ICdzZXR0aW5ncycgfSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGFuZygpIHtcclxuICByZXR1cm4gc3RvcmUuZ2V0KCdsYW5ndWFnZScsICd6aCcpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0TGFuZyhsYW5nOiBzdHJpbmcpIHtcclxuICByZXR1cm4gc3RvcmUuc2V0KCdsYW5ndWFnZScsIGxhbmcpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUaGVtZSgpIHtcclxuICByZXR1cm4gc3RvcmUuZ2V0KCd0aGVtZScsIHRydWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VGhlbWUodGhlbWU6IGJvb2xlYW4pIHtcclxuICByZXR1cm4gc3RvcmUuc2V0KCd0aGVtZScsIHRoZW1lKTtcclxufVxyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjItMDctMjMgMTk6NTc6MzFcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wNy0zMSAxNTozNToyM1xyXG4gKiBARGVzY3JpcHRpb246XHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxhcHAtbWVudVxcaW5kZXgudHNcclxuICovXHJcbi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMS0wNy0wNCAxODo0MjoxNVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA3LTIzIDE5OjU2OjMyXHJcbiAqIEBEZXNjcmlwdGlvbjog6I+c5Y2V5qCP6K6+572uXHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxhcHAtbWVudS50c1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vZGlhbG9n5qih5Z2X5o+Q5L6b5LqGYXBp5p2l5bGV56S65Y6f55Sf55qE57O757uf5a+56K+d5qGG77yM5L6L5aaC5omT5byA5paH5Lu25qGG77yMYWxlcnTmoYZcclxuaW1wb3J0IHsgTWVudSwgYXBwLCBkaWFsb2csIHNoZWxsLCBCcm93c2VyV2luZG93IH0gZnJvbSAnZWxlY3Ryb24nO1xyXG5cclxuaW1wb3J0ICogYXMgbGFuZ3VhZ2UgZnJvbSAnLi9tZW51LWxhbmcnO1xyXG5pbXBvcnQgeyBzZXRMYW5nLCBzZXRUaGVtZSwgZ2V0TGFuZywgZ2V0VGhlbWUgfSBmcm9tICcuL3N0b3JlJztcclxuXHJcbi8vIOWKoOi9veiPnOWNleagj1xyXG5leHBvcnQgZnVuY3Rpb24gbWVudUluaXQobWFpbldpbmRvdzogQnJvd3NlcldpbmRvdykge1xyXG4gIC8vIHdlYkNvbnRlbnRz5a6D6LSf6LSj5riy5p+T5bm25o6n5Yi2572R6aG1XHJcbiAgY29uc3Qgd2ViQ29udGVudHMgPSBtYWluV2luZG93LndlYkNvbnRlbnRzLFxyXG4gICAgbGFuZyA9IGdldExhbmcoKSwgLy8g5b2T5YmN55qE6K+t6KiAXHJcbiAgICB0aGVtZSA9IGdldFRoZW1lKCksIC8v5b2T5YmN55qE5Li76aKYXHJcbiAgICBsID0gbGFuZyA9PT0gJ3poJyA/IGxhbmd1YWdlLnpoIDogbGFuZ3VhZ2UuZW47XHJcbiAgLy8g6K6+572u6K+t6KiAXHJcbiAgZnVuY3Rpb24gc2V0TGFuZ3VhZ2UobGFuZzogc3RyaW5nKSB7XHJcbiAgICBzZXRMYW5nKGxhbmcpO1xyXG4gICAgLy8g6YCa6L+HIGNoYW5uZWwg5Y+R6YCB5byC5q2l5raI5oGv57uZ5riy5p+T6L+b56iLXHJcbiAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51Lmxhbmd1YWdlJywgbGFuZyk7XHJcbiAgICAvLyDph43mlrDmuLLmn5Poj5zljZXmoI9cclxuICAgIG1lbnVJbml0KG1haW5XaW5kb3cpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0VGhlbWVDb25mKG5ld1RoZW1lOiBib29sZWFuKSB7XHJcbiAgICBzZXRUaGVtZShuZXdUaGVtZSk7XHJcbiAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnRoZW1lJywgbmV3VGhlbWUpO1xyXG4gIH1cclxuICAvLyDoj5zljZXmoI/mqKHmnb9cclxuICBjb25zdCB0ZW1wbGF0ZTogYW55W10gPSBbXHJcbiAgICB7XHJcbiAgICAgIGxhYmVsOiBsLmZpbGUsXHJcbiAgICAgIC8v5paH5Lu25LiL5ouJ5bGe5oCnXHJcbiAgICAgIHN1Ym1lbnU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5vcGVuLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrTycsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkaWFsb2dcclxuICAgICAgICAgICAgICAuc2hvd09wZW5EaWFsb2cobWFpbldpbmRvdywgeyBwcm9wZXJ0aWVzOiBbJ29wZW5GaWxlJ10sIGZpbHRlcnM6IFt7IG5hbWU6ICdNYXJrZG93bicsIGV4dGVuc2lvbnM6IFsnbWQnXSB9XSB9KVxyXG4gICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQuY2FuY2VsZWQgJiYgcmVzdWx0LmZpbGVQYXRocy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUub3BlbicsIHJlc3VsdC5maWxlUGF0aHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAvLyDliIbpmpTmqKrnur9cclxuICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5zYXZlLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUycsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnNhdmUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnB1Ymxpc2gsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtQJyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUucHVibGlzaCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnNldHRpbmdzLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5zZXR0aW5ncycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwubGFuZ3VhZ2UsXHJcbiAgICAgICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBsYWJlbDogJ+eugOS9k+S4reaWhycsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3JhZGlvJyxcclxuICAgICAgICAgICAgICBjaGVja2VkOiBsYW5nID09PSAnemgnLFxyXG4gICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRMYW5ndWFnZSgnemgnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBsYWJlbDogJ0VuZ2xpc2gnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdyYWRpbycsXHJcbiAgICAgICAgICAgICAgY2hlY2tlZDogbGFuZyA9PT0gJ2VuJyxcclxuICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0TGFuZ3VhZ2UoJ2VuJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgLy/nrKzkuozkuKroj5zljZVcclxuICAgIHtcclxuICAgICAgbGFiZWw6IGwuZWRpdCxcclxuICAgICAgc3VibWVudTogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnVuZG8sXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtaJyxcclxuICAgICAgICAgIHJvbGU6ICd1bmRvJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwucmVkbyxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnU2hpZnQrQ21kT3JDdHJsK1onLFxyXG4gICAgICAgICAgcm9sZTogJ3JlZG8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuY3V0LFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrWCcsXHJcbiAgICAgICAgICByb2xlOiAnY3V0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuY29weSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK0MnLFxyXG4gICAgICAgICAgcm9sZTogJ2NvcHknXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5wYXN0ZSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1YnLFxyXG4gICAgICAgICAgcm9sZTogJ3Bhc3RlJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuc2VsZWN0QWxsLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrQScsXHJcbiAgICAgICAgICByb2xlOiAnc2VsZWN0YWxsJ1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIC8vIOeql+WPo+iPnOWNlVxyXG4gICAge1xyXG4gICAgICBsYWJlbDogbC53aW5kb3csXHJcbiAgICAgIHJvbGU6ICd3aW5kb3cnLFxyXG4gICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuZmlsZVRyZWUsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdDdHJsK1NoaWZ0K0wnO1xyXG4gICAgICAgICAgfSkoKSxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUuc2hvd2ZpbGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnRvZ2dsZUZ1bGxTY3JlZW4sXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSByZXR1cm4gJ0N0cmwrQ29tbWFuZCtGJztcclxuICAgICAgICAgICAgZWxzZSByZXR1cm4gJ0YxMSc7XHJcbiAgICAgICAgICB9KSgpLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIChpdGVtOiBhbnksIGZvY3VzZWRXaW5kb3c6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoZm9jdXNlZFdpbmRvdykgZm9jdXNlZFdpbmRvdy5zZXRGdWxsU2NyZWVuKCFmb2N1c2VkV2luZG93LmlzRnVsbFNjcmVlbigpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLm1pbmltaXplLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrTScsXHJcbiAgICAgICAgICByb2xlOiAnbWluaW1pemUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5yZWxvYWRGaWxlLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdGNScsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnJlbG9hZGZpbGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmNsb3NlVGFiLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnQ3RybCtGNCc7XHJcbiAgICAgICAgICB9KSgpLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5jbG9zZXRhYicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnJlbG9hZCxcclxuICAgICAgICAgIC8vIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1InLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIChpdGVtOiBhbnksIGZvY3VzZWRXaW5kb3c6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoZm9jdXNlZFdpbmRvdykgZm9jdXNlZFdpbmRvdy5yZWxvYWQoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnRvZ2dsZURldlRvb2xzLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnQ3RybCtTaGlmdCtJJztcclxuICAgICAgICAgIH0pKCksXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKGl0ZW06IGFueSwgZm9jdXNlZFdpbmRvdzogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChmb2N1c2VkV2luZG93KSBmb2N1c2VkV2luZG93LnRvZ2dsZURldlRvb2xzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuY2xvc2UsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtXJyxcclxuICAgICAgICAgIHJvbGU6ICdjbG9zZSdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcblxyXG4gICAgLy8g5Li76aKY6I+c5Y2VXHJcbiAgICB7XHJcbiAgICAgIGxhYmVsOiBsLnRoZW1lLFxyXG4gICAgICByb2xlOiAndGhlbWUnLFxyXG4gICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwubGlnaHQsXHJcbiAgICAgICAgICB0eXBlOiAncmFkaW8nLFxyXG4gICAgICAgICAgY2hlY2tlZDogdGhlbWUgPT09ICdsaWdodCcsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZXRUaGVtZUNvbmYodHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5kYXJrLFxyXG4gICAgICAgICAgdHlwZTogJ3JhZGlvJyxcclxuICAgICAgICAgIGNoZWNrZWQ6IHRoZW1lID09PSAnZGFyaycsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZXRUaGVtZUNvbmYoZmFsc2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyDluK7liqnoj5zljZVcclxuICAgIHtcclxuICAgICAgbGFiZWw6IGwuaGVscCxcclxuICAgICAgcm9sZTogJ2hlbHAnLFxyXG4gICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwub3BlbldlbGNvbWVQYWdlLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS53ZWxjb21lJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC52aWV3U2FtcGxlRmlsZSxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUuc2FtcGxlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC50dXRvcmlhbHMsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBhcHAuZ2V0QXBwUGF0aCgpO1xyXG4gICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vZ2l0ZWUuY29tL3hhb3R1bWFuL3B1c2gtbWFya2Rvd24vYmxvYi9tYXN0ZXIvZG9jcy8lRTQlQkQlQkYlRTclOTQlQTglRTYlOTUlOTklRTclQTglOEIubWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmxlYXJuTW9yZSxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFwcC5nZXRBcHBQYXRoKCk7XHJcbiAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9naXRlZS5jb20veGFvdHVtYW4vcHVzaC1tYXJrZG93bicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gIF07XHJcblxyXG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJykge1xyXG4gICAgY29uc3QgbmFtZTogc3RyaW5nID0gYXBwLmdldE5hbWUoKTtcclxuICAgIHRlbXBsYXRlLnVuc2hpZnQoe1xyXG4gICAgICBsYWJlbDogbmFtZSxcclxuICAgICAgc3VibWVudTogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmFib3V0ICsgbmFtZSxcclxuICAgICAgICAgIHJvbGU6ICdhYm91dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5zZXJ2aWNlcyxcclxuICAgICAgICAgIHJvbGU6ICdzZXJ2aWNlcycsXHJcbiAgICAgICAgICBzdWJtZW51OiBbXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmhpZGUgKyBuYW1lLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDb21tYW5kK0gnLFxyXG4gICAgICAgICAgcm9sZTogJ2hpZGUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5oaWRlT3RoZXJzLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDb21tYW5kK1NoaWZ0K0gnLFxyXG4gICAgICAgICAgcm9sZTogJ2hpZGVvdGhlcnMnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5zaG93QWxsLFxyXG4gICAgICAgICAgcm9sZTogJ3VuaGlkZSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5xdWl0LFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDb21tYW5kK1EnLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLnF1aXQoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0pO1xyXG4gICAgY29uc3Qgd2luZG93TWVudSA9IHRlbXBsYXRlLmZpbmQoZnVuY3Rpb24gKG0pIHtcclxuICAgICAgcmV0dXJuIG0ucm9sZSA9PT0gJ3dpbmRvdyc7XHJcbiAgICB9KTtcclxuICAgIGlmICh3aW5kb3dNZW51KSB7XHJcbiAgICAgIHdpbmRvd01lbnUuc3VibWVudS5wdXNoKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5icmluZ0FsbFRvRnJvbnQsXHJcbiAgICAgICAgICByb2xlOiAnZnJvbnQnXHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgbWVudSA9IE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUodGVtcGxhdGUpO1xyXG4gIE1lbnUuc2V0QXBwbGljYXRpb25NZW51KG1lbnUpO1xyXG59XHJcbiIsIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMi0wNy0yMyAxMzo0MDozMVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA3LTIzIDIwOjAwOjMyXHJcbiAqIEBEZXNjcmlwdGlvbjog5Li756qX5Y+j6K6+572uXHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxtYWluV2luZG93LnRzXHJcbiAqL1xyXG5pbXBvcnQgeyBCcm93c2VyV2luZG93IH0gZnJvbSAnZWxlY3Ryb24nO1xyXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IFVSTCB9IGZyb20gJ3VybCc7XHJcblxyXG5pbXBvcnQgeyBtZW51SW5pdCB9IGZyb20gJy9AL2FwcC1tZW51JztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpIHtcclxuICBjb25zdCBicm93c2VyV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xyXG4gICAgbWluSGVpZ2h0OiAxODAsXHJcbiAgICBtaW5XaWR0aDogMzIwLFxyXG4gICAgd2lkdGg6IDE2MDAsXHJcbiAgICBoZWlnaHQ6IDgwMCxcclxuICAgIHNob3c6IGZhbHNlLCAvLyDkvb/nlKjkuovku7YgcmVhZHktdG8tc2hvdyDmnaXlsZXnpLrnqpflj6NcclxuICAgIC8vIHdlYua4suafk+i/m+eoi+iuvue9rlxyXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcclxuICAgICAgLy8gbm9kZUludGVncmF0aW9uOiBmYWxzZSwgIC8v6buY6K6k5LiN5byA5ZCvbm9kZembhuaIkO+8jOS4uuS6huWuieWFqPCfmIpcclxuICAgICAgLy8gY29udGV4dElzb2xhdGlvbjogdHJ1ZSwgLy/pu5jorqTlvIDlkK/kuIrkuIvmlofpmpTnprvvvIzkuLrkuoblronlhajwn5iKXHJcbiAgICAgIHdlYlNlY3VyaXR5OiB0cnVlLCAvLyDlhbPpl63ot6jln5/pmZDliLbvvIzkuLrkuoblronlhajwn5iKXHJcbiAgICAgIHdlYnZpZXdUYWc6IGZhbHNlLCAvLyDkuI3nn6XpgZPmmK/llaXvvIzlhbPlsLHlrozkuovkuobvvIzkuLrkuoblronlhajwn5iKXHJcbiAgICAgIHByZWxvYWQ6IGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vcHJlbG9hZC9kaXN0L2luZGV4LmNqcycpXHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgLyoqXHJcbiAgICogSWYgeW91IGluc3RhbGwgYHNob3c6IHRydWVgIHRoZW4gaXQgY2FuIGNhdXNlIGlzc3VlcyB3aGVuIHRyeWluZyB0byBjbG9zZSB0aGUgd2luZG93LlxyXG4gICAqIFVzZSBgc2hvdzogZmFsc2VgIGFuZCBsaXN0ZW5lciBldmVudHMgYHJlYWR5LXRvLXNob3dgIHRvIGZpeCB0aGVzZSBpc3N1ZXMuXHJcbiAgICpcclxuICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi9lbGVjdHJvbi9pc3N1ZXMvMjUwMTJcclxuICAgKi9cclxuXHJcbiAgYnJvd3NlcldpbmRvdy5vbigncmVhZHktdG8tc2hvdycsICgpID0+IHtcclxuICAgIG1lbnVJbml0KGJyb3dzZXJXaW5kb3cpO1xyXG4gICAgYnJvd3NlcldpbmRvdz8uc2hvdygpO1xyXG4gICAgLy8g5aaC5p6c5pivZGV2546v5aKD77yM6aG65bim5omT5byAZGV2dG9vbHNcclxuICAgIGlmIChpbXBvcnQubWV0YS5lbnYuREVWKSB7XHJcbiAgICAgIGJyb3dzZXJXaW5kb3c/LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvKipcclxuICAgKiBVUkwgZm9yIG1haW4gd2luZG93LlxyXG4gICAqIFZpdGUgZGV2IHNlcnZlciBmb3IgZGV2ZWxvcG1lbnQuXHJcbiAgICogYGZpbGU6Ly8uLi9yZW5kZXJlci9pbmRleC5odG1sYCBmb3IgcHJvZHVjdGlvbiBhbmQgdGVzdFxyXG4gICAqL1xyXG4gIGNvbnN0IHBhZ2VVcmwgPVxyXG4gICAgaW1wb3J0Lm1ldGEuZW52LkRFViAmJiBpbXBvcnQubWV0YS5lbnYuVklURV9ERVZfU0VSVkVSX1VSTCAhPT0gdW5kZWZpbmVkID8gaW1wb3J0Lm1ldGEuZW52LlZJVEVfREVWX1NFUlZFUl9VUkwgOiBuZXcgVVJMKCcuLi9yZW5kZXJlci9kaXN0L2luZGV4Lmh0bWwnLCAnZmlsZTovLycgKyBfX2Rpcm5hbWUpLnRvU3RyaW5nKCk7XHJcblxyXG4gIGF3YWl0IGJyb3dzZXJXaW5kb3cubG9hZFVSTChwYWdlVXJsKTtcclxuXHJcbiAgcmV0dXJuIGJyb3dzZXJXaW5kb3c7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXN0b3JlIGV4aXN0aW5nIEJyb3dzZXJXaW5kb3cgb3IgQ3JlYXRlIG5ldyBCcm93c2VyV2luZG93XHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzdG9yZU9yQ3JlYXRlV2luZG93KCkge1xyXG4gIGxldCB3aW5kb3cgPSBCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKS5maW5kKCh3KSA9PiAhdy5pc0Rlc3Ryb3llZCgpKTtcclxuXHJcbiAgaWYgKHdpbmRvdyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB3aW5kb3cgPSBhd2FpdCBjcmVhdGVXaW5kb3coKTtcclxuICB9XHJcblxyXG4gIGlmICh3aW5kb3cuaXNNaW5pbWl6ZWQoKSkge1xyXG4gICAgd2luZG93LnJlc3RvcmUoKTtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5mb2N1cygpO1xyXG59XHJcbiIsIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMi0wNy0yMyAxMzo0MDozMVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA3LTI5IDIyOjEwOjE5XHJcbiAqIEBEZXNjcmlwdGlvbjogZWxlY3Ryb27nmoTlupTnlKjlkK/liqhcclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxtYWluXFxzcmNcXGluZGV4LnRzXHJcbiAqL1xyXG5pbXBvcnQgeyBhcHAsIEJyb3dzZXJXaW5kb3csIHByb3RvY29sIH0gZnJvbSAnZWxlY3Ryb24nO1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBpcGNNYWluQ29sbGVjdGlvbiB9IGZyb20gJy4vaXBjLW1lc3NhZ2UnO1xyXG5cclxuaW1wb3J0IHsgcmVzdG9yZU9yQ3JlYXRlV2luZG93IH0gZnJvbSAnL0AvbWFpbldpbmRvdyc7XHJcblxyXG4vKipcclxuICog5Y+q5oul5pyJ5LiA5Liq5a6e5L6L77yM6Ziy5q2i5pyJ5aSa5Liq5a6e5L6LXHJcbiAqL1xyXG5jb25zdCBpc1NpbmdsZUluc3RhbmNlID0gYXBwLnJlcXVlc3RTaW5nbGVJbnN0YW5jZUxvY2soKTtcclxuaWYgKCFpc1NpbmdsZUluc3RhbmNlKSB7XHJcbiAgYXBwLnF1aXQoKTtcclxuICBwcm9jZXNzLmV4aXQoMCk7XHJcbn1cclxuYXBwLm9uKCdzZWNvbmQtaW5zdGFuY2UnLCByZXN0b3JlT3JDcmVhdGVXaW5kb3cpO1xyXG4vKipcclxuICog5YWz6Zet56Gs5Lu25Yqg6YCf77yM6L+Z5Liq5pyJ5b6F5ZWG5qa377yM6Zmk6Z2e5pyJ5YW85a655oCn6Zeu6aKYXHJcbiAqL1xyXG4vLyBhcHAuZGlzYWJsZUhhcmR3YXJlQWNjZWxlcmF0aW9uKCk7XHJcblxyXG4vKipcclxuICog5YWz6Zet56qX5Y+j77yM5omA5pyJ6L+b56iL6YO96YCA5Ye6XHJcbiAqL1xyXG5hcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xyXG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xyXG4gICAgYXBwLnF1aXQoKTtcclxuICB9XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgaHR0cHM6Ly93d3cuZWxlY3Ryb25qcy5vcmcvZG9jcy92MTQteC15L2FwaS9hcHAjZXZlbnQtYWN0aXZhdGUtbWFjb3MgRXZlbnQ6ICdhY3RpdmF0ZSdcclxuICovXHJcbmFwcC5vbignYWN0aXZhdGUnLCAoKSA9PiB7XHJcbiAgaWYgKEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmxlbmd0aCA9PT0gMCkgcmVzdG9yZU9yQ3JlYXRlV2luZG93KCk7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIOWIm+W7uuW6lOeUqOeql+WPo+W9k+WQjuWPsOi/m+eoi+W3sue7j+WHhuWkh+WlvVxyXG4gKi9cclxuYXBwXHJcbiAgLndoZW5SZWFkeSgpXHJcbiAgLnRoZW4oKCkgPT4ge1xyXG4gICAgcmVzdG9yZU9yQ3JlYXRlV2luZG93KCk7XHJcbiAgICBpcGNNYWluQ29sbGVjdGlvbjtcclxuICAgIHByb3RvY29sLnJlZ2lzdGVyRmlsZVByb3RvY29sKCdhdG9tJywgKHJlcXVlc3QsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgIGNvbnN0IHVybCA9IHJlcXVlc3QudXJsLnJlcGxhY2UoL15hdG9tOlxcL1xcLy8sICcnKTtcclxuICAgICAgLy8gRGVjb2RlIFVSTCB0byBwcmV2ZW50IGVycm9ycyB3aGVuIGxvYWRpbmcgZmlsZW5hbWVzIHdpdGggVVRGLTggY2hhcnMgb3IgY2hhcnMgbGlrZSBcIiNcIlxyXG4gICAgICBjb25zdCBkZWNvZGVkVXJsID0gZGVjb2RlVVJJKHVybCk7IC8vIE5lZWRlZCBpbiBjYXNlIFVSTCBjb250YWlucyBzcGFjZXNcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gY2FsbGJhY2soeyBwYXRoOiBwYXRoLm5vcm1hbGl6ZShkZWNvZGVkVXJsKSB9KTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdFUlJPUjogcmVnaXN0ZXJMb2NhbFJlc291cmNlUHJvdG9jb2w6IENvdWxkIG5vdCBnZXQgZmlsZSBwYXRoOicsIGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuY2F0Y2goKGUpID0+IGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCBjcmVhdGUgd2luZG93OicsIGUpKTtcclxuXHJcbi8qKlxyXG4gKiDlpoLmnpzmmK/mtYvor5Xnjq/looPvvIzlronoo4VWdWUuanPnmoTosIPor5Xmj5Lku7ZcclxuICovXHJcbmlmIChpbXBvcnQubWV0YS5lbnYuREVWKSB7XHJcbiAgYXBwXHJcbiAgICAud2hlblJlYWR5KClcclxuICAgIC50aGVuKCgpID0+IGltcG9ydCgnZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyJykpXHJcbiAgICAudGhlbigoeyBkZWZhdWx0OiBpbnN0YWxsRXh0ZW5zaW9uLCBWVUVKUzNfREVWVE9PTFMgfSkgPT5cclxuICAgICAgaW5zdGFsbEV4dGVuc2lvbihWVUVKUzNfREVWVE9PTFMsIHtcclxuICAgICAgICBsb2FkRXh0ZW5zaW9uT3B0aW9uczoge1xyXG4gICAgICAgICAgYWxsb3dGaWxlQWNjZXNzOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgKVxyXG4gICAgLmNhdGNoKChlKSA9PiBjb25zb2xlLmVycm9yKCdGYWlsZWQgaW5zdGFsbCBleHRlbnNpb246JywgZSkpO1xyXG59XHJcblxyXG4vKipcclxuICog5Zyo55Sf5Lqn5qih5byP5LiL77yM5qOA5p+l5bqU55So55qE54mI5pys5pu05pawXHJcbiAqL1xyXG5pZiAoaW1wb3J0Lm1ldGEuZW52LlBST0QpIHtcclxuICBhcHBcclxuICAgIC53aGVuUmVhZHkoKVxyXG4gICAgLnRoZW4oKCkgPT4gaW1wb3J0KCdlbGVjdHJvbi11cGRhdGVyJykpXHJcbiAgICAudGhlbigoeyBhdXRvVXBkYXRlciB9KSA9PiBhdXRvVXBkYXRlci5jaGVja0ZvclVwZGF0ZXNBbmROb3RpZnkoKSlcclxuICAgIC5jYXRjaCgoZSkgPT4gY29uc29sZS5lcnJvcignRmFpbGVkIGNoZWNrIHVwZGF0ZXM6JywgZSkpO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJpcGNNYWluIiwicGF0aCIsImFwcCIsIk1ldGFXZWJsb2ciLCJTdG9yZSIsImxhbmd1YWdlLnpoIiwibGFuZ3VhZ2UuZW4iLCJkaWFsb2ciLCJzaGVsbCIsIk1lbnUiLCJCcm93c2VyV2luZG93Iiwiam9pbiIsInByb3RvY29sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVlBLElBQUk7QUFrQkpBLFNBQUEsUUFBUSxHQUFHLFdBQVcsU0FBVSxPQUFP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
