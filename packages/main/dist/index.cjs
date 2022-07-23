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
  event.returnValue = "./";
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
  light: "Github",
  dark: "Dark",
  splendor: "Splendor",
  wysiwyg: "Wysiwyg"
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
  light: "Github",
  dark: "Night",
  splendor: "Splendor",
  wysiwyg: "Wysiwyg"
};
const store$1 = new Store__default.default({ name: "settings" });
function getLanguage() {
  return store$1.get("language", "zh");
}
function setLanguage(lang) {
  return store$1.set("language", lang);
}
const store = new Store__default.default({ name: "settings" });
function getTheme() {
  return store.get("theme", "github");
}
function setTheme(theme) {
  return store.set("theme", theme);
}
function menuInit(mainWindow) {
  const webContents = mainWindow.webContents;
  function setLanguage$1(lang2) {
    setLanguage(lang2);
    webContents.send("menu.language", lang2);
    menuInit(mainWindow);
  }
  function setTheme$1(theme) {
    setTheme(theme);
    webContents.send("menu.theme", theme);
    menuInit(mainWindow);
  }
  const lang = getLanguage();
  const l = lang === "zh" ? zh : en;
  const t = getTheme();
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
              type: "checkbox",
              checked: lang === "zh",
              click: function() {
                setLanguage$1("zh");
              }
            },
            {
              label: "English",
              type: "checkbox",
              checked: lang === "en",
              click: function() {
                setLanguage$1("en");
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
          type: "checkbox",
          checked: t === "github",
          click: function() {
            setTheme$1("github");
          }
        },
        {
          label: l.dark,
          type: "checkbox",
          checked: t === "dark",
          click: function() {
            setTheme$1("dark");
          }
        },
        {
          label: l.splendor,
          type: "checkbox",
          checked: t === "splendor",
          click: function() {
            setTheme$1("splendor");
          }
        },
        {
          label: l.wysiwyg,
          type: "checkbox",
          checked: t === "wysiwyg",
          click: function() {
            setTheme$1("wysiwyg");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6WyIuLi9zcmMvaXBjLW1lc3NhZ2UudHMiLCIuLi9zcmMvYXBwLW1lbnUvbWVudS1sYW5nLnRzIiwiLi4vc3JjL2FwcC1tZW51L2xhbmd1YWdlLXN0b3JlLnRzIiwiLi4vc3JjL2FwcC1tZW51L3RoZW1lLXN0b3JlLnRzIiwiLi4vc3JjL2FwcC1tZW51L2luZGV4LnRzIiwiLi4vc3JjL21haW5XaW5kb3cudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQEF1dGhvcjogc3p4XHJcbiAqIEBEYXRlOiAyMDIxLTA3LTA1IDIwOjU3OjEwXHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDctMjMgMjI6MDc6MjZcclxuICogQERlc2NyaXB0aW9uOlxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcaXBjLW1lc3NhZ2UudHNcclxuICovXHJcblxyXG5pbXBvcnQgeyBhcHAsIGlwY01haW4gfSBmcm9tICdlbGVjdHJvbic7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgU3RvcmUgZnJvbSAnZWxlY3Ryb24tc3RvcmUnO1xyXG5pbXBvcnQgTWV0YVdlYmxvZyBmcm9tICdtZXRhd2VibG9nLWFwaSc7XHJcbmxldCBtZXRhd2VibG9nOiBNZXRhV2VibG9nO1xyXG5cclxuLypcclxuICAvLyDlrp7pqozmgKfotKhcclxuICBpcGNNYWluLm9uKCd0b01haW4nLCAoZXZlbnQsIGFyZ3MpID0+IHtcclxuICAgIC8vIGV2ZW50LnJlcGx5KCdmcm9tTWFpbicsICflkI7mkqTmraU4ODgnKTtcclxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZnJvbU1haW4nLCAn5ZCO5pKk5q2lNzc3Jyk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIOeEtuWQjuWcqOa4suafk+i/m+eoi+S4reS9v+eUqOS4i+mdoueahOi/meauteivreWPpVxyXG4gIC8vIOS7juS4u+i/m+eoi+mAmumBk0Zyb21NYWlu5o6l5Y+X5L+h5oGvXHJcbiAgaXBjLnJlY2VpdmUoJ2Zyb21NYWluJywgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coYFJlY2VpdmVkICR7ZGF0YX0gZnJvbSBtYWluIHByb2Nlc3NgKTtcclxuICB9KTtcclxuICAvLyDlj5HpgIHkv6Hmga/nu5nkuLvov5vnqIvpgJrpgZN0b01haW5cclxuICBpcGMuc2VuZCgndG9NYWluJywgJ3NvbWUgZGF0YScpO1xyXG4qL1xyXG4vLyDojrflvpflvZPliY3lronoo4XljIXot6/lvoRcclxuaXBjTWFpbi5vbignZXhlUGF0aCcsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgLy8gZXZlbnQucmVwbHkoJ2V4ZVBhdGgnLCBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKTtcclxufSk7XHJcblxyXG5pcGNNYWluLm9uKCdhZGRSZWNlbnREb2N1bWVudCcsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgLy8gZXZlbnQucmVwbHkoJ2V4ZVBhdGgnLCBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKSk7XHJcbiAgY29uc29sZS5sb2coYXJnKTtcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IGFwcC5hZGRSZWNlbnREb2N1bWVudChhcmcpO1xyXG59KTtcclxuXHJcbi8vIOiOt+W+l+W9k+WJjeeJiOacrOWPt1xyXG5pcGNNYWluLm9uKCd2ZXJzaW9uJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyAgIGV2ZW50LnJlcGx5KCd2ZXJzaW9uJywgYXBwLmdldFZlcnNpb24oKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBhcHAuZ2V0VmVyc2lvbigpO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ3BsYXRmb3JtJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyAgIGV2ZW50LnJlcGx5KCd2ZXJzaW9uJywgYXBwLmdldFZlcnNpb24oKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBwcm9jZXNzLnBsYXRmb3JtO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ2FyZ3YnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIC8vICAgZXZlbnQucmVwbHkoJ3ZlcnNpb24nLCBhcHAuZ2V0VmVyc2lvbigpKTtcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IHByb2Nlc3MuYXJndjtcclxufSk7XHJcblxyXG5pcGNNYWluLm9uKCdwcm9jZXNzLnZlcnNpb25zJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyAgIGV2ZW50LnJlcGx5KCd2ZXJzaW9uJywgYXBwLmdldFZlcnNpb24oKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBwcm9jZXNzLnZlcnNpb25zO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ19fc3RhdGljJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyBldmVudC5yZXBseSgnZXhlUGF0aCcsIHBhdGguZGlybmFtZShhcHAuZ2V0UGF0aCgnZXhlJykpKTtcclxuICAvLyBldmVudC5yZXR1cm5WYWx1ZSA9IF9fc3RhdGljO1xyXG4gIC8vIGV2ZW50LnJldHVyblZhbHVlID0gJy4vJztcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9ICcuLyc7XHJcbn0pO1xyXG5cclxuLy8g5Lit6L2s5raI5oGv77yM5riy5p+T6L+b56iL5Y+R57uZ5Li76L+b56iL77yM5Li76L+b56iL5YaN5Y+R57uZ5riy5p+T6L+b56iLXHJcbmlwY01haW4ub24oJ21lbnUuc2V0dGluZ3MnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIGV2ZW50LnJlcGx5KCdtZW51LnNldHRpbmdzJywgYXJnKTtcclxufSk7XHJcblxyXG4vLyBpcGNNYWluLm9uKCdtZW51LnNob3dmaWxlJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuLy8gICBldmVudC5yZXBseSgnbWVudS5zaG93ZmlsZScsIGFyZyk7XHJcbi8vIH0pO1xyXG5cclxuLy8g5Lit6L2s5raI5oGv77yM5riy5p+T6L+b56iL5Y+R57uZ5Li76L+b56iL77yM5Li76L+b56iL5YaN5Y+R57uZ5riy5p+T6L+b56iLXHJcbmlwY01haW4ub24oJ21lbnUuc2FtcGxlJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICBldmVudC5yZXBseSgnbWVudS5zYW1wbGUnLCBhcmcpO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ29uZHJhZ3N0YXJ0JywgKGV2ZW50LCBmaWxlUGF0aCkgPT4ge1xyXG4gIGV2ZW50LnNlbmRlci5zdGFydERyYWcoe1xyXG4gICAgZmlsZTogZmlsZVBhdGgsXHJcbiAgICBpY29uOiAnL3BhdGgvdG8vaWNvbi5wbmcnXHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuLy8g5Lit6L2s5raI5oGv77yM5riy5p+T6L+b56iL5Y+R57uZ5Li76L+b56iL77yM5Li76L+b56iL5YaN5Y+R57uZ5riy5p+T6L+b56iLXHJcbmlwY01haW4ub24oJ25ldy1tZWRpYS1vYmplY3QnLCBhc3luYyBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIHRyeSB7XHJcbiAgICBtZXRhd2VibG9nID0gbmV3IE1ldGFXZWJsb2coYXJnWzddKTtcclxuICAgIGlmIChhcmdbMF0gPT0gdHJ1ZSkge1xyXG4gICAgICBhcmdbNl0gPSBCdWZmZXIuZnJvbShhcmdbNl0sICdiYXNlNjQnKTtcclxuICAgIH1cclxuICAgIGNvbnN0IG1lZGlhT2JqZWN0ID0ge1xyXG4gICAgICBuYW1lOiBhcmdbNF0sXHJcbiAgICAgIHR5cGU6IGFyZ1s1XSxcclxuICAgICAgYml0czogYXJnWzZdLFxyXG4gICAgICBvdmVyd3JpdGU6IHRydWVcclxuICAgIH07XHJcbiAgICAvLyBjb25zdCBtZXRhID0gbmV3IE1ldGFXZWJsb2coYXJnWzBdKTtcclxuICAgIGNvbnN0IHJlczogYW55ID0gYXdhaXQgbWV0YXdlYmxvZy5uZXdNZWRpYU9iamVjdChhcmdbMV0sIGFyZ1syXSwgYXJnWzNdLCBtZWRpYU9iamVjdCk7XHJcbiAgICBldmVudC5yZXR1cm5WYWx1ZSA9IFt0cnVlLCByZXMudXJsXTtcclxuICB9IGNhdGNoIChlcnI6IGFueSkge1xyXG4gICAgZXZlbnQucmV0dXJuVmFsdWUgPSBbZmFsc2UsIGVyci50b1N0cmluZygpXTtcclxuICB9XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5vbignbmV3LW1ldGF3ZWJsb2cnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIG1ldGF3ZWJsb2cgPSBuZXcgTWV0YVdlYmxvZyhhcmcpO1xyXG4gIGV2ZW50LnJldHVyblZhbHVlID0gdHJ1ZTtcclxufSk7XHJcblxyXG4vLyBpcGNNYWluLm9uKCduZXctbWVkaWEtb2JqZWN0JywgYXN5bmMgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuLy8gICBjb25zb2xlLmxvZygnbWV0YScsIG1ldGEpO1xyXG4vLyAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG1ldGEubmV3TWVkaWFPYmplY3QoYmxvZ0lkLCB1c2VybmFtZSwgcGFzc3dvcmQsIG1lZGlhT2JqZWN0KTtcclxuLy8gICBjb25zb2xlLmxvZygnbmV3LW1lZGlhLW9iamVjdDonLCByZXN1bHQpO1xyXG4vLyAgIGV2ZW50LnJlcGx5KCduZXctbWVkaWEtb2JqZWN0JywgcmVzdWx0KTtcclxuLy8gfSk7XHJcblxyXG5TdG9yZS5pbml0UmVuZGVyZXIoKTtcclxuXHJcbmV4cG9ydCB7IGlwY01haW4gYXMgaXBjTWFpbkNvbGxlY3Rpb24gfTtcclxuIiwiLypcclxuICogQEF1dGhvcjogc3p4XHJcbiAqIEBEYXRlOiAyMDIxLTA3LTA0IDE5OjAwOjU4XHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDctMjMgMTk6Mzg6MDlcclxuICogQERlc2NyaXB0aW9uOiDnqpflj6PnmoTlpJror63oqIDmlK/mjIFcclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxtYWluXFxzcmNcXG1lbnUtbGFuZy50c1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjb25zdCBlbiA9IHtcclxuICBmaWxlOiAnRmlsZScsXHJcbiAgb3BlbjogJ09wZW4nLFxyXG4gIG9wZW5SZWNlbnQ6ICdPcGVuIFJlY2VudCcsXHJcbiAgY2xlYXJSZWNlbnQ6ICdDbGVhcicsXHJcbiAgc2F2ZTogJ1NhdmUnLFxyXG4gIHB1Ymxpc2g6ICdQdWJsaXNoJyxcclxuICBsYW5ndWFnZTogJ0xhbmd1YWdlJyxcclxuICBzZXR0aW5nczogJ1NldHRpbmdzJyxcclxuICBlZGl0OiAnRWRpdCcsXHJcbiAgdW5kbzogJ1VuZG8nLFxyXG4gIHJlZG86ICdSZWRvJyxcclxuICBjdXQ6ICdDdXQnLFxyXG4gIGNvcHk6ICdDb3B5JyxcclxuICBwYXN0ZTogJ1Bhc3RlJyxcclxuICBzZWxlY3RBbGw6ICdTZWxlY3QgQWxsJyxcclxuICAvLyB2aWV3OiAnVmlldycsXHJcbiAgcmVsb2FkOiAnUmVsb2FkJyxcclxuICBmaWxlVHJlZTogJ0ZpbGUgdHJlZScsXHJcbiAgY2xvc2VUYWI6ICdDbG9zZSBDdXJyZW50IEZpbGUnLFxyXG4gIHJlbG9hZEZpbGU6ICdSZWxvYWQgRmlsZScsXHJcbiAgdG9nZ2xlRnVsbFNjcmVlbjogJ1RvZ2dsZSBGdWxsIFNjcmVlbicsXHJcbiAgdG9nZ2xlRGV2VG9vbHM6ICdUb2dnbGUgRGV2ZWxvcGVyIFRvb2xzJyxcclxuICB3aW5kb3c6ICdXaW5kb3cnLFxyXG4gIG1pbmltaXplOiAnTWluaW1pemUnLFxyXG4gIGNsb3NlOiAnQ2xvc2UnLFxyXG4gIGhlbHA6ICdIZWxwJyxcclxuICBsZWFybk1vcmU6ICdMZWFybiBNb3JlJyxcclxuICBvcGVuV2VsY29tZVBhZ2U6ICdPcGVuIFdlbGNvbWUgUGFnZScsXHJcbiAgdmlld1NhbXBsZUZpbGU6ICdWaWV3IFNhbXBsZSBGaWxlJyxcclxuICB0dXRvcmlhbHM6ICdUdXRvcmlhbHMnLFxyXG4gIGFib3V0OiAnQWJvdXQgJyxcclxuICBzZXJ2aWNlczogJ1NlcnZpY2VzJyxcclxuICBoaWRlOiAnSGlkZSAnLFxyXG4gIGhpZGVPdGhlcnM6ICdIaWRlIE90aGVycycsXHJcbiAgc2hvd0FsbDogJ1Nob3cgQWxsJyxcclxuICBxdWl0OiAnUXVpdCcsXHJcbiAgYnJpbmdBbGxUb0Zyb250OiAnQnJpbmcgQWxsIHRvIEZyb250JyxcclxuXHJcbiAgdGhlbWU6ICdUaGVtZScsXHJcbiAgbGlnaHQ6ICdHaXRodWInLFxyXG4gIGRhcms6ICdEYXJrJyxcclxuICBzcGxlbmRvcjogJ1NwbGVuZG9yJyxcclxuICB3eXNpd3lnOiAnV3lzaXd5ZydcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB6aCA9IHtcclxuICBmaWxlOiAn5paH5Lu2JyxcclxuICBvcGVuOiAn5omT5byAJyxcclxuICBvcGVuUmVjZW50OiAn5omT5byA5pyA6L+R5L2/55So55qEJyxcclxuICBjbGVhclJlY2VudDogJ+a4hemZpCcsXHJcbiAgc2F2ZTogJ+S/neWtmCcsXHJcbiAgcHVibGlzaDogJ+WPkeW4gycsXHJcbiAgbGFuZ3VhZ2U6ICfor63oqIAnLFxyXG4gIHNldHRpbmdzOiAn6K6+572uJyxcclxuICBlZGl0OiAn57yW6L6RJyxcclxuICB1bmRvOiAn5pKk6ZSAJyxcclxuICByZWRvOiAn6YeN5YGaJyxcclxuICBjdXQ6ICfliarliIcnLFxyXG4gIGNvcHk6ICflpI3liLYnLFxyXG4gIHBhc3RlOiAn57KY6LS0JyxcclxuICBzZWxlY3RBbGw6ICflhajpgIknLFxyXG4gIC8vIHZpZXc6ICfmmL7npLonLFxyXG4gIHJlbG9hZDogJ+mHjeaWsOWKoOi9vScsXHJcbiAgZmlsZVRyZWU6ICfmlofku7bliJfooagnLFxyXG4gIGNsb3NlVGFiOiAn5YWz6Zet5b2T5YmN5paH5Lu2JyxcclxuICByZWxvYWRGaWxlOiAn6YeN5paw6L295YWl5paH5Lu2JyxcclxuICB0b2dnbGVGdWxsU2NyZWVuOiAn5YiH5o2i5YWo5bGPJyxcclxuICB0b2dnbGVEZXZUb29sczogJ+WIh+aNouW8gOWPkeiAheW3peWFtycsXHJcbiAgd2luZG93OiAn56qX5Y+jJyxcclxuICBtaW5pbWl6ZTogJ+acgOWwj+WMlicsXHJcbiAgY2xvc2U6ICflhbPpl60nLFxyXG4gIGhlbHA6ICfluK7liqknLFxyXG4gIGxlYXJuTW9yZTogJ+S6huino+abtOWkmicsXHJcbiAgb3BlbldlbGNvbWVQYWdlOiAn5omT5byA5qyi6L+O6aG1JyxcclxuICB2aWV3U2FtcGxlRmlsZTogJ+afpeeci+ekuuS+i+aWh+ahoycsXHJcbiAgdHV0b3JpYWxzOiAn5L2/55So5pWZ56iLJyxcclxuICBhYm91dDogJ+WFs+S6jicsXHJcbiAgc2VydmljZXM6ICfmnI3liqEnLFxyXG4gIGhpZGU6ICfpmpDol48nLFxyXG4gIGhpZGVPdGhlcnM6ICfpmpDol4/lhbbku5YnLFxyXG4gIHNob3dBbGw6ICfmmL7npLrlhajpg6gnLFxyXG4gIHF1aXQ6ICfpgIDlh7onLFxyXG4gIGJyaW5nQWxsVG9Gcm9udDogJ+WJjee9ruWFqOmDqOeql+WPoycsXHJcbiAgdGhlbWU6ICfkuLvpopgnLFxyXG4gIGxpZ2h0OiAnR2l0aHViJyxcclxuICBkYXJrOiAnTmlnaHQnLFxyXG4gIHNwbGVuZG9yOiAnU3BsZW5kb3InLFxyXG4gIHd5c2l3eWc6ICdXeXNpd3lnJ1xyXG59O1xyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjEtMDctMDQgMTg6NDc6NDRcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wNy0yMyAxOTo1NTo0NFxyXG4gKiBARGVzY3JpcHRpb246IGVsZWN0cm9uLXNvdHJl5a2Y5YKo6K+t6KiA5YC8XHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxsYW5ndWFnZS1zdG9yZS50c1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBTdG9yZSBmcm9tICdlbGVjdHJvbi1zdG9yZSc7XHJcblxyXG4vLyDlrZjlgqjnmoTmlofku7blkI3kuLpzZXR0aW5nc1xyXG5jb25zdCBzdG9yZSA9IG5ldyBTdG9yZSh7IG5hbWU6ICdzZXR0aW5ncycgfSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGFuZ3VhZ2UoKSB7XHJcbiAgcmV0dXJuIHN0b3JlLmdldCgnbGFuZ3VhZ2UnLCAnemgnKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldExhbmd1YWdlKGxhbmc6IHN0cmluZykge1xyXG4gIHJldHVybiBzdG9yZS5zZXQoJ2xhbmd1YWdlJywgbGFuZyk7XHJcbn1cclxuIiwiLypcclxuICogQEF1dGhvcjogc3p4XHJcbiAqIEBEYXRlOiAyMDIyLTA3LTE5IDE0OjU0OjEwXHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDctMjMgMTk6NTY6MTRcclxuICogQERlc2NyaXB0aW9uOlxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcdGhlbWUtc3RvcmUudHNcclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBTdG9yZSBmcm9tICdlbGVjdHJvbi1zdG9yZSc7XHJcblxyXG4vLyDlrZjlgqjnmoTmlofku7blkI3kuLpzZXR0aW5nc1xyXG5jb25zdCBzdG9yZSA9IG5ldyBTdG9yZSh7IG5hbWU6ICdzZXR0aW5ncycgfSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGhlbWUoKSB7XHJcbiAgcmV0dXJuIHN0b3JlLmdldCgndGhlbWUnLCAnZ2l0aHViJyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRUaGVtZSh0aGVtZTogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHN0b3JlLnNldCgndGhlbWUnLCB0aGVtZSk7XHJcbn1cclxuIiwiLypcclxuICogQEF1dGhvcjogc3p4XHJcbiAqIEBEYXRlOiAyMDIyLTA3LTIzIDE5OjU3OjMxXHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDctMjMgMjA6MDA6MTVcclxuICogQERlc2NyaXB0aW9uOlxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcYXBwLW1lbnVcXGluZGV4LnRzXHJcbiAqL1xyXG4vKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjEtMDctMDQgMTg6NDI6MTVcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wNy0yMyAxOTo1NjozMlxyXG4gKiBARGVzY3JpcHRpb246IOiPnOWNleagj+iuvue9rlxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcYXBwLW1lbnUudHNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL2RpYWxvZ+aooeWdl+aPkOS+m+S6hmFwaeadpeWxleekuuWOn+eUn+eahOezu+e7n+Wvueivneahhu+8jOS+i+WmguaJk+W8gOaWh+S7tuahhu+8jGFsZXJ05qGGXHJcbmltcG9ydCB7IE1lbnUsIGFwcCwgZGlhbG9nLCBzaGVsbCwgQnJvd3NlcldpbmRvdyB9IGZyb20gJ2VsZWN0cm9uJztcclxuXHJcbmltcG9ydCAqIGFzIGxhbmd1YWdlIGZyb20gJy4vbWVudS1sYW5nJztcclxuaW1wb3J0ICogYXMgbGFuZ1N0b3JlIGZyb20gJy4vbGFuZ3VhZ2Utc3RvcmUnO1xyXG5pbXBvcnQgKiBhcyB0aGVtZVN0b3JlIGZyb20gJy4vdGhlbWUtc3RvcmUnO1xyXG5cclxuLy8g5Yqg6L296I+c5Y2V5qCPXHJcbmV4cG9ydCBmdW5jdGlvbiBtZW51SW5pdChtYWluV2luZG93OiBCcm93c2VyV2luZG93KSB7XHJcbiAgLy8gd2ViQ29udGVudHPlroPotJ/otKPmuLLmn5PlubbmjqfliLbnvZHpobVcclxuICBjb25zdCB3ZWJDb250ZW50cyA9IG1haW5XaW5kb3cud2ViQ29udGVudHM7XHJcblxyXG4gIC8vIOiuvue9ruivreiogFxyXG4gIGZ1bmN0aW9uIHNldExhbmd1YWdlKGxhbmc6IHN0cmluZykge1xyXG4gICAgbGFuZ1N0b3JlLnNldExhbmd1YWdlKGxhbmcpO1xyXG4gICAgLy8g6YCa6L+HIGNoYW5uZWwg5Y+R6YCB5byC5q2l5raI5oGv57uZ5riy5p+T6L+b56iLXHJcbiAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51Lmxhbmd1YWdlJywgbGFuZyk7XHJcbiAgICAvLyDph43mlrDmuLLmn5Poj5zljZXmoI9cclxuICAgIG1lbnVJbml0KG1haW5XaW5kb3cpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0VGhlbWUodGhlbWU6IHN0cmluZykge1xyXG4gICAgdGhlbWVTdG9yZS5zZXRUaGVtZSh0aGVtZSk7XHJcbiAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnRoZW1lJywgdGhlbWUpO1xyXG4gICAgbWVudUluaXQobWFpbldpbmRvdyk7XHJcbiAgfVxyXG5cclxuICAvLyDojrflj5bor63oqIDorr7nva5cclxuICBjb25zdCBsYW5nID0gbGFuZ1N0b3JlLmdldExhbmd1YWdlKCk7XHJcbiAgY29uc3QgbCA9IGxhbmcgPT09ICd6aCcgPyBsYW5ndWFnZS56aCA6IGxhbmd1YWdlLmVuO1xyXG5cclxuICBjb25zdCB0ID0gdGhlbWVTdG9yZS5nZXRUaGVtZSgpO1xyXG5cclxuICAvLyDoj5zljZXmoI/mqKHmnb9cclxuICBjb25zdCB0ZW1wbGF0ZTogYW55W10gPSBbXHJcbiAgICB7XHJcbiAgICAgIGxhYmVsOiBsLmZpbGUsXHJcbiAgICAgIC8v5paH5Lu25LiL5ouJ5bGe5oCnXHJcbiAgICAgIHN1Ym1lbnU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5vcGVuLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrTycsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkaWFsb2dcclxuICAgICAgICAgICAgICAuc2hvd09wZW5EaWFsb2cobWFpbldpbmRvdywgeyBwcm9wZXJ0aWVzOiBbJ29wZW5GaWxlJ10sIGZpbHRlcnM6IFt7IG5hbWU6ICdNYXJrZG93bicsIGV4dGVuc2lvbnM6IFsnbWQnXSB9XSB9KVxyXG4gICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQuY2FuY2VsZWQgJiYgcmVzdWx0LmZpbGVQYXRocy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUub3BlbicsIHJlc3VsdC5maWxlUGF0aHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAvLyDliIbpmpTmqKrnur9cclxuICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5zYXZlLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUycsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnNhdmUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnB1Ymxpc2gsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtQJyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUucHVibGlzaCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnNldHRpbmdzLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5zZXR0aW5ncycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwubGFuZ3VhZ2UsXHJcbiAgICAgICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBsYWJlbDogJ+eugOS9k+S4reaWhycsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcclxuICAgICAgICAgICAgICBjaGVja2VkOiBsYW5nID09PSAnemgnLFxyXG4gICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRMYW5ndWFnZSgnemgnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBsYWJlbDogJ0VuZ2xpc2gnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXHJcbiAgICAgICAgICAgICAgY2hlY2tlZDogbGFuZyA9PT0gJ2VuJyxcclxuICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0TGFuZ3VhZ2UoJ2VuJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgLy/nrKzkuozkuKroj5zljZVcclxuICAgIHtcclxuICAgICAgbGFiZWw6IGwuZWRpdCxcclxuICAgICAgc3VibWVudTogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnVuZG8sXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtaJyxcclxuICAgICAgICAgIHJvbGU6ICd1bmRvJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwucmVkbyxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnU2hpZnQrQ21kT3JDdHJsK1onLFxyXG4gICAgICAgICAgcm9sZTogJ3JlZG8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuY3V0LFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrWCcsXHJcbiAgICAgICAgICByb2xlOiAnY3V0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuY29weSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK0MnLFxyXG4gICAgICAgICAgcm9sZTogJ2NvcHknXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5wYXN0ZSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1YnLFxyXG4gICAgICAgICAgcm9sZTogJ3Bhc3RlJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuc2VsZWN0QWxsLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrQScsXHJcbiAgICAgICAgICByb2xlOiAnc2VsZWN0YWxsJ1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIC8vIOeql+WPo+iPnOWNlVxyXG4gICAge1xyXG4gICAgICBsYWJlbDogbC53aW5kb3csXHJcbiAgICAgIHJvbGU6ICd3aW5kb3cnLFxyXG4gICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuZmlsZVRyZWUsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdDdHJsK1NoaWZ0K0wnO1xyXG4gICAgICAgICAgfSkoKSxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUuc2hvd2ZpbGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnRvZ2dsZUZ1bGxTY3JlZW4sXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSByZXR1cm4gJ0N0cmwrQ29tbWFuZCtGJztcclxuICAgICAgICAgICAgZWxzZSByZXR1cm4gJ0YxMSc7XHJcbiAgICAgICAgICB9KSgpLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIChpdGVtOiBhbnksIGZvY3VzZWRXaW5kb3c6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoZm9jdXNlZFdpbmRvdykgZm9jdXNlZFdpbmRvdy5zZXRGdWxsU2NyZWVuKCFmb2N1c2VkV2luZG93LmlzRnVsbFNjcmVlbigpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLm1pbmltaXplLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrTScsXHJcbiAgICAgICAgICByb2xlOiAnbWluaW1pemUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5yZWxvYWRGaWxlLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdGNScsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnJlbG9hZGZpbGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmNsb3NlVGFiLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnQ3RybCtGNCc7XHJcbiAgICAgICAgICB9KSgpLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5jbG9zZXRhYicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnJlbG9hZCxcclxuICAgICAgICAgIC8vIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1InLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIChpdGVtOiBhbnksIGZvY3VzZWRXaW5kb3c6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoZm9jdXNlZFdpbmRvdykgZm9jdXNlZFdpbmRvdy5yZWxvYWQoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnRvZ2dsZURldlRvb2xzLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnQ3RybCtTaGlmdCtJJztcclxuICAgICAgICAgIH0pKCksXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKGl0ZW06IGFueSwgZm9jdXNlZFdpbmRvdzogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChmb2N1c2VkV2luZG93KSBmb2N1c2VkV2luZG93LnRvZ2dsZURldlRvb2xzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuY2xvc2UsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtXJyxcclxuICAgICAgICAgIHJvbGU6ICdjbG9zZSdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcblxyXG4gICAgLy8g5Li76aKY6I+c5Y2VXHJcbiAgICB7XHJcbiAgICAgIGxhYmVsOiBsLnRoZW1lLFxyXG4gICAgICByb2xlOiAndGhlbWUnLFxyXG4gICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwubGlnaHQsXHJcbiAgICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxyXG4gICAgICAgICAgY2hlY2tlZDogdCA9PT0gJ2dpdGh1YicsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZXRUaGVtZSgnZ2l0aHViJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5kYXJrLFxyXG4gICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcclxuICAgICAgICAgIGNoZWNrZWQ6IHQgPT09ICdkYXJrJyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNldFRoZW1lKCdkYXJrJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5zcGxlbmRvcixcclxuICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXHJcbiAgICAgICAgICBjaGVja2VkOiB0ID09PSAnc3BsZW5kb3InLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VGhlbWUoJ3NwbGVuZG9yJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC53eXNpd3lnLFxyXG4gICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcclxuICAgICAgICAgIGNoZWNrZWQ6IHQgPT09ICd3eXNpd3lnJyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNldFRoZW1lKCd3eXNpd3lnJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIOW4ruWKqeiPnOWNlVxyXG4gICAge1xyXG4gICAgICBsYWJlbDogbC5oZWxwLFxyXG4gICAgICByb2xlOiAnaGVscCcsXHJcbiAgICAgIHN1Ym1lbnU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5vcGVuV2VsY29tZVBhZ2UsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LndlbGNvbWUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnZpZXdTYW1wbGVGaWxlLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5zYW1wbGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnR1dG9yaWFscyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIGFwcC5nZXRBcHBQYXRoKCk7XHJcbiAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9naXRlZS5jb20veGFvdHVtYW4vcHVzaC1tYXJrZG93bi9ibG9iL21hc3Rlci9kb2NzLyVFNCVCRCVCRiVFNyU5NCVBOCVFNiU5NSU5OSVFNyVBOCU4Qi5tZCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwubGVhcm5Nb3JlLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLmdldEFwcFBhdGgoKTtcclxuICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2dpdGVlLmNvbS94YW90dW1hbi9wdXNoLW1hcmtkb3duJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgXTtcclxuXHJcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XHJcbiAgICBjb25zdCBuYW1lOiBzdHJpbmcgPSBhcHAuZ2V0TmFtZSgpO1xyXG4gICAgdGVtcGxhdGUudW5zaGlmdCh7XHJcbiAgICAgIGxhYmVsOiBuYW1lLFxyXG4gICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuYWJvdXQgKyBuYW1lLFxyXG4gICAgICAgICAgcm9sZTogJ2Fib3V0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnNlcnZpY2VzLFxyXG4gICAgICAgICAgcm9sZTogJ3NlcnZpY2VzJyxcclxuICAgICAgICAgIHN1Ym1lbnU6IFtdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuaGlkZSArIG5hbWUsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NvbW1hbmQrSCcsXHJcbiAgICAgICAgICByb2xlOiAnaGlkZSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmhpZGVPdGhlcnMsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NvbW1hbmQrU2hpZnQrSCcsXHJcbiAgICAgICAgICByb2xlOiAnaGlkZW90aGVycydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnNob3dBbGwsXHJcbiAgICAgICAgICByb2xlOiAndW5oaWRlJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnF1aXQsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NvbW1hbmQrUScsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhcHAucXVpdCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCB3aW5kb3dNZW51ID0gdGVtcGxhdGUuZmluZChmdW5jdGlvbiAobSkge1xyXG4gICAgICByZXR1cm4gbS5yb2xlID09PSAnd2luZG93JztcclxuICAgIH0pO1xyXG4gICAgaWYgKHdpbmRvd01lbnUpIHtcclxuICAgICAgd2luZG93TWVudS5zdWJtZW51LnB1c2goXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmJyaW5nQWxsVG9Gcm9udCxcclxuICAgICAgICAgIHJvbGU6ICdmcm9udCdcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBtZW51ID0gTWVudS5idWlsZEZyb21UZW1wbGF0ZSh0ZW1wbGF0ZSk7XHJcbiAgTWVudS5zZXRBcHBsaWNhdGlvbk1lbnUobWVudSk7XHJcbn1cclxuIiwiLypcclxuICogQEF1dGhvcjogc3p4XHJcbiAqIEBEYXRlOiAyMDIyLTA3LTIzIDEzOjQwOjMxXHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDctMjMgMjA6MDA6MzJcclxuICogQERlc2NyaXB0aW9uOiDkuLvnqpflj6Porr7nva5cclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxtYWluXFxzcmNcXG1haW5XaW5kb3cudHNcclxuICovXHJcbmltcG9ydCB7IEJyb3dzZXJXaW5kb3cgfSBmcm9tICdlbGVjdHJvbic7XHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgVVJMIH0gZnJvbSAndXJsJztcclxuXHJcbmltcG9ydCB7IG1lbnVJbml0IH0gZnJvbSAnL0AvYXBwLW1lbnUnO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2luZG93KCkge1xyXG4gIGNvbnN0IGJyb3dzZXJXaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XHJcbiAgICBtaW5IZWlnaHQ6IDE4MCxcclxuICAgIG1pbldpZHRoOiAzMjAsXHJcbiAgICB3aWR0aDogMTYwMCxcclxuICAgIGhlaWdodDogODAwLFxyXG4gICAgc2hvdzogZmFsc2UsIC8vIOS9v+eUqOS6i+S7tiByZWFkeS10by1zaG93IOadpeWxleekuueql+WPo1xyXG4gICAgLy8gd2Vi5riy5p+T6L+b56iL6K6+572uXHJcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xyXG4gICAgICAvLyBub2RlSW50ZWdyYXRpb246IGZhbHNlLCAgLy/pu5jorqTkuI3lvIDlkK9ub2Rl6ZuG5oiQ77yM5Li65LqG5a6J5YWo8J+YilxyXG4gICAgICAvLyBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLCAvL+m7mOiupOW8gOWQr+S4iuS4i+aWh+malOemu++8jOS4uuS6huWuieWFqPCfmIpcclxuICAgICAgd2ViU2VjdXJpdHk6IHRydWUsIC8vIOWFs+mXrei3qOWfn+mZkOWItu+8jOS4uuS6huWuieWFqPCfmIpcclxuICAgICAgd2Vidmlld1RhZzogZmFsc2UsIC8vIOS4jeefpemBk+aYr+WVpe+8jOWFs+WwseWujOS6i+S6hu+8jOS4uuS6huWuieWFqPCfmIpcclxuICAgICAgcHJlbG9hZDogam9pbihfX2Rpcm5hbWUsICcuLi8uLi9wcmVsb2FkL2Rpc3QvaW5kZXguY2pzJylcclxuICAgIH1cclxuICB9KTtcclxuICAvKipcclxuICAgKiBJZiB5b3UgaW5zdGFsbCBgc2hvdzogdHJ1ZWAgdGhlbiBpdCBjYW4gY2F1c2UgaXNzdWVzIHdoZW4gdHJ5aW5nIHRvIGNsb3NlIHRoZSB3aW5kb3cuXHJcbiAgICogVXNlIGBzaG93OiBmYWxzZWAgYW5kIGxpc3RlbmVyIGV2ZW50cyBgcmVhZHktdG8tc2hvd2AgdG8gZml4IHRoZXNlIGlzc3Vlcy5cclxuICAgKlxyXG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy8yNTAxMlxyXG4gICAqL1xyXG5cclxuICBicm93c2VyV2luZG93Lm9uKCdyZWFkeS10by1zaG93JywgKCkgPT4ge1xyXG4gICAgbWVudUluaXQoYnJvd3NlcldpbmRvdyk7XHJcbiAgICBicm93c2VyV2luZG93Py5zaG93KCk7XHJcbiAgICAvLyDlpoLmnpzmmK9kZXbnjq/looPvvIzpobrluKbmiZPlvIBkZXZ0b29sc1xyXG4gICAgaWYgKGltcG9ydC5tZXRhLmVudi5ERVYpIHtcclxuICAgICAgYnJvd3NlcldpbmRvdz8ud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8qKlxyXG4gICAqIFVSTCBmb3IgbWFpbiB3aW5kb3cuXHJcbiAgICogVml0ZSBkZXYgc2VydmVyIGZvciBkZXZlbG9wbWVudC5cclxuICAgKiBgZmlsZTovLy4uL3JlbmRlcmVyL2luZGV4Lmh0bWxgIGZvciBwcm9kdWN0aW9uIGFuZCB0ZXN0XHJcbiAgICovXHJcbiAgY29uc3QgcGFnZVVybCA9XHJcbiAgICBpbXBvcnQubWV0YS5lbnYuREVWICYmIGltcG9ydC5tZXRhLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMICE9PSB1bmRlZmluZWQgPyBpbXBvcnQubWV0YS5lbnYuVklURV9ERVZfU0VSVkVSX1VSTCA6IG5ldyBVUkwoJy4uL3JlbmRlcmVyL2Rpc3QvaW5kZXguaHRtbCcsICdmaWxlOi8vJyArIF9fZGlybmFtZSkudG9TdHJpbmcoKTtcclxuXHJcbiAgYXdhaXQgYnJvd3NlcldpbmRvdy5sb2FkVVJMKHBhZ2VVcmwpO1xyXG5cclxuICByZXR1cm4gYnJvd3NlcldpbmRvdztcclxufVxyXG5cclxuLyoqXHJcbiAqIFJlc3RvcmUgZXhpc3RpbmcgQnJvd3NlcldpbmRvdyBvciBDcmVhdGUgbmV3IEJyb3dzZXJXaW5kb3dcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXN0b3JlT3JDcmVhdGVXaW5kb3coKSB7XHJcbiAgbGV0IHdpbmRvdyA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmZpbmQoKHcpID0+ICF3LmlzRGVzdHJveWVkKCkpO1xyXG5cclxuICBpZiAod2luZG93ID09PSB1bmRlZmluZWQpIHtcclxuICAgIHdpbmRvdyA9IGF3YWl0IGNyZWF0ZVdpbmRvdygpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHdpbmRvdy5pc01pbmltaXplZCgpKSB7XHJcbiAgICB3aW5kb3cucmVzdG9yZSgpO1xyXG4gIH1cclxuXHJcbiAgd2luZG93LmZvY3VzKCk7XHJcbn1cclxuIiwiLypcclxuICogQEF1dGhvcjogc3p4XHJcbiAqIEBEYXRlOiAyMDIyLTA3LTIzIDEzOjQwOjMxXHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDctMjMgMjI6MDg6MzJcclxuICogQERlc2NyaXB0aW9uOiBlbGVjdHJvbueahOW6lOeUqOWQr+WKqFxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcaW5kZXgudHNcclxuICovXHJcbmltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgcHJvdG9jb2wgfSBmcm9tICdlbGVjdHJvbic7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGlwY01haW5Db2xsZWN0aW9uIH0gZnJvbSAnLi9pcGMtbWVzc2FnZSc7XHJcblxyXG4vLyBpbXBvcnQgJy4vc2VjdXJpdHktcmVzdHJpY3Rpb25zJztcclxuaW1wb3J0IHsgcmVzdG9yZU9yQ3JlYXRlV2luZG93IH0gZnJvbSAnL0AvbWFpbldpbmRvdyc7XHJcblxyXG4vKipcclxuICog5Y+q5oul5pyJ5LiA5Liq5a6e5L6L77yM6Ziy5q2i5pyJ5aSa5Liq5a6e5L6LXHJcbiAqL1xyXG5jb25zdCBpc1NpbmdsZUluc3RhbmNlID0gYXBwLnJlcXVlc3RTaW5nbGVJbnN0YW5jZUxvY2soKTtcclxuaWYgKCFpc1NpbmdsZUluc3RhbmNlKSB7XHJcbiAgYXBwLnF1aXQoKTtcclxuICBwcm9jZXNzLmV4aXQoMCk7XHJcbn1cclxuYXBwLm9uKCdzZWNvbmQtaW5zdGFuY2UnLCByZXN0b3JlT3JDcmVhdGVXaW5kb3cpO1xyXG5cclxuLyoqXHJcbiAqIOWFs+mXreehrOS7tuWKoOmAn++8jOi/meS4quacieW+heWVhuamt++8jOmZpOmdnuacieWFvOWuueaAp+mXrumimFxyXG4gKi9cclxuLy8gYXBwLmRpc2FibGVIYXJkd2FyZUFjY2VsZXJhdGlvbigpO1xyXG5cclxuLyoqXHJcbiAqIOWFs+mXreeql+WPo++8jOaJgOaciei/m+eoi+mDvemAgOWHulxyXG4gKi9cclxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcclxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcclxuICAgIGFwcC5xdWl0KCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIGh0dHBzOi8vd3d3LmVsZWN0cm9uanMub3JnL2RvY3MvdjE0LXgteS9hcGkvYXBwI2V2ZW50LWFjdGl2YXRlLW1hY29zIEV2ZW50OiAnYWN0aXZhdGUnXHJcbiAqL1xyXG5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xyXG4gIGlmIChCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKS5sZW5ndGggPT09IDApIHJlc3RvcmVPckNyZWF0ZVdpbmRvdygpO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiDliJvlu7rlupTnlKjnqpflj6PlvZPlkI7lj7Dov5vnqIvlt7Lnu4/lh4blpIflpb1cclxuICovXHJcbmFwcFxyXG4gIC53aGVuUmVhZHkoKVxyXG4gIC50aGVuKCgpID0+IHtcclxuICAgIHJlc3RvcmVPckNyZWF0ZVdpbmRvdygpO1xyXG4gICAgaXBjTWFpbkNvbGxlY3Rpb247XHJcbiAgICBwcm90b2NvbC5yZWdpc3RlckZpbGVQcm90b2NvbCgnYXRvbScsIChyZXF1ZXN0LCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSByZXF1ZXN0LnVybC5yZXBsYWNlKC9eYXRvbTpcXC9cXC8vLCAnJyk7XHJcbiAgICAgIC8vIERlY29kZSBVUkwgdG8gcHJldmVudCBlcnJvcnMgd2hlbiBsb2FkaW5nIGZpbGVuYW1lcyB3aXRoIFVURi04IGNoYXJzIG9yIGNoYXJzIGxpa2UgXCIjXCJcclxuICAgICAgY29uc3QgZGVjb2RlZFVybCA9IGRlY29kZVVSSSh1cmwpOyAvLyBOZWVkZWQgaW4gY2FzZSBVUkwgY29udGFpbnMgc3BhY2VzXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHsgcGF0aDogcGF0aC5ub3JtYWxpemUoZGVjb2RlZFVybCkgfSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRVJST1I6IHJlZ2lzdGVyTG9jYWxSZXNvdXJjZVByb3RvY29sOiBDb3VsZCBub3QgZ2V0IGZpbGUgcGF0aDonLCBlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmNhdGNoKChlKSA9PiBjb25zb2xlLmVycm9yKCdGYWlsZWQgY3JlYXRlIHdpbmRvdzonLCBlKSk7XHJcblxyXG4vKipcclxuICog5aaC5p6c5piv5rWL6K+V546v5aKD77yM5a6J6KOFVnVlLmpz55qE6LCD6K+V5o+S5Lu2XHJcbiAqL1xyXG5pZiAoaW1wb3J0Lm1ldGEuZW52LkRFVikge1xyXG4gIGFwcFxyXG4gICAgLndoZW5SZWFkeSgpXHJcbiAgICAudGhlbigoKSA9PiBpbXBvcnQoJ2VsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlcicpKVxyXG4gICAgLnRoZW4oKHsgZGVmYXVsdDogaW5zdGFsbEV4dGVuc2lvbiwgVlVFSlMzX0RFVlRPT0xTIH0pID0+XHJcbiAgICAgIGluc3RhbGxFeHRlbnNpb24oVlVFSlMzX0RFVlRPT0xTLCB7XHJcbiAgICAgICAgbG9hZEV4dGVuc2lvbk9wdGlvbnM6IHtcclxuICAgICAgICAgIGFsbG93RmlsZUFjY2VzczogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIClcclxuICAgIC5jYXRjaCgoZSkgPT4gY29uc29sZS5lcnJvcignRmFpbGVkIGluc3RhbGwgZXh0ZW5zaW9uOicsIGUpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIOWcqOeUn+S6p+aooeW8j+S4i++8jOajgOafpeW6lOeUqOeahOeJiOacrOabtOaWsFxyXG4gKi9cclxuaWYgKGltcG9ydC5tZXRhLmVudi5QUk9EKSB7XHJcbiAgYXBwXHJcbiAgICAud2hlblJlYWR5KClcclxuICAgIC50aGVuKCgpID0+IGltcG9ydCgnZWxlY3Ryb24tdXBkYXRlcicpKVxyXG4gICAgLnRoZW4oKHsgYXV0b1VwZGF0ZXIgfSkgPT4gYXV0b1VwZGF0ZXIuY2hlY2tGb3JVcGRhdGVzQW5kTm90aWZ5KCkpXHJcbiAgICAuY2F0Y2goKGUpID0+IGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCBjaGVjayB1cGRhdGVzOicsIGUpKTtcclxufVxyXG4iXSwibmFtZXMiOlsiaXBjTWFpbiIsInBhdGgiLCJhcHAiLCJNZXRhV2VibG9nIiwiU3RvcmUiLCJzdG9yZSIsImxhbmdTdG9yZS5zZXRMYW5ndWFnZSIsInRoZW1lU3RvcmUuc2V0VGhlbWUiLCJsYW5nU3RvcmUuZ2V0TGFuZ3VhZ2UiLCJsYW5ndWFnZS56aCIsImxhbmd1YWdlLmVuIiwidGhlbWVTdG9yZS5nZXRUaGVtZSIsImRpYWxvZyIsInNldExhbmd1YWdlIiwic2V0VGhlbWUiLCJzaGVsbCIsIk1lbnUiLCJCcm93c2VyV2luZG93Iiwiam9pbiIsInByb3RvY29sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVlBLElBQUk7QUFrQkpBLFNBQUEsUUFBUSxHQUFHLFdBQVcsU0FBVSxPQUFPLEtBQUs7QUFFMUMsUUFBTSxjQUFjQyxzQkFBSyxRQUFRQyxTQUFBQSxJQUFJLFFBQVEsS0FBSyxDQUFDO0FBQ3JELENBQUM7QUFFREYsU0FBQSxRQUFRLEdBQUcscUJBQXFCLFNBQVUsT0FBTyxLQUFLO0FBRXBELFVBQVEsSUFBSSxHQUFHO0FBQ1QsUUFBQSxjQUFjRSxTQUFBQSxJQUFJLGtCQUFrQixHQUFHO0FBQy9DLENBQUM7QUFHREYsU0FBQSxRQUFRLEdBQUcsV0FBVyxTQUFVLE9BQU8sS0FBSztBQUVwQyxRQUFBLGNBQWNFLGFBQUk7QUFDMUIsQ0FBQztBQUVERixTQUFBLFFBQVEsR0FBRyxZQUFZLFNBQVUsT0FBTyxLQUFLO0FBRTNDLFFBQU0sY0FBYyxRQUFRO0FBQzlCLENBQUM7QUFFREEsU0FBQSxRQUFRLEdBQUcsUUFBUSxTQUFVLE9BQU8sS0FBSztBQUV2QyxRQUFNLGNBQWMsUUFBUTtBQUM5QixDQUFDO0FBRURBLFNBQUEsUUFBUSxHQUFHLG9CQUFvQixTQUFVLE9BQU8sS0FBSztBQUVuRCxRQUFNLGNBQWMsUUFBUTtBQUM5QixDQUFDO0FBRURBLFNBQUEsUUFBUSxHQUFHLFlBQVksU0FBVSxPQUFPLEtBQUs7QUFJM0MsUUFBTSxjQUFjO0FBQ3RCLENBQUM7QUFHREEsU0FBQSxRQUFRLEdBQUcsaUJBQWlCLFNBQVUsT0FBTyxLQUFLO0FBQzFDLFFBQUEsTUFBTSxpQkFBaUIsR0FBRztBQUNsQyxDQUFDO0FBT0RBLFNBQUEsUUFBUSxHQUFHLGVBQWUsU0FBVSxPQUFPLEtBQUs7QUFDeEMsUUFBQSxNQUFNLGVBQWUsR0FBRztBQUNoQyxDQUFDO0FBRURBLFNBQUEsUUFBUSxHQUFHLGVBQWUsQ0FBQyxPQUFPLGFBQWE7QUFDN0MsUUFBTSxPQUFPLFVBQVU7QUFBQSxJQUNyQixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFBQSxDQUNQO0FBQ0gsQ0FBQztBQUdEQSxTQUFBLFFBQVEsR0FBRyxvQkFBb0IsZUFBZ0IsT0FBTyxLQUFLO0FBQ3JELE1BQUE7QUFDVyxpQkFBQSxJQUFJRyxvQkFBVyxRQUFBLElBQUksRUFBRTtBQUM5QixRQUFBLElBQUksTUFBTSxNQUFNO0FBQ2xCLFVBQUksS0FBSyxPQUFPLEtBQUssSUFBSSxJQUFJLFFBQVE7QUFBQSxJQUN2QztBQUNBLFVBQU0sY0FBYztBQUFBLE1BQ2xCLE1BQU0sSUFBSTtBQUFBLE1BQ1YsTUFBTSxJQUFJO0FBQUEsTUFDVixNQUFNLElBQUk7QUFBQSxNQUNWLFdBQVc7QUFBQSxJQUFBO0FBR1AsVUFBQSxNQUFXLE1BQU0sV0FBVyxlQUFlLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLFdBQVc7QUFDcEYsVUFBTSxjQUFjLENBQUMsTUFBTSxJQUFJLEdBQUc7QUFBQSxXQUMzQjtBQUNQLFVBQU0sY0FBYyxDQUFDLE9BQU8sSUFBSSxTQUFVLENBQUE7QUFBQSxFQUM1QztBQUNGLENBQUM7QUFFREgsU0FBQSxRQUFRLEdBQUcsa0JBQWtCLFNBQVUsT0FBTyxLQUFLO0FBQ3BDLGVBQUEsSUFBSUcsNEJBQVcsR0FBRztBQUMvQixRQUFNLGNBQWM7QUFDdEIsQ0FBQztBQVNEQyxlQUFBLFFBQU0sYUFBYTtBQ2pIWixNQUFNLEtBQUs7QUFBQSxFQUNoQixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixZQUFZO0FBQUEsRUFDWixhQUFhO0FBQUEsRUFDYixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsRUFDVCxVQUFVO0FBQUEsRUFDVixVQUFVO0FBQUEsRUFDVixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixLQUFLO0FBQUEsRUFDTCxNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsRUFDUCxXQUFXO0FBQUEsRUFFWCxRQUFRO0FBQUEsRUFDUixVQUFVO0FBQUEsRUFDVixVQUFVO0FBQUEsRUFDVixZQUFZO0FBQUEsRUFDWixrQkFBa0I7QUFBQSxFQUNsQixnQkFBZ0I7QUFBQSxFQUNoQixRQUFRO0FBQUEsRUFDUixVQUFVO0FBQUEsRUFDVixPQUFPO0FBQUEsRUFDUCxNQUFNO0FBQUEsRUFDTixXQUFXO0FBQUEsRUFDWCxpQkFBaUI7QUFBQSxFQUNqQixnQkFBZ0I7QUFBQSxFQUNoQixXQUFXO0FBQUEsRUFDWCxPQUFPO0FBQUEsRUFDUCxVQUFVO0FBQUEsRUFDVixNQUFNO0FBQUEsRUFDTixZQUFZO0FBQUEsRUFDWixTQUFTO0FBQUEsRUFDVCxNQUFNO0FBQUEsRUFDTixpQkFBaUI7QUFBQSxFQUVqQixPQUFPO0FBQUEsRUFDUCxPQUFPO0FBQUEsRUFDUCxNQUFNO0FBQUEsRUFDTixVQUFVO0FBQUEsRUFDVixTQUFTO0FBQ1g7QUFFTyxNQUFNLEtBQUs7QUFBQSxFQUNoQixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixZQUFZO0FBQUEsRUFDWixhQUFhO0FBQUEsRUFDYixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsRUFDVCxVQUFVO0FBQUEsRUFDVixVQUFVO0FBQUEsRUFDVixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixLQUFLO0FBQUEsRUFDTCxNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsRUFDUCxXQUFXO0FBQUEsRUFFWCxRQUFRO0FBQUEsRUFDUixVQUFVO0FBQUEsRUFDVixVQUFVO0FBQUEsRUFDVixZQUFZO0FB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
