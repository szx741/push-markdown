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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6WyIuLi9zcmMvaXBjLW1lc3NhZ2UudHMiLCIuLi9zcmMvYXBwLW1lbnUvbWVudS1sYW5nLnRzIiwiLi4vc3JjL2FwcC1tZW51L2xhbmd1YWdlLXN0b3JlLnRzIiwiLi4vc3JjL2FwcC1tZW51L3RoZW1lLXN0b3JlLnRzIiwiLi4vc3JjL2FwcC1tZW51L2luZGV4LnRzIiwiLi4vc3JjL21haW5XaW5kb3cudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQEF1dGhvcjogc3p4XHJcbiAqIEBEYXRlOiAyMDIxLTA3LTA1IDIwOjU3OjEwXHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDctMjYgMTU6MTI6MTlcclxuICogQERlc2NyaXB0aW9uOlxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcaXBjLW1lc3NhZ2UudHNcclxuICovXHJcblxyXG5pbXBvcnQgeyBhcHAsIGlwY01haW4gfSBmcm9tICdlbGVjdHJvbic7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgU3RvcmUgZnJvbSAnZWxlY3Ryb24tc3RvcmUnO1xyXG5pbXBvcnQgTWV0YVdlYmxvZyBmcm9tICdtZXRhd2VibG9nLWFwaSc7XHJcbmxldCBtZXRhd2VibG9nOiBNZXRhV2VibG9nO1xyXG5cclxuLypcclxuICAvLyDlrp7pqozmgKfotKhcclxuICBpcGNNYWluLm9uKCd0b01haW4nLCAoZXZlbnQsIGFyZ3MpID0+IHtcclxuICAgIC8vIGV2ZW50LnJlcGx5KCdmcm9tTWFpbicsICflkI7mkqTmraU4ODgnKTtcclxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZnJvbU1haW4nLCAn5ZCO5pKk5q2lNzc3Jyk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIOeEtuWQjuWcqOa4suafk+i/m+eoi+S4reS9v+eUqOS4i+mdoueahOi/meauteivreWPpVxyXG4gIC8vIOS7juS4u+i/m+eoi+mAmumBk0Zyb21NYWlu5o6l5Y+X5L+h5oGvXHJcbiAgaXBjLnJlY2VpdmUoJ2Zyb21NYWluJywgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coYFJlY2VpdmVkICR7ZGF0YX0gZnJvbSBtYWluIHByb2Nlc3NgKTtcclxuICB9KTtcclxuICAvLyDlj5HpgIHkv6Hmga/nu5nkuLvov5vnqIvpgJrpgZN0b01haW5cclxuICBpcGMuc2VuZCgndG9NYWluJywgJ3NvbWUgZGF0YScpO1xyXG4qL1xyXG4vLyDojrflvpflvZPliY3lronoo4XljIXot6/lvoRcclxuaXBjTWFpbi5vbignZXhlUGF0aCcsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgLy8gZXZlbnQucmVwbHkoJ2V4ZVBhdGgnLCBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKTtcclxufSk7XHJcblxyXG5pcGNNYWluLm9uKCdhZGRSZWNlbnREb2N1bWVudCcsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgLy8gZXZlbnQucmVwbHkoJ2V4ZVBhdGgnLCBwYXRoLmRpcm5hbWUoYXBwLmdldFBhdGgoJ2V4ZScpKSk7XHJcbiAgY29uc29sZS5sb2coYXJnKTtcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IGFwcC5hZGRSZWNlbnREb2N1bWVudChhcmcpO1xyXG59KTtcclxuXHJcbi8vIOiOt+W+l+W9k+WJjeeJiOacrOWPt1xyXG5pcGNNYWluLm9uKCd2ZXJzaW9uJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyAgIGV2ZW50LnJlcGx5KCd2ZXJzaW9uJywgYXBwLmdldFZlcnNpb24oKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBhcHAuZ2V0VmVyc2lvbigpO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ3BsYXRmb3JtJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyAgIGV2ZW50LnJlcGx5KCd2ZXJzaW9uJywgYXBwLmdldFZlcnNpb24oKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBwcm9jZXNzLnBsYXRmb3JtO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ2FyZ3YnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIC8vICAgZXZlbnQucmVwbHkoJ3ZlcnNpb24nLCBhcHAuZ2V0VmVyc2lvbigpKTtcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IHByb2Nlc3MuYXJndjtcclxufSk7XHJcblxyXG5pcGNNYWluLm9uKCdwcm9jZXNzLnZlcnNpb25zJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyAgIGV2ZW50LnJlcGx5KCd2ZXJzaW9uJywgYXBwLmdldFZlcnNpb24oKSk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBwcm9jZXNzLnZlcnNpb25zO1xyXG59KTtcclxuXHJcbmlwY01haW4ub24oJ19fc3RhdGljJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAvLyBldmVudC5yZXBseSgnZXhlUGF0aCcsIHBhdGguZGlybmFtZShhcHAuZ2V0UGF0aCgnZXhlJykpKTtcclxuICAvLyBldmVudC5yZXR1cm5WYWx1ZSA9IF9fc3RhdGljO1xyXG4gIC8vIGV2ZW50LnJldHVyblZhbHVlID0gJy4vJztcclxuICBldmVudC5yZXR1cm5WYWx1ZSA9IF9fZGlybmFtZTtcclxufSk7XHJcblxyXG4vLyDkuK3ovazmtojmga/vvIzmuLLmn5Pov5vnqIvlj5Hnu5nkuLvov5vnqIvvvIzkuLvov5vnqIvlho3lj5Hnu5nmuLLmn5Pov5vnqItcclxuaXBjTWFpbi5vbignbWVudS5zZXR0aW5ncycsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgZXZlbnQucmVwbHkoJ21lbnUuc2V0dGluZ3MnLCBhcmcpO1xyXG59KTtcclxuXHJcbi8vIGlwY01haW4ub24oJ21lbnUuc2hvd2ZpbGUnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4vLyAgIGV2ZW50LnJlcGx5KCdtZW51LnNob3dmaWxlJywgYXJnKTtcclxuLy8gfSk7XHJcblxyXG4vLyDkuK3ovazmtojmga/vvIzmuLLmn5Pov5vnqIvlj5Hnu5nkuLvov5vnqIvvvIzkuLvov5vnqIvlho3lj5Hnu5nmuLLmn5Pov5vnqItcclxuaXBjTWFpbi5vbignbWVudS5zYW1wbGUnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gIGV2ZW50LnJlcGx5KCdtZW51LnNhbXBsZScsIGFyZyk7XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5vbignb25kcmFnc3RhcnQnLCAoZXZlbnQsIGZpbGVQYXRoKSA9PiB7XHJcbiAgZXZlbnQuc2VuZGVyLnN0YXJ0RHJhZyh7XHJcbiAgICBmaWxlOiBmaWxlUGF0aCxcclxuICAgIGljb246ICcvcGF0aC90by9pY29uLnBuZydcclxuICB9KTtcclxufSk7XHJcblxyXG4vLyDkuK3ovazmtojmga/vvIzmuLLmn5Pov5vnqIvlj5Hnu5nkuLvov5vnqIvvvIzkuLvov5vnqIvlho3lj5Hnu5nmuLLmn5Pov5vnqItcclxuaXBjTWFpbi5vbignbmV3LW1lZGlhLW9iamVjdCcsIGFzeW5jIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgdHJ5IHtcclxuICAgIG1ldGF3ZWJsb2cgPSBuZXcgTWV0YVdlYmxvZyhhcmdbN10pO1xyXG4gICAgaWYgKGFyZ1swXSA9PSB0cnVlKSB7XHJcbiAgICAgIGFyZ1s2XSA9IEJ1ZmZlci5mcm9tKGFyZ1s2XSwgJ2Jhc2U2NCcpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbWVkaWFPYmplY3QgPSB7XHJcbiAgICAgIG5hbWU6IGFyZ1s0XSxcclxuICAgICAgdHlwZTogYXJnWzVdLFxyXG4gICAgICBiaXRzOiBhcmdbNl0sXHJcbiAgICAgIG92ZXJ3cml0ZTogdHJ1ZVxyXG4gICAgfTtcclxuICAgIC8vIGNvbnN0IG1ldGEgPSBuZXcgTWV0YVdlYmxvZyhhcmdbMF0pO1xyXG4gICAgY29uc3QgcmVzOiBhbnkgPSBhd2FpdCBtZXRhd2VibG9nLm5ld01lZGlhT2JqZWN0KGFyZ1sxXSwgYXJnWzJdLCBhcmdbM10sIG1lZGlhT2JqZWN0KTtcclxuICAgIGV2ZW50LnJldHVyblZhbHVlID0gW3RydWUsIHJlcy51cmxdO1xyXG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICBldmVudC5yZXR1cm5WYWx1ZSA9IFtmYWxzZSwgZXJyLnRvU3RyaW5nKCldO1xyXG4gIH1cclxufSk7XHJcblxyXG5pcGNNYWluLm9uKCduZXctbWV0YXdlYmxvZycsIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7XHJcbiAgbWV0YXdlYmxvZyA9IG5ldyBNZXRhV2VibG9nKGFyZyk7XHJcbiAgZXZlbnQucmV0dXJuVmFsdWUgPSB0cnVlO1xyXG59KTtcclxuXHJcbi8vIGlwY01haW4ub24oJ25ldy1tZWRpYS1vYmplY3QnLCBhc3luYyBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4vLyAgIGNvbnNvbGUubG9nKCdtZXRhJywgbWV0YSk7XHJcbi8vICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbWV0YS5uZXdNZWRpYU9iamVjdChibG9nSWQsIHVzZXJuYW1lLCBwYXNzd29yZCwgbWVkaWFPYmplY3QpO1xyXG4vLyAgIGNvbnNvbGUubG9nKCduZXctbWVkaWEtb2JqZWN0OicsIHJlc3VsdCk7XHJcbi8vICAgZXZlbnQucmVwbHkoJ25ldy1tZWRpYS1vYmplY3QnLCByZXN1bHQpO1xyXG4vLyB9KTtcclxuXHJcblN0b3JlLmluaXRSZW5kZXJlcigpO1xyXG5cclxuZXhwb3J0IHsgaXBjTWFpbiBhcyBpcGNNYWluQ29sbGVjdGlvbiB9O1xyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjEtMDctMDQgMTk6MDA6NThcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wNy0yMyAxOTozODowOVxyXG4gKiBARGVzY3JpcHRpb246IOeql+WPo+eahOWkmuivreiogOaUr+aMgVxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcbWVudS1sYW5nLnRzXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVuID0ge1xyXG4gIGZpbGU6ICdGaWxlJyxcclxuICBvcGVuOiAnT3BlbicsXHJcbiAgb3BlblJlY2VudDogJ09wZW4gUmVjZW50JyxcclxuICBjbGVhclJlY2VudDogJ0NsZWFyJyxcclxuICBzYXZlOiAnU2F2ZScsXHJcbiAgcHVibGlzaDogJ1B1Ymxpc2gnLFxyXG4gIGxhbmd1YWdlOiAnTGFuZ3VhZ2UnLFxyXG4gIHNldHRpbmdzOiAnU2V0dGluZ3MnLFxyXG4gIGVkaXQ6ICdFZGl0JyxcclxuICB1bmRvOiAnVW5kbycsXHJcbiAgcmVkbzogJ1JlZG8nLFxyXG4gIGN1dDogJ0N1dCcsXHJcbiAgY29weTogJ0NvcHknLFxyXG4gIHBhc3RlOiAnUGFzdGUnLFxyXG4gIHNlbGVjdEFsbDogJ1NlbGVjdCBBbGwnLFxyXG4gIC8vIHZpZXc6ICdWaWV3JyxcclxuICByZWxvYWQ6ICdSZWxvYWQnLFxyXG4gIGZpbGVUcmVlOiAnRmlsZSB0cmVlJyxcclxuICBjbG9zZVRhYjogJ0Nsb3NlIEN1cnJlbnQgRmlsZScsXHJcbiAgcmVsb2FkRmlsZTogJ1JlbG9hZCBGaWxlJyxcclxuICB0b2dnbGVGdWxsU2NyZWVuOiAnVG9nZ2xlIEZ1bGwgU2NyZWVuJyxcclxuICB0b2dnbGVEZXZUb29sczogJ1RvZ2dsZSBEZXZlbG9wZXIgVG9vbHMnLFxyXG4gIHdpbmRvdzogJ1dpbmRvdycsXHJcbiAgbWluaW1pemU6ICdNaW5pbWl6ZScsXHJcbiAgY2xvc2U6ICdDbG9zZScsXHJcbiAgaGVscDogJ0hlbHAnLFxyXG4gIGxlYXJuTW9yZTogJ0xlYXJuIE1vcmUnLFxyXG4gIG9wZW5XZWxjb21lUGFnZTogJ09wZW4gV2VsY29tZSBQYWdlJyxcclxuICB2aWV3U2FtcGxlRmlsZTogJ1ZpZXcgU2FtcGxlIEZpbGUnLFxyXG4gIHR1dG9yaWFsczogJ1R1dG9yaWFscycsXHJcbiAgYWJvdXQ6ICdBYm91dCAnLFxyXG4gIHNlcnZpY2VzOiAnU2VydmljZXMnLFxyXG4gIGhpZGU6ICdIaWRlICcsXHJcbiAgaGlkZU90aGVyczogJ0hpZGUgT3RoZXJzJyxcclxuICBzaG93QWxsOiAnU2hvdyBBbGwnLFxyXG4gIHF1aXQ6ICdRdWl0JyxcclxuICBicmluZ0FsbFRvRnJvbnQ6ICdCcmluZyBBbGwgdG8gRnJvbnQnLFxyXG5cclxuICB0aGVtZTogJ1RoZW1lJyxcclxuICBsaWdodDogJ0dpdGh1YicsXHJcbiAgZGFyazogJ0RhcmsnLFxyXG4gIHNwbGVuZG9yOiAnU3BsZW5kb3InLFxyXG4gIHd5c2l3eWc6ICdXeXNpd3lnJ1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHpoID0ge1xyXG4gIGZpbGU6ICfmlofku7YnLFxyXG4gIG9wZW46ICfmiZPlvIAnLFxyXG4gIG9wZW5SZWNlbnQ6ICfmiZPlvIDmnIDov5Hkvb/nlKjnmoQnLFxyXG4gIGNsZWFyUmVjZW50OiAn5riF6ZmkJyxcclxuICBzYXZlOiAn5L+d5a2YJyxcclxuICBwdWJsaXNoOiAn5Y+R5biDJyxcclxuICBsYW5ndWFnZTogJ+ivreiogCcsXHJcbiAgc2V0dGluZ3M6ICforr7nva4nLFxyXG4gIGVkaXQ6ICfnvJbovpEnLFxyXG4gIHVuZG86ICfmkqTplIAnLFxyXG4gIHJlZG86ICfph43lgZonLFxyXG4gIGN1dDogJ+WJquWIhycsXHJcbiAgY29weTogJ+WkjeWIticsXHJcbiAgcGFzdGU6ICfnspjotLQnLFxyXG4gIHNlbGVjdEFsbDogJ+WFqOmAiScsXHJcbiAgLy8gdmlldzogJ+aYvuekuicsXHJcbiAgcmVsb2FkOiAn6YeN5paw5Yqg6L29JyxcclxuICBmaWxlVHJlZTogJ+aWh+S7tuWIl+ihqCcsXHJcbiAgY2xvc2VUYWI6ICflhbPpl63lvZPliY3mlofku7YnLFxyXG4gIHJlbG9hZEZpbGU6ICfph43mlrDovb3lhaXmlofku7YnLFxyXG4gIHRvZ2dsZUZ1bGxTY3JlZW46ICfliIfmjaLlhajlsY8nLFxyXG4gIHRvZ2dsZURldlRvb2xzOiAn5YiH5o2i5byA5Y+R6ICF5bel5YW3JyxcclxuICB3aW5kb3c6ICfnqpflj6MnLFxyXG4gIG1pbmltaXplOiAn5pyA5bCP5YyWJyxcclxuICBjbG9zZTogJ+WFs+mXrScsXHJcbiAgaGVscDogJ+W4ruWKqScsXHJcbiAgbGVhcm5Nb3JlOiAn5LqG6Kej5pu05aSaJyxcclxuICBvcGVuV2VsY29tZVBhZ2U6ICfmiZPlvIDmrKLov47pobUnLFxyXG4gIHZpZXdTYW1wbGVGaWxlOiAn5p+l55yL56S65L6L5paH5qGjJyxcclxuICB0dXRvcmlhbHM6ICfkvb/nlKjmlZnnqIsnLFxyXG4gIGFib3V0OiAn5YWz5LqOJyxcclxuICBzZXJ2aWNlczogJ+acjeWKoScsXHJcbiAgaGlkZTogJ+makOiXjycsXHJcbiAgaGlkZU90aGVyczogJ+makOiXj+WFtuS7licsXHJcbiAgc2hvd0FsbDogJ+aYvuekuuWFqOmDqCcsXHJcbiAgcXVpdDogJ+mAgOWHuicsXHJcbiAgYnJpbmdBbGxUb0Zyb250OiAn5YmN572u5YWo6YOo56qX5Y+jJyxcclxuICB0aGVtZTogJ+S4u+mimCcsXHJcbiAgbGlnaHQ6ICdHaXRodWInLFxyXG4gIGRhcms6ICdOaWdodCcsXHJcbiAgc3BsZW5kb3I6ICdTcGxlbmRvcicsXHJcbiAgd3lzaXd5ZzogJ1d5c2l3eWcnXHJcbn07XHJcbiIsIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMS0wNy0wNCAxODo0Nzo0NFxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA3LTIzIDE5OjU1OjQ0XHJcbiAqIEBEZXNjcmlwdGlvbjogZWxlY3Ryb24tc290cmXlrZjlgqjor63oqIDlgLxcclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxtYWluXFxzcmNcXGxhbmd1YWdlLXN0b3JlLnRzXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IFN0b3JlIGZyb20gJ2VsZWN0cm9uLXN0b3JlJztcclxuXHJcbi8vIOWtmOWCqOeahOaWh+S7tuWQjeS4unNldHRpbmdzXHJcbmNvbnN0IHN0b3JlID0gbmV3IFN0b3JlKHsgbmFtZTogJ3NldHRpbmdzJyB9KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRMYW5ndWFnZSgpIHtcclxuICByZXR1cm4gc3RvcmUuZ2V0KCdsYW5ndWFnZScsICd6aCcpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0TGFuZ3VhZ2UobGFuZzogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHN0b3JlLnNldCgnbGFuZ3VhZ2UnLCBsYW5nKTtcclxufVxyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjItMDctMTkgMTQ6NTQ6MTBcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wNy0yMyAxOTo1NjoxNFxyXG4gKiBARGVzY3JpcHRpb246XHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFx0aGVtZS1zdG9yZS50c1xyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IFN0b3JlIGZyb20gJ2VsZWN0cm9uLXN0b3JlJztcclxuXHJcbi8vIOWtmOWCqOeahOaWh+S7tuWQjeS4unNldHRpbmdzXHJcbmNvbnN0IHN0b3JlID0gbmV3IFN0b3JlKHsgbmFtZTogJ3NldHRpbmdzJyB9KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUaGVtZSgpIHtcclxuICByZXR1cm4gc3RvcmUuZ2V0KCd0aGVtZScsICdnaXRodWInKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFRoZW1lKHRoZW1lOiBzdHJpbmcpIHtcclxuICByZXR1cm4gc3RvcmUuc2V0KCd0aGVtZScsIHRoZW1lKTtcclxufVxyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjItMDctMjMgMTk6NTc6MzFcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wNy0yMyAyMDowMDoxNVxyXG4gKiBARGVzY3JpcHRpb246XHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxhcHAtbWVudVxcaW5kZXgudHNcclxuICovXHJcbi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMS0wNy0wNCAxODo0MjoxNVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA3LTIzIDE5OjU2OjMyXHJcbiAqIEBEZXNjcmlwdGlvbjog6I+c5Y2V5qCP6K6+572uXHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxhcHAtbWVudS50c1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vZGlhbG9n5qih5Z2X5o+Q5L6b5LqGYXBp5p2l5bGV56S65Y6f55Sf55qE57O757uf5a+56K+d5qGG77yM5L6L5aaC5omT5byA5paH5Lu25qGG77yMYWxlcnTmoYZcclxuaW1wb3J0IHsgTWVudSwgYXBwLCBkaWFsb2csIHNoZWxsLCBCcm93c2VyV2luZG93IH0gZnJvbSAnZWxlY3Ryb24nO1xyXG5cclxuaW1wb3J0ICogYXMgbGFuZ3VhZ2UgZnJvbSAnLi9tZW51LWxhbmcnO1xyXG5pbXBvcnQgKiBhcyBsYW5nU3RvcmUgZnJvbSAnLi9sYW5ndWFnZS1zdG9yZSc7XHJcbmltcG9ydCAqIGFzIHRoZW1lU3RvcmUgZnJvbSAnLi90aGVtZS1zdG9yZSc7XHJcblxyXG4vLyDliqDovb3oj5zljZXmoI9cclxuZXhwb3J0IGZ1bmN0aW9uIG1lbnVJbml0KG1haW5XaW5kb3c6IEJyb3dzZXJXaW5kb3cpIHtcclxuICAvLyB3ZWJDb250ZW50c+Wug+i0n+i0o+a4suafk+W5tuaOp+WItue9kemhtVxyXG4gIGNvbnN0IHdlYkNvbnRlbnRzID0gbWFpbldpbmRvdy53ZWJDb250ZW50cztcclxuXHJcbiAgLy8g6K6+572u6K+t6KiAXHJcbiAgZnVuY3Rpb24gc2V0TGFuZ3VhZ2UobGFuZzogc3RyaW5nKSB7XHJcbiAgICBsYW5nU3RvcmUuc2V0TGFuZ3VhZ2UobGFuZyk7XHJcbiAgICAvLyDpgJrov4cgY2hhbm5lbCDlj5HpgIHlvILmraXmtojmga/nu5nmuLLmn5Pov5vnqItcclxuICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUubGFuZ3VhZ2UnLCBsYW5nKTtcclxuICAgIC8vIOmHjeaWsOa4suafk+iPnOWNleagj1xyXG4gICAgbWVudUluaXQobWFpbldpbmRvdyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRUaGVtZSh0aGVtZTogc3RyaW5nKSB7XHJcbiAgICB0aGVtZVN0b3JlLnNldFRoZW1lKHRoZW1lKTtcclxuICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUudGhlbWUnLCB0aGVtZSk7XHJcbiAgICBtZW51SW5pdChtYWluV2luZG93KTtcclxuICB9XHJcblxyXG4gIC8vIOiOt+WPluivreiogOiuvue9rlxyXG4gIGNvbnN0IGxhbmcgPSBsYW5nU3RvcmUuZ2V0TGFuZ3VhZ2UoKTtcclxuICBjb25zdCBsID0gbGFuZyA9PT0gJ3poJyA/IGxhbmd1YWdlLnpoIDogbGFuZ3VhZ2UuZW47XHJcblxyXG4gIGNvbnN0IHQgPSB0aGVtZVN0b3JlLmdldFRoZW1lKCk7XHJcblxyXG4gIC8vIOiPnOWNleagj+aooeadv1xyXG4gIGNvbnN0IHRlbXBsYXRlOiBhbnlbXSA9IFtcclxuICAgIHtcclxuICAgICAgbGFiZWw6IGwuZmlsZSxcclxuICAgICAgLy/mlofku7bkuIvmi4nlsZ7mgKdcclxuICAgICAgc3VibWVudTogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLm9wZW4sXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtPJyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRpYWxvZ1xyXG4gICAgICAgICAgICAgIC5zaG93T3BlbkRpYWxvZyhtYWluV2luZG93LCB7IHByb3BlcnRpZXM6IFsnb3BlbkZpbGUnXSwgZmlsdGVyczogW3sgbmFtZTogJ01hcmtkb3duJywgZXh0ZW5zaW9uczogWydtZCddIH1dIH0pXHJcbiAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5jYW5jZWxlZCAmJiByZXN1bHQuZmlsZVBhdGhzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5vcGVuJywgcmVzdWx0LmZpbGVQYXRoc1swXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIC8vIOWIhumalOaoque6v1xyXG4gICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnNhdmUsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtTJyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUuc2F2ZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwucHVibGlzaCxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1AnLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5wdWJsaXNoJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuc2V0dGluZ3MsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnNldHRpbmdzJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5sYW5ndWFnZSxcclxuICAgICAgICAgIHN1Ym1lbnU6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGxhYmVsOiAn566A5L2T5Lit5paHJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxyXG4gICAgICAgICAgICAgIGNoZWNrZWQ6IGxhbmcgPT09ICd6aCcsXHJcbiAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNldExhbmd1YWdlKCd6aCcpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGxhYmVsOiAnRW5nbGlzaCcsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcclxuICAgICAgICAgICAgICBjaGVja2VkOiBsYW5nID09PSAnZW4nLFxyXG4gICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRMYW5ndWFnZSgnZW4nKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICAvL+esrOS6jOS4quiPnOWNlVxyXG4gICAge1xyXG4gICAgICBsYWJlbDogbC5lZGl0LFxyXG4gICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwudW5kbyxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1onLFxyXG4gICAgICAgICAgcm9sZTogJ3VuZG8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5yZWRvLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdTaGlmdCtDbWRPckN0cmwrWicsXHJcbiAgICAgICAgICByb2xlOiAncmVkbydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5jdXQsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtYJyxcclxuICAgICAgICAgIHJvbGU6ICdjdXQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5jb3B5LFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrQycsXHJcbiAgICAgICAgICByb2xlOiAnY29weSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnBhc3RlLFxyXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrVicsXHJcbiAgICAgICAgICByb2xlOiAncGFzdGUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5zZWxlY3RBbGwsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtBJyxcclxuICAgICAgICAgIHJvbGU6ICdzZWxlY3RhbGwnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgLy8g56qX5Y+j6I+c5Y2VXHJcbiAgICB7XHJcbiAgICAgIGxhYmVsOiBsLndpbmRvdyxcclxuICAgICAgcm9sZTogJ3dpbmRvdycsXHJcbiAgICAgIHN1Ym1lbnU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5maWxlVHJlZSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ0N0cmwrU2hpZnQrTCc7XHJcbiAgICAgICAgICB9KSgpLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2ViQ29udGVudHMuc2VuZCgnbWVudS5zaG93ZmlsZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwudG9nZ2xlRnVsbFNjcmVlbixcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHJldHVybiAnQ3RybCtDb21tYW5kK0YnO1xyXG4gICAgICAgICAgICBlbHNlIHJldHVybiAnRjExJztcclxuICAgICAgICAgIH0pKCksXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKGl0ZW06IGFueSwgZm9jdXNlZFdpbmRvdzogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChmb2N1c2VkV2luZG93KSBmb2N1c2VkV2luZG93LnNldEZ1bGxTY3JlZW4oIWZvY3VzZWRXaW5kb3cuaXNGdWxsU2NyZWVuKCkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwubWluaW1pemUsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtNJyxcclxuICAgICAgICAgIHJvbGU6ICdtaW5pbWl6ZSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnJlbG9hZEZpbGUsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogJ0Y1JyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUucmVsb2FkZmlsZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuY2xvc2VUYWIsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdDdHJsK0Y0JztcclxuICAgICAgICAgIH0pKCksXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LmNsb3NldGFiJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwucmVsb2FkLFxyXG4gICAgICAgICAgLy8gYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUicsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKGl0ZW06IGFueSwgZm9jdXNlZFdpbmRvdzogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChmb2N1c2VkV2luZG93KSBmb2N1c2VkV2luZG93LnJlbG9hZCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwudG9nZ2xlRGV2VG9vbHMsXHJcbiAgICAgICAgICBhY2NlbGVyYXRvcjogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdDdHJsK1NoaWZ0K0knO1xyXG4gICAgICAgICAgfSkoKSxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoaXRlbTogYW55LCBmb2N1c2VkV2luZG93OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKGZvY3VzZWRXaW5kb3cpIGZvY3VzZWRXaW5kb3cudG9nZ2xlRGV2VG9vbHMoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5jbG9zZSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1cnLFxyXG4gICAgICAgICAgcm9sZTogJ2Nsb3NlJ1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyDkuLvpopjoj5zljZVcclxuICAgIHtcclxuICAgICAgbGFiZWw6IGwudGhlbWUsXHJcbiAgICAgIHJvbGU6ICd0aGVtZScsXHJcbiAgICAgIHN1Ym1lbnU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5saWdodCxcclxuICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXHJcbiAgICAgICAgICBjaGVja2VkOiB0ID09PSAnZ2l0aHViJyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNldFRoZW1lKCdnaXRodWInKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLmRhcmssXHJcbiAgICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxyXG4gICAgICAgICAgY2hlY2tlZDogdCA9PT0gJ2RhcmsnLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VGhlbWUoJ2RhcmsnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnNwbGVuZG9yLFxyXG4gICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcclxuICAgICAgICAgIGNoZWNrZWQ6IHQgPT09ICdzcGxlbmRvcicsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZXRUaGVtZSgnc3BsZW5kb3InKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLnd5c2l3eWcsXHJcbiAgICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxyXG4gICAgICAgICAgY2hlY2tlZDogdCA9PT0gJ3d5c2l3eWcnLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VGhlbWUoJ3d5c2l3eWcnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcblxyXG4gICAgLy8g5biu5Yqp6I+c5Y2VXHJcbiAgICB7XHJcbiAgICAgIGxhYmVsOiBsLmhlbHAsXHJcbiAgICAgIHJvbGU6ICdoZWxwJyxcclxuICAgICAgc3VibWVudTogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiBsLm9wZW5XZWxjb21lUGFnZSxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNlbmQoJ21lbnUud2VsY29tZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwudmlld1NhbXBsZUZpbGUsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3ZWJDb250ZW50cy5zZW5kKCdtZW51LnNhbXBsZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwudHV0b3JpYWxzLFxyXG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gYXBwLmdldEFwcFBhdGgoKTtcclxuICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2dpdGVlLmNvbS94YW90dW1hbi9wdXNoLW1hcmtkb3duL2Jsb2IvbWFzdGVyL2RvY3MvJUU0JUJEJUJGJUU3JTk0JUE4JUU2JTk1JTk5JUU3JUE4JThCLm1kJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5sZWFybk1vcmUsXHJcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhcHAuZ2V0QXBwUGF0aCgpO1xyXG4gICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vZ2l0ZWUuY29tL3hhb3R1bWFuL3B1c2gtbWFya2Rvd24nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICBdO1xyXG5cclxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcclxuICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9IGFwcC5nZXROYW1lKCk7XHJcbiAgICB0ZW1wbGF0ZS51bnNoaWZ0KHtcclxuICAgICAgbGFiZWw6IG5hbWUsXHJcbiAgICAgIHN1Ym1lbnU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5hYm91dCArIG5hbWUsXHJcbiAgICAgICAgICByb2xlOiAnYWJvdXQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuc2VydmljZXMsXHJcbiAgICAgICAgICByb2xlOiAnc2VydmljZXMnLFxyXG4gICAgICAgICAgc3VibWVudTogW11cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogbC5oaWRlICsgbmFtZSxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ29tbWFuZCtIJyxcclxuICAgICAgICAgIHJvbGU6ICdoaWRlJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuaGlkZU90aGVycyxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ29tbWFuZCtTaGlmdCtIJyxcclxuICAgICAgICAgIHJvbGU6ICdoaWRlb3RoZXJzJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuc2hvd0FsbCxcclxuICAgICAgICAgIHJvbGU6ICd1bmhpZGUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwucXVpdCxcclxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ29tbWFuZCtRJyxcclxuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFwcC5xdWl0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHdpbmRvd01lbnUgPSB0ZW1wbGF0ZS5maW5kKGZ1bmN0aW9uIChtKSB7XHJcbiAgICAgIHJldHVybiBtLnJvbGUgPT09ICd3aW5kb3cnO1xyXG4gICAgfSk7XHJcbiAgICBpZiAod2luZG93TWVudSkge1xyXG4gICAgICB3aW5kb3dNZW51LnN1Ym1lbnUucHVzaChcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbGFiZWw6IGwuYnJpbmdBbGxUb0Zyb250LFxyXG4gICAgICAgICAgcm9sZTogJ2Zyb250J1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IG1lbnUgPSBNZW51LmJ1aWxkRnJvbVRlbXBsYXRlKHRlbXBsYXRlKTtcclxuICBNZW51LnNldEFwcGxpY2F0aW9uTWVudShtZW51KTtcclxufVxyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjItMDctMjMgMTM6NDA6MzFcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wNy0yMyAyMDowMDozMlxyXG4gKiBARGVzY3JpcHRpb246IOS4u+eql+WPo+iuvue9rlxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXG1haW5cXHNyY1xcbWFpbldpbmRvdy50c1xyXG4gKi9cclxuaW1wb3J0IHsgQnJvd3NlcldpbmRvdyB9IGZyb20gJ2VsZWN0cm9uJztcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBVUkwgfSBmcm9tICd1cmwnO1xyXG5cclxuaW1wb3J0IHsgbWVudUluaXQgfSBmcm9tICcvQC9hcHAtbWVudSc7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVXaW5kb3coKSB7XHJcbiAgY29uc3QgYnJvd3NlcldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcclxuICAgIG1pbkhlaWdodDogMTgwLFxyXG4gICAgbWluV2lkdGg6IDMyMCxcclxuICAgIHdpZHRoOiAxNjAwLFxyXG4gICAgaGVpZ2h0OiA4MDAsXHJcbiAgICBzaG93OiBmYWxzZSwgLy8g5L2/55So5LqL5Lu2IHJlYWR5LXRvLXNob3cg5p2l5bGV56S656qX5Y+jXHJcbiAgICAvLyB3ZWLmuLLmn5Pov5vnqIvorr7nva5cclxuICAgIHdlYlByZWZlcmVuY2VzOiB7XHJcbiAgICAgIC8vIG5vZGVJbnRlZ3JhdGlvbjogZmFsc2UsICAvL+m7mOiupOS4jeW8gOWQr25vZGXpm4bmiJDvvIzkuLrkuoblronlhajwn5iKXHJcbiAgICAgIC8vIGNvbnRleHRJc29sYXRpb246IHRydWUsIC8v6buY6K6k5byA5ZCv5LiK5LiL5paH6ZqU56a777yM5Li65LqG5a6J5YWo8J+YilxyXG4gICAgICB3ZWJTZWN1cml0eTogdHJ1ZSwgLy8g5YWz6Zet6Leo5Z+f6ZmQ5Yi277yM5Li65LqG5a6J5YWo8J+YilxyXG4gICAgICB3ZWJ2aWV3VGFnOiBmYWxzZSwgLy8g5LiN55+l6YGT5piv5ZWl77yM5YWz5bCx5a6M5LqL5LqG77yM5Li65LqG5a6J5YWo8J+YilxyXG4gICAgICBwcmVsb2FkOiBqb2luKF9fZGlybmFtZSwgJy4uLy4uL3ByZWxvYWQvZGlzdC9pbmRleC5janMnKVxyXG4gICAgfVxyXG4gIH0pO1xyXG4gIC8qKlxyXG4gICAqIElmIHlvdSBpbnN0YWxsIGBzaG93OiB0cnVlYCB0aGVuIGl0IGNhbiBjYXVzZSBpc3N1ZXMgd2hlbiB0cnlpbmcgdG8gY2xvc2UgdGhlIHdpbmRvdy5cclxuICAgKiBVc2UgYHNob3c6IGZhbHNlYCBhbmQgbGlzdGVuZXIgZXZlbnRzIGByZWFkeS10by1zaG93YCB0byBmaXggdGhlc2UgaXNzdWVzLlxyXG4gICAqXHJcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24vZWxlY3Ryb24vaXNzdWVzLzI1MDEyXHJcbiAgICovXHJcblxyXG4gIGJyb3dzZXJXaW5kb3cub24oJ3JlYWR5LXRvLXNob3cnLCAoKSA9PiB7XHJcbiAgICBtZW51SW5pdChicm93c2VyV2luZG93KTtcclxuICAgIGJyb3dzZXJXaW5kb3c/LnNob3coKTtcclxuICAgIC8vIOWmguaenOaYr2RldueOr+Wig++8jOmhuuW4puaJk+W8gGRldnRvb2xzXHJcbiAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LkRFVikge1xyXG4gICAgICBicm93c2VyV2luZG93Py53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLyoqXHJcbiAgICogVVJMIGZvciBtYWluIHdpbmRvdy5cclxuICAgKiBWaXRlIGRldiBzZXJ2ZXIgZm9yIGRldmVsb3BtZW50LlxyXG4gICAqIGBmaWxlOi8vLi4vcmVuZGVyZXIvaW5kZXguaHRtbGAgZm9yIHByb2R1Y3Rpb24gYW5kIHRlc3RcclxuICAgKi9cclxuICBjb25zdCBwYWdlVXJsID1cclxuICAgIGltcG9ydC5tZXRhLmVudi5ERVYgJiYgaW1wb3J0Lm1ldGEuZW52LlZJVEVfREVWX1NFUlZFUl9VUkwgIT09IHVuZGVmaW5lZCA/IGltcG9ydC5tZXRhLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMIDogbmV3IFVSTCgnLi4vcmVuZGVyZXIvZGlzdC9pbmRleC5odG1sJywgJ2ZpbGU6Ly8nICsgX19kaXJuYW1lKS50b1N0cmluZygpO1xyXG5cclxuICBhd2FpdCBicm93c2VyV2luZG93LmxvYWRVUkwocGFnZVVybCk7XHJcblxyXG4gIHJldHVybiBicm93c2VyV2luZG93O1xyXG59XHJcblxyXG4vKipcclxuICogUmVzdG9yZSBleGlzdGluZyBCcm93c2VyV2luZG93IG9yIENyZWF0ZSBuZXcgQnJvd3NlcldpbmRvd1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc3RvcmVPckNyZWF0ZVdpbmRvdygpIHtcclxuICBsZXQgd2luZG93ID0gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZmluZCgodykgPT4gIXcuaXNEZXN0cm95ZWQoKSk7XHJcblxyXG4gIGlmICh3aW5kb3cgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgd2luZG93ID0gYXdhaXQgY3JlYXRlV2luZG93KCk7XHJcbiAgfVxyXG5cclxuICBpZiAod2luZG93LmlzTWluaW1pemVkKCkpIHtcclxuICAgIHdpbmRvdy5yZXN0b3JlKCk7XHJcbiAgfVxyXG5cclxuICB3aW5kb3cuZm9jdXMoKTtcclxufVxyXG4iLCIvKlxyXG4gKiBAQXV0aG9yOiBzenhcclxuICogQERhdGU6IDIwMjItMDctMjMgMTM6NDA6MzFcclxuICogQExhc3RFZGl0VGltZTogMjAyMi0wNy0yOSAyMjoxMDoxOVxyXG4gKiBARGVzY3JpcHRpb246IGVsZWN0cm9u55qE5bqU55So5ZCv5YqoXHJcbiAqIEBGaWxlUGF0aDogXFxwdXNoLW1hcmtkb3duXFxwYWNrYWdlc1xcbWFpblxcc3JjXFxpbmRleC50c1xyXG4gKi9cclxuaW1wb3J0IHsgYXBwLCBCcm93c2VyV2luZG93LCBwcm90b2NvbCB9IGZyb20gJ2VsZWN0cm9uJztcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgaXBjTWFpbkNvbGxlY3Rpb24gfSBmcm9tICcuL2lwYy1tZXNzYWdlJztcclxuXHJcbmltcG9ydCB7IHJlc3RvcmVPckNyZWF0ZVdpbmRvdyB9IGZyb20gJy9AL21haW5XaW5kb3cnO1xyXG5cclxuLyoqXHJcbiAqIOWPquaLpeacieS4gOS4quWunuS+i++8jOmYsuatouacieWkmuS4quWunuS+i1xyXG4gKi9cclxuY29uc3QgaXNTaW5nbGVJbnN0YW5jZSA9IGFwcC5yZXF1ZXN0U2luZ2xlSW5zdGFuY2VMb2NrKCk7XHJcbmlmICghaXNTaW5nbGVJbnN0YW5jZSkge1xyXG4gIGFwcC5xdWl0KCk7XHJcbiAgcHJvY2Vzcy5leGl0KDApO1xyXG59XHJcbmFwcC5vbignc2Vjb25kLWluc3RhbmNlJywgcmVzdG9yZU9yQ3JlYXRlV2luZG93KTtcclxuLyoqXHJcbiAqIOWFs+mXreehrOS7tuWKoOmAn++8jOi/meS4quacieW+heWVhuamt++8jOmZpOmdnuacieWFvOWuueaAp+mXrumimFxyXG4gKi9cclxuLy8gYXBwLmRpc2FibGVIYXJkd2FyZUFjY2VsZXJhdGlvbigpO1xyXG5cclxuLyoqXHJcbiAqIOWFs+mXreeql+WPo++8jOaJgOaciei/m+eoi+mDvemAgOWHulxyXG4gKi9cclxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcclxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcclxuICAgIGFwcC5xdWl0KCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIGh0dHBzOi8vd3d3LmVsZWN0cm9uanMub3JnL2RvY3MvdjE0LXgteS9hcGkvYXBwI2V2ZW50LWFjdGl2YXRlLW1hY29zIEV2ZW50OiAnYWN0aXZhdGUnXHJcbiAqL1xyXG5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xyXG4gIGlmIChCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKS5sZW5ndGggPT09IDApIHJlc3RvcmVPckNyZWF0ZVdpbmRvdygpO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiDliJvlu7rlupTnlKjnqpflj6PlvZPlkI7lj7Dov5vnqIvlt7Lnu4/lh4blpIflpb1cclxuICovXHJcbmFwcFxyXG4gIC53aGVuUmVhZHkoKVxyXG4gIC50aGVuKCgpID0+IHtcclxuICAgIHJlc3RvcmVPckNyZWF0ZVdpbmRvdygpO1xyXG4gICAgaXBjTWFpbkNvbGxlY3Rpb247XHJcbiAgICBwcm90b2NvbC5yZWdpc3RlckZpbGVQcm90b2NvbCgnYXRvbScsIChyZXF1ZXN0LCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSByZXF1ZXN0LnVybC5yZXBsYWNlKC9eYXRvbTpcXC9cXC8vLCAnJyk7XHJcbiAgICAgIC8vIERlY29kZSBVUkwgdG8gcHJldmVudCBlcnJvcnMgd2hlbiBsb2FkaW5nIGZpbGVuYW1lcyB3aXRoIFVURi04IGNoYXJzIG9yIGNoYXJzIGxpa2UgXCIjXCJcclxuICAgICAgY29uc3QgZGVjb2RlZFVybCA9IGRlY29kZVVSSSh1cmwpOyAvLyBOZWVkZWQgaW4gY2FzZSBVUkwgY29udGFpbnMgc3BhY2VzXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHsgcGF0aDogcGF0aC5ub3JtYWxpemUoZGVjb2RlZFVybCkgfSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRVJST1I6IHJlZ2lzdGVyTG9jYWxSZXNvdXJjZVByb3RvY29sOiBDb3VsZCBub3QgZ2V0IGZpbGUgcGF0aDonLCBlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmNhdGNoKChlKSA9PiBjb25zb2xlLmVycm9yKCdGYWlsZWQgY3JlYXRlIHdpbmRvdzonLCBlKSk7XHJcblxyXG4vKipcclxuICog5aaC5p6c5piv5rWL6K+V546v5aKD77yM5a6J6KOFVnVlLmpz55qE6LCD6K+V5o+S5Lu2XHJcbiAqL1xyXG5pZiAoaW1wb3J0Lm1ldGEuZW52LkRFVikge1xyXG4gIGFwcFxyXG4gICAgLndoZW5SZWFkeSgpXHJcbiAgICAudGhlbigoKSA9PiBpbXBvcnQoJ2VsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlcicpKVxyXG4gICAgLnRoZW4oKHsgZGVmYXVsdDogaW5zdGFsbEV4dGVuc2lvbiwgVlVFSlMzX0RFVlRPT0xTIH0pID0+XHJcbiAgICAgIGluc3RhbGxFeHRlbnNpb24oVlVFSlMzX0RFVlRPT0xTLCB7XHJcbiAgICAgICAgbG9hZEV4dGVuc2lvbk9wdGlvbnM6IHtcclxuICAgICAgICAgIGFsbG93RmlsZUFjY2VzczogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIClcclxuICAgIC5jYXRjaCgoZSkgPT4gY29uc29sZS5lcnJvcignRmFpbGVkIGluc3RhbGwgZXh0ZW5zaW9uOicsIGUpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIOWcqOeUn+S6p+aooeW8j+S4i++8jOajgOafpeW6lOeUqOeahOeJiOacrOabtOaWsFxyXG4gKi9cclxuaWYgKGltcG9ydC5tZXRhLmVudi5QUk9EKSB7XHJcbiAgYXBwXHJcbiAgICAud2hlblJlYWR5KClcclxuICAgIC50aGVuKCgpID0+IGltcG9ydCgnZWxlY3Ryb24tdXBkYXRlcicpKVxyXG4gICAgLnRoZW4oKHsgYXV0b1VwZGF0ZXIgfSkgPT4gYXV0b1VwZGF0ZXIuY2hlY2tGb3JVcGRhdGVzQW5kTm90aWZ5KCkpXHJcbiAgICAuY2F0Y2goKGUpID0+IGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCBjaGVjayB1cGRhdGVzOicsIGUpKTtcclxufVxyXG4iXSwibmFtZXMiOlsiaXBjTWFpbiIsInBhdGgiLCJhcHAiLCJNZXRhV2VibG9nIiwiU3RvcmUiLCJzdG9yZSIsImxhbmdTdG9yZS5zZXRMYW5ndWFnZSIsInRoZW1lU3RvcmUuc2V0VGhlbWUiLCJsYW5nU3RvcmUuZ2V0TGFuZ3VhZ2UiLCJsYW5ndWFnZS56aCIsImxhbmd1YWdlLmVuIiwidGhlbWVTdG9yZS5nZXRUaGVtZSIsImRpYWxvZyIsInNldExhbmd1YWdlIiwic2V0VGhlbWUiLCJzaGVsbCIsIk1lbnUiLCJCcm93c2VyV2luZG93Iiwiam9pbiIsInByb3RvY29sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVlBLElBQUk7QUFrQkpBLFNBQUEsUUFBUSxHQUFHLFdBQVcsU0FBVSxPQUFPLEtBQUs7QUFFMUMsUUFBTSxjQUFjQyxzQkFBSyxRQUFRQyxTQUFBQSxJQUFJLFFBQVEsS0FBSyxDQUFDO0FBQ3JELENBQUM7QUFFREYsU0FBQSxRQUFRLEdBQUcscUJBQXFCLFNBQVUsT0FBTyxLQUFLO0FBRXBELFVBQVEsSUFBSSxHQUFHO0FBQ1QsUUFBQSxjQUFjRSxTQUFBQSxJQUFJLGtCQUFrQixHQUFHO0FBQy9DLENBQUM7QUFHREYsU0FBQSxRQUFRLEdBQUcsV0FBVyxTQUFVLE9BQU8sS0FBSztBQUVwQyxRQUFBLGNBQWNFLGFBQUk7QUFDMUIsQ0FBQztBQUVERixTQUFBLFFBQVEsR0FBRyxZQUFZLFNBQVUsT0FBTyxLQUFLO0FBRTNDLFFBQU0sY0FBYyxRQUFRO0FBQzlCLENBQUM7QUFFREEsU0FBQSxRQUFRLEdBQUcsUUFBUSxTQUFVLE9BQU8sS0FBSztBQUV2QyxRQUFNLGNBQWMsUUFBUTtBQUM5QixDQUFDO0FBRURBLFNBQUEsUUFBUSxHQUFHLG9CQUFvQixTQUFVLE9BQU8sS0FBSztBQUVuRCxRQUFNLGNBQWMsUUFBUTtBQUM5QixDQUFDO0FBRURBLFNBQUEsUUFBUSxHQUFHLFlBQVksU0FBVSxPQUFPLEtBQUs7QUFJM0MsUUFBTSxjQUFjO0FBQ3RCLENBQUM7QUFHREEsU0FBQSxRQUFRLEdBQUcsaUJBQWlCLFNBQVUsT0FBTyxLQUFLO0FBQzFDLFFBQUEsTUFBTSxpQkFBaUIsR0FBRztBQUNsQyxDQUFDO0FBT0RBLFNBQUEsUUFBUSxHQUFHLGVBQWUsU0FBVSxPQUFPLEtBQUs7QUFDeEMsUUFBQSxNQUFNLGVBQWUsR0FBRztBQUNoQyxDQUFDO0FBRURBLFNBQUEsUUFBUSxHQUFHLGVBQWUsQ0FBQyxPQUFPLGFBQWE7QUFDN0MsUUFBTSxPQUFPLFVBQVU7QUFBQSxJQUNyQixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFBQSxDQUNQO0FBQ0gsQ0FBQztBQUdEQSxTQUFBLFFBQVEsR0FBRyxvQkFBb0IsZUFBZ0IsT0FBTyxLQUFLO0FBQ3JELE1BQUE7QUFDVyxpQkFBQSxJQUFJRyxvQkFBVyxRQUFBLElBQUksRUFBRTtBQUM5QixRQUFBLElBQUksTUFBTSxNQUFNO0FBQ2xCLFVBQUksS0FBSyxPQUFPLEtBQUssSUFBSSxJQUFJLFFBQVE7QUFBQSxJQUN2QztBQUNBLFVBQU0sY0FBYztBQUFBLE1BQ2xCLE1BQU0sSUFBSTtBQUFBLE1BQ1YsTUFBTSxJQUFJO0FBQUEsTUFDVixNQUFNLElBQUk7QUFBQSxNQUNWLFdBQVc7QUFBQSxJQUFBO0FBR1AsVUFBQSxNQUFXLE1BQU0sV0FBVyxlQUFlLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLFdBQVc7QUFDcEYsVUFBTSxjQUFjLENBQUMsTUFBTSxJQUFJLEdBQUc7QUFBQSxXQUMzQjtBQUNQLFVBQU0sY0FBYyxDQUFDLE9BQU8sSUFBSSxTQUFVLENBQUE7QUFBQSxFQUM1QztBQUNGLENBQUM7QUFFREgsU0FBQSxRQUFRLEdBQUcsa0JBQWtCLFNBQVUsT0FBTyxLQUFLO0FBQ3BDLGVBQUEsSUFBSUcsNEJBQVcsR0FBRztBQUMvQixRQUFNLGNBQWM7QUFDdEIsQ0FBQztBQVNEQyxlQUFBLFFBQU0sYUFBYTtBQ2pIWixNQUFNLEtBQUs7QUFBQSxFQUNoQixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixZQUFZO0FBQUEsRUFDWixhQUFhO0FBQUEsRUFDYixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsRUFDVCxVQUFVO0FBQUEsRUFDVixVQUFVO0FBQUEsRUFDVixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixLQUFLO0FBQUEsRUFDTCxNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsRUFDUCxXQUFXO0FBQUEsRUFFWCxRQUFRO0FBQUEsRUFDUixVQUFVO0FBQUEsRUFDVixVQUFVO0FBQUEsRUFDVixZQUFZO0FBQUEsRUFDWixrQkFBa0I7QUFBQSxFQUNsQixnQkFBZ0I7QUFBQSxFQUNoQixRQUFRO0FBQUEsRUFDUixVQUFVO0FBQUEsRUFDVixPQUFPO0FBQUEsRUFDUCxNQUFNO0FBQUEsRUFDTixXQUFXO0FBQUEsRUFDWCxpQkFBaUI7QUFBQSxFQUNqQixnQkFBZ0I7QUFBQSxFQUNoQixXQUFXO0FBQUEsRUFDWCxPQUFPO0FBQUEsRUFDUCxVQUFVO0FBQUEsRUFDVixNQUFNO0FBQUEsRUFDTixZQUFZO0FBQUEsRUFDWixTQUFTO0FBQUEsRUFDVCxNQUFNO0FBQUEsRUFDTixpQkFBaUI7QUFBQSxFQUVqQixPQUFPO0FBQUEsRUFDUCxPQUFPO0FBQUEsRUFDUCxNQUFNO0FBQUEsRUFDTixVQUFVO0FBQUEsRUFDVixTQUFTO0FBQ1g7QUFFTyxNQUFNLEtBQUs7QUFBQSxFQUNoQixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixZQUFZO0FBQUEsRUFDWixhQUFhO0FBQUEsRUFDYixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsRUFDVCxVQUFVO0FBQUEsRUFDVixVQUFVO0FBQUEsRUFDVixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixLQUFLO0FBQUEsRUFDTCxNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsRUFDUCxXQUFXO0FBQUEsRUFFWCxRQUFRO0FBQUEsRUFDUixVQUFVO0FBQUEsRUFDVixVQUFVO0FBQUEsRUFDVixZQUFZO0FBQUEsRUFDWixrQkFBa0I7QUFBQSxFQUNsQixnQkFBZ0I7QUFBQSxF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
