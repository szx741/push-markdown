"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const Store = require("electron-store");
const fs = require("fs");
const path = require("path");
const electron = require("electron");
const http = require("http");
const url = require("url");
const MetaWeblog = require("metaweblog-api");
const _interopDefaultLegacy = (e) => e && typeof e === "object" && "default" in e ? e : { default: e };
const Store__default = /* @__PURE__ */ _interopDefaultLegacy(Store);
const fs__default = /* @__PURE__ */ _interopDefaultLegacy(fs);
const path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
const http__default = /* @__PURE__ */ _interopDefaultLegacy(http);
const MetaWeblog__default = /* @__PURE__ */ _interopDefaultLegacy(MetaWeblog);
const options = {
  name: "settings",
  cwd: "setting",
  defaults: {
    publish: {
      abstractMode: "article",
      mathjax: true,
      abstractNum: 120,
      highlight: false
    },
    sites: [
      {
        name: "Sample Site Config",
        url: "https://www.example.com/xmlrpc.php",
        username: "username",
        password: "",
        selected: true
      }
    ],
    detail: {
      notCheck: true,
      forcedUpdate: false,
      getNetPic: false
    },
    theme: true,
    language: "zh",
    filelist: true
  }
};
const storeSettings = new Store__default.default(options);
const storeRecord = new Store__default.default({
  name: "use-record",
  defaults: {
    tabs: [
      {
        type: "welcome",
        modified: false,
        filePath: ""
      }
    ],
    "tab-current": 0
  }
});
const store = {
  getLanguage() {
    return storeSettings.get("language", "zh");
  },
  storeSettingsClear() {
    return storeSettings.clear();
  },
  storeSettingsSet(key, value) {
    storeSettings.set(key, value);
  },
  storeSettingsGet(key, value) {
    return storeSettings.get(key, value);
  },
  storeRecordSet(key, value) {
    return storeRecord.set(key, value);
  },
  storeRecordGet(key, value) {
    return storeRecord.get(key, value);
  },
  setShowFile(value) {
    return storeSettings.set("filelist", value);
  },
  getShowFile() {
    const res = storeSettings.get("filelist");
    if (typeof res === "boolean")
      return res;
    else
      return true;
  },
  getTheme() {
    return storeSettings.get("theme", true);
  },
  setTheme(theme) {
    return storeSettings.set("theme", theme);
  },
  openInEditor() {
    storeSettings.openInEditor();
  },
  getSettingsPath() {
    return storeSettings.path;
  }
};
const nodeFs = {
  fsReadFile: fs__default.default.readFile,
  fsReadFileSync(file) {
    try {
      return fs__default.default.readFileSync(file, { encoding: "base64" });
    } catch {
      return false;
    }
  },
  bufReadFileSync(file) {
    try {
      const pic = fs__default.default.readFileSync(file, { encoding: "base64" });
      return Buffer.from(pic, "base64");
    } catch {
      return false;
    }
  },
  fsWriteFile: fs__default.default.writeFile,
  fsWriteFileSync: fs__default.default.writeFileSync,
  fsExistsSync: fs__default.default.existsSync,
  fsReaddirSync: fs__default.default.readdirSync,
  fsStatSync: fs__default.default.statSync,
  fsLstatSync: fs__default.default.lstatSync,
  isFileOrDir(_path, file) {
    try {
      const stat = fs__default.default.lstatSync(path__default.default.join(_path, file));
      return stat.isDirectory();
    } catch (e) {
      return false;
    }
  },
  isDir(path2) {
    try {
      const stat = fs__default.default.lstatSync(path2);
      return stat.isDirectory();
    } catch (e) {
      return false;
    }
  },
  fsLstat: fs__default.default.lstat
};
const nodePath = {
  pathBasename: path__default.default.basename,
  pathJoin: path__default.default.join,
  pathIsAbsolute: path__default.default.isAbsolute,
  pathDirname: path__default.default.dirname,
  pathExtname: path__default.default.extname,
  pathResolve: path__default.default.resolve
};
function isUrl(str) {
  const trimmedStr = str.trim();
  if (trimmedStr.includes(" "))
    return false;
  try {
    new url.URL(str);
    return true;
  } catch {
    return false;
  }
}
function urlExists(url$1) {
  return new Promise((resolve) => {
    if (!isUrl(url$1)) {
      resolve(false);
    }
    const options2 = {
      method: "HEAD",
      host: url.parse(url$1).host,
      path: url.parse(url$1).pathname,
      port: 80
    };
    const req = http__default.default.request(options2, (res) => {
      if (res.statusCode === void 0) {
        resolve(false);
      } else {
        resolve(res.statusCode < 400 || res.statusCode >= 500);
      }
    });
    req.end();
  });
}
const other = {
  async checkUrlValid(url2) {
    url2 = encodeURI(url2);
    return await urlExists(url2);
  },
  shell: electron.shell,
  readFromClipboard() {
    return electron.clipboard.readText();
  },
  versions: process.versions
};
const validChannels = [
  "fromMain",
  "exePath",
  "version",
  "menu.language",
  "menu.welcome",
  "menu.sample",
  "addRecentDocument",
  "menu.save",
  "menu.settings",
  "menu.open",
  "menu.publish",
  "menu.showfile",
  "menu.closetab",
  "menu.reloadfile",
  "menu.theme",
  "new-media-object",
  "new-metaweblog",
  "__static"
];
const ipc = {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      electron.ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    if (validChannels.includes(channel)) {
      const subscription = (event, ...args) => func(...args);
      electron.ipcRenderer.on(channel, subscription);
      return () => {
        electron.ipcRenderer.removeListener(channel, subscription);
      };
    }
  },
  syncMsg: (channel, data) => {
    if (validChannels.includes(channel)) {
      return electron.ipcRenderer.sendSync(channel, data);
    }
  }
};
const MEDIA_MIME_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jpe: "image/jpeg",
  gif: "image/gif",
  png: "image/png",
  bmp: "image/bmp",
  tif: "image/tiff",
  tiff: "image/tiff",
  ico: "image/x-icon",
  webp: "image/webp"
};
const blogApi = {
  initBlogApi(siteUrl) {
    return new MetaWeblog__default.default(siteUrl);
  },
  newPost(metaWeblog, username, password, post) {
    return metaWeblog.newPost("", username, password, post, true);
  },
  editPost(metaWeblog, postid, username, password, post) {
    return metaWeblog.editPost(postid, username, password, post, true);
  },
  getPost(metaWeblog, postid, username, password) {
    return metaWeblog.getPost(postid, username, password);
  },
  newMediaObject(metaWeblog, username, password, imgName, filePath) {
    const bits = Buffer.from(fs__default.default.readFileSync(filePath));
    const mediaObject = {
      name: imgName,
      type: getMimeType(filePath),
      bits,
      overwrite: true
    };
    return metaWeblog.newMediaObject("", username, password, mediaObject);
  }
};
function getMimeType(filePath) {
  let ext = path__default.default.extname(filePath);
  ext = ext && ext.length > 1 && ext.substring(1) || "";
  const type = MEDIA_MIME_TYPES[ext];
  if (!type)
    throw new Error(`${ext} \u6B64\u5A92\u4F53\u540E\u7F00\u4E0D\u652F\u6301`);
  return type;
}
exports.blogApi = blogApi;
exports.ipc = ipc;
exports.nodeFs = nodeFs;
exports.nodePath = nodePath;
exports.other = other;
exports.store = store;
const { contextBridge } = require("electron");
;
contextBridge.exposeInMainWorld("__electron_preload__blogApi", exports.blogApi);
;
contextBridge.exposeInMainWorld("__electron_preload__ipc", exports.ipc);
;
contextBridge.exposeInMainWorld("__electron_preload__nodeFs", exports.nodeFs);
;
contextBridge.exposeInMainWorld("__electron_preload__nodePath", exports.nodePath);
;
contextBridge.exposeInMainWorld("__electron_preload__other", exports.other);
;
contextBridge.exposeInMainWorld("__electron_preload__store", exports.store);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6WyIuLi9zcmMvc3RvcmUudHMiLCIuLi9zcmMvbm9kZUZzLnRzIiwiLi4vc3JjL25vZGVQYXRoLnRzIiwiLi4vc3JjL290aGVyLnRzIiwiLi4vc3JjL2lwY1dpdGhNYWluLnRzIiwiLi4vc3JjL2Jsb2ctYXBpLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMi0wNy0yMyAyMDowOTozNVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA4LTA1IDAwOjAxOjAyXHJcbiAqIEBEZXNjcmlwdGlvbjpcclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxwcmVsb2FkXFxzcmNcXHN0b3JlLnRzXHJcbiAqL1xyXG5pbXBvcnQgU3RvcmUgZnJvbSAnZWxlY3Ryb24tc3RvcmUnO1xyXG5jb25zdCBvcHRpb25zID0ge1xyXG4gIG5hbWU6ICdzZXR0aW5ncycsXHJcbiAgY3dkOiAnc2V0dGluZycsXHJcbiAgZGVmYXVsdHM6IHtcclxuICAgIHB1Ymxpc2g6IHtcclxuICAgICAgYWJzdHJhY3RNb2RlOiAnYXJ0aWNsZScsXHJcbiAgICAgIG1hdGhqYXg6IHRydWUsXHJcbiAgICAgIGFic3RyYWN0TnVtOiAxMjAsXHJcbiAgICAgIGhpZ2hsaWdodDogZmFsc2VcclxuICAgIH0sXHJcbiAgICBzaXRlczogW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ1NhbXBsZSBTaXRlIENvbmZpZycsXHJcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20veG1scnBjLnBocCcsXHJcbiAgICAgICAgdXNlcm5hbWU6ICd1c2VybmFtZScsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHNlbGVjdGVkOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBkZXRhaWw6IHtcclxuICAgICAgbm90Q2hlY2s6IHRydWUsXHJcbiAgICAgIGZvcmNlZFVwZGF0ZTogZmFsc2UsXHJcbiAgICAgIGdldE5ldFBpYzogZmFsc2VcclxuICAgIH0sXHJcbiAgICB0aGVtZTogdHJ1ZSxcclxuICAgIGxhbmd1YWdlOiAnemgnLFxyXG4gICAgZmlsZWxpc3Q6IHRydWVcclxuICB9XHJcbn07XHJcbmNvbnN0IHN0b3JlU2V0dGluZ3MgPSBuZXcgU3RvcmUob3B0aW9ucyk7XHJcbmNvbnN0IHN0b3JlUmVjb3JkID0gbmV3IFN0b3JlKHtcclxuICBuYW1lOiAndXNlLXJlY29yZCcsXHJcbiAgZGVmYXVsdHM6IHtcclxuICAgIHRhYnM6IFtcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICd3ZWxjb21lJyxcclxuICAgICAgICBtb2RpZmllZDogZmFsc2UsXHJcbiAgICAgICAgZmlsZVBhdGg6ICcnXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICAndGFiLWN1cnJlbnQnOiAwXHJcbiAgfVxyXG59KTtcclxuZXhwb3J0IGNvbnN0IHN0b3JlID0ge1xyXG4gIGdldExhbmd1YWdlKCkge1xyXG4gICAgcmV0dXJuIHN0b3JlU2V0dGluZ3MuZ2V0KCdsYW5ndWFnZScsICd6aCcpO1xyXG4gIH0sXHJcbiAgc3RvcmVTZXR0aW5nc0NsZWFyKCkge1xyXG4gICAgcmV0dXJuIHN0b3JlU2V0dGluZ3MuY2xlYXIoKTtcclxuICB9LFxyXG4gIHN0b3JlU2V0dGluZ3NTZXQoa2V5OiBhbnksIHZhbHVlOiBhbnkpOiB2b2lkIHtcclxuICAgIHN0b3JlU2V0dGluZ3Muc2V0KGtleSwgdmFsdWUpO1xyXG4gIH0sXHJcbiAgc3RvcmVTZXR0aW5nc0dldChrZXk6IGFueSwgdmFsdWU/OiBhbnkpOiBhbnkge1xyXG4gICAgcmV0dXJuIHN0b3JlU2V0dGluZ3MuZ2V0KGtleSwgdmFsdWUpO1xyXG4gIH0sXHJcbiAgc3RvcmVSZWNvcmRTZXQoa2V5OiBhbnksIHZhbHVlOiBhbnkpIHtcclxuICAgIHJldHVybiBzdG9yZVJlY29yZC5zZXQoa2V5LCB2YWx1ZSk7XHJcbiAgfSxcclxuICBzdG9yZVJlY29yZEdldChrZXk6IGFueSwgdmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICByZXR1cm4gc3RvcmVSZWNvcmQuZ2V0KGtleSwgdmFsdWUpO1xyXG4gIH0sXHJcbiAgc2V0U2hvd0ZpbGUodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgIHJldHVybiBzdG9yZVNldHRpbmdzLnNldCgnZmlsZWxpc3QnLCB2YWx1ZSk7XHJcbiAgfSxcclxuICBnZXRTaG93RmlsZSgpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHJlcyA9IHN0b3JlU2V0dGluZ3MuZ2V0KCdmaWxlbGlzdCcpO1xyXG4gICAgaWYgKHR5cGVvZiByZXMgPT09ICdib29sZWFuJykgcmV0dXJuIHJlcztcclxuICAgIGVsc2UgcmV0dXJuIHRydWU7XHJcbiAgfSxcclxuICBnZXRUaGVtZSgpOiBhbnkge1xyXG4gICAgcmV0dXJuIHN0b3JlU2V0dGluZ3MuZ2V0KCd0aGVtZScsIHRydWUpO1xyXG4gIH0sXHJcbiAgc2V0VGhlbWUodGhlbWU6IGJvb2xlYW4pIHtcclxuICAgIHJldHVybiBzdG9yZVNldHRpbmdzLnNldCgndGhlbWUnLCB0aGVtZSk7XHJcbiAgfSxcclxuICBvcGVuSW5FZGl0b3IoKSB7XHJcbiAgICBzdG9yZVNldHRpbmdzLm9wZW5JbkVkaXRvcigpO1xyXG4gIH0sXHJcbiAgZ2V0U2V0dGluZ3NQYXRoKCkge1xyXG4gICAgcmV0dXJuIHN0b3JlU2V0dGluZ3MucGF0aDtcclxuICB9XHJcbn07XHJcbiIsIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMi0wNy0yMyAyMDoxNzowN1xyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA3LTI3IDE1OjU5OjA3XHJcbiAqIEBEZXNjcmlwdGlvbjpcclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxwcmVsb2FkXFxzcmNcXG5vZGVGcy50c1xyXG4gKi9cclxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmV4cG9ydCBjb25zdCBub2RlRnMgPSB7XHJcbiAgZnNSZWFkRmlsZTogZnMucmVhZEZpbGUsXHJcbiAgZnNSZWFkRmlsZVN5bmMoZmlsZTogc3RyaW5nKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKGZpbGUsIHsgZW5jb2Rpbmc6ICdiYXNlNjQnIH0pO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9LFxyXG4gIGJ1ZlJlYWRGaWxlU3luYyhmaWxlOiBzdHJpbmcpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHBpYyA9IGZzLnJlYWRGaWxlU3luYyhmaWxlLCB7IGVuY29kaW5nOiAnYmFzZTY0JyB9KTtcclxuICAgICAgLy8gY29uc29sZS5sb2coQnVmZmVyLmZyb20ocGljLCAnYmFzZTY0JykpO1xyXG4gICAgICByZXR1cm4gQnVmZmVyLmZyb20ocGljLCAnYmFzZTY0Jyk7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZnNXcml0ZUZpbGU6IGZzLndyaXRlRmlsZSxcclxuICBmc1dyaXRlRmlsZVN5bmM6IGZzLndyaXRlRmlsZVN5bmMsXHJcbiAgZnNFeGlzdHNTeW5jOiBmcy5leGlzdHNTeW5jLFxyXG4gIGZzUmVhZGRpclN5bmM6IGZzLnJlYWRkaXJTeW5jLFxyXG4gIGZzU3RhdFN5bmM6IGZzLnN0YXRTeW5jLFxyXG4gIGZzTHN0YXRTeW5jOiBmcy5sc3RhdFN5bmMsXHJcbiAgaXNGaWxlT3JEaXIoX3BhdGg6IHN0cmluZywgZmlsZTogc3RyaW5nKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzdGF0ID0gZnMubHN0YXRTeW5jKHBhdGguam9pbihfcGF0aCwgZmlsZSkpO1xyXG4gICAgICByZXR1cm4gc3RhdC5pc0RpcmVjdG9yeSgpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSxcclxuICBpc0RpcihwYXRoOiBzdHJpbmcpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHN0YXQgPSBmcy5sc3RhdFN5bmMocGF0aCk7XHJcbiAgICAgIHJldHVybiBzdGF0LmlzRGlyZWN0b3J5KCk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIC8vIGxzdGF0U3luYyB0aHJvd3MgYW4gZXJyb3IgaWYgcGF0aCBkb2Vzbid0IGV4aXN0XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9LFxyXG4gIGZzTHN0YXQ6IGZzLmxzdGF0XHJcbn07XHJcbiIsIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMi0wNy0yMyAxOToxMzoyMlxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA4LTA1IDExOjUyOjU2XHJcbiAqIEBEZXNjcmlwdGlvbjpcclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxwcmVsb2FkXFxzcmNcXG5vZGVQYXRoLnRzXHJcbiAqL1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuZXhwb3J0IGNvbnN0IG5vZGVQYXRoID0ge1xyXG4gIHBhdGhCYXNlbmFtZTogcGF0aC5iYXNlbmFtZSxcclxuICBwYXRoSm9pbjogcGF0aC5qb2luLFxyXG4gIHBhdGhJc0Fic29sdXRlOiBwYXRoLmlzQWJzb2x1dGUsXHJcbiAgcGF0aERpcm5hbWU6IHBhdGguZGlybmFtZSxcclxuICBwYXRoRXh0bmFtZTogcGF0aC5leHRuYW1lLFxyXG4gIHBhdGhSZXNvbHZlOiBwYXRoLnJlc29sdmVcclxufTtcclxuIiwiLypcclxuICogQEF1dGhvcjogc3p4XHJcbiAqIEBEYXRlOiAyMDIyLTA3LTIzIDIwOjI0OjA5XHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDgtMDUgMTE6MzM6NDFcclxuICogQERlc2NyaXB0aW9uOlxyXG4gKiBARmlsZVBhdGg6IFxccHVzaC1tYXJrZG93blxccGFja2FnZXNcXHByZWxvYWRcXHNyY1xcb3RoZXIudHNcclxuICovXHJcbmltcG9ydCB7IHNoZWxsLCBjbGlwYm9hcmQgfSBmcm9tICdlbGVjdHJvbic7XHJcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xyXG5pbXBvcnQgeyBwYXJzZSwgVVJMIH0gZnJvbSAndXJsJztcclxuXHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvaXMtdXJsLXN1cGVyYi9ibG9iL21haW4vaW5kZXguanNcclxuZnVuY3Rpb24gaXNVcmwoc3RyOiBzdHJpbmcpIHtcclxuICBjb25zdCB0cmltbWVkU3RyID0gc3RyLnRyaW0oKTtcclxuICBpZiAodHJpbW1lZFN0ci5pbmNsdWRlcygnICcpKSByZXR1cm4gZmFsc2U7XHJcbiAgdHJ5IHtcclxuICAgIG5ldyBVUkwoc3RyKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gY2F0Y2gge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXJsRXhpc3RzKHVybDogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICBpZiAoIWlzVXJsKHVybCkpIHtcclxuICAgICAgcmVzb2x2ZShmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgbWV0aG9kOiAnSEVBRCcsXHJcbiAgICAgIGhvc3Q6IHBhcnNlKHVybCkuaG9zdCxcclxuICAgICAgcGF0aDogcGFyc2UodXJsKS5wYXRobmFtZSxcclxuICAgICAgcG9ydDogODBcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcmVxID0gaHR0cC5yZXF1ZXN0KG9wdGlvbnMsIChyZXMpID0+IHtcclxuICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXNvbHZlKGZhbHNlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXNvbHZlKHJlcy5zdGF0dXNDb2RlIDwgNDAwIHx8IHJlcy5zdGF0dXNDb2RlID49IDUwMCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmVxLmVuZCgpO1xyXG4gIH0pO1xyXG59XHJcbmV4cG9ydCBjb25zdCBvdGhlciA9IHtcclxuICBhc3luYyBjaGVja1VybFZhbGlkKHVybDogc3RyaW5nKSB7XHJcbiAgICB1cmwgPSBlbmNvZGVVUkkodXJsKTtcclxuICAgIHJldHVybiBhd2FpdCB1cmxFeGlzdHModXJsKTtcclxuICB9LFxyXG4gIHNoZWxsOiBzaGVsbCxcclxuICByZWFkRnJvbUNsaXBib2FyZCgpIHtcclxuICAgIHJldHVybiBjbGlwYm9hcmQucmVhZFRleHQoKTtcclxuICB9LFxyXG4gIHZlcnNpb25zOiBwcm9jZXNzLnZlcnNpb25zXHJcbn07XHJcbiIsIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMi0wNy0yMyAyMDowMzoxNVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA4LTAyIDIwOjA4OjAxXHJcbiAqIEBEZXNjcmlwdGlvbjpcclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxwcmVsb2FkXFxzcmNcXGlwY1dpdGhNYWluLnRzXHJcbiAqL1xyXG5pbXBvcnQgeyBpcGNSZW5kZXJlciB9IGZyb20gJ2VsZWN0cm9uJztcclxuY29uc3QgdmFsaWRDaGFubmVscyA9IFtcclxuICAnZnJvbU1haW4nLFxyXG4gICdleGVQYXRoJyxcclxuICAndmVyc2lvbicsXHJcbiAgJ21lbnUubGFuZ3VhZ2UnLFxyXG4gICdtZW51LndlbGNvbWUnLFxyXG4gICdtZW51LnNhbXBsZScsXHJcbiAgJ2FkZFJlY2VudERvY3VtZW50JyxcclxuICAnbWVudS5zYXZlJyxcclxuICAnbWVudS5zZXR0aW5ncycsXHJcbiAgJ21lbnUub3BlbicsXHJcbiAgJ21lbnUucHVibGlzaCcsXHJcbiAgJ21lbnUuc2hvd2ZpbGUnLFxyXG4gICdtZW51LmNsb3NldGFiJyxcclxuICAnbWVudS5yZWxvYWRmaWxlJyxcclxuICAnbWVudS50aGVtZScsXHJcbiAgJ25ldy1tZWRpYS1vYmplY3QnLFxyXG4gICduZXctbWV0YXdlYmxvZycsXHJcbiAgJ19fc3RhdGljJ1xyXG5dO1xyXG5leHBvcnQgY29uc3QgaXBjID0ge1xyXG4gIC8vIOa4suafk+i/m+eoi+WNleaWuemdouWPkemAgea2iOaBr1xyXG4gIHNlbmQ6IChjaGFubmVsOiBzdHJpbmcsIGRhdGE/OiBhbnkpID0+IHtcclxuICAgIC8vIHdoaXRlbGlzdCBjaGFubmVsc1xyXG4gICAgaWYgKHZhbGlkQ2hhbm5lbHMuaW5jbHVkZXMoY2hhbm5lbCkpIHtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChjaGFubmVsLCBkYXRhKTtcclxuICAgIH1cclxuICB9LFxyXG4gIHJlY2VpdmU6IChjaGFubmVsOiBzdHJpbmcsIGZ1bmM6IGFueSkgPT4ge1xyXG4gICAgaWYgKHZhbGlkQ2hhbm5lbHMuaW5jbHVkZXMoY2hhbm5lbCkpIHtcclxuICAgICAgLy8gRGVsaWJlcmF0ZWx5IHN0cmlwIGV2ZW50IGFzIGl0IGluY2x1ZGVzIGBzZW5kZXJgXHJcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IChldmVudDogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gZnVuYyguLi5hcmdzKTtcclxuICAgICAgaXBjUmVuZGVyZXIub24oY2hhbm5lbCwgc3Vic2NyaXB0aW9uKTtcclxuICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgc3luY01zZzogKGNoYW5uZWw6IHN0cmluZywgZGF0YT86IGFueSkgPT4ge1xyXG4gICAgaWYgKHZhbGlkQ2hhbm5lbHMuaW5jbHVkZXMoY2hhbm5lbCkpIHtcclxuICAgICAgcmV0dXJuIGlwY1JlbmRlcmVyLnNlbmRTeW5jKGNoYW5uZWwsIGRhdGEpOyAvLyBwcmludHMgXCJwb25nXCJcclxuICAgIH1cclxuICB9XHJcbn07XHJcbiIsIi8qXHJcbiAqIEBBdXRob3I6IHN6eFxyXG4gKiBARGF0ZTogMjAyMi0wOC0wMiAxNzo0MjoxNlxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA4LTA1IDAwOjAwOjQ3XHJcbiAqIEBEZXNjcmlwdGlvbjpcclxuICogQEZpbGVQYXRoOiBcXHB1c2gtbWFya2Rvd25cXHBhY2thZ2VzXFxwcmVsb2FkXFxzcmNcXGJsb2ctYXBpLnRzXHJcbiAqL1xyXG5pbXBvcnQgTWV0YVdlYmxvZyBmcm9tICdtZXRhd2VibG9nLWFwaSc7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuY29uc3QgTUVESUFfTUlNRV9UWVBFUzogYW55ID0ge1xyXG4gIGpwZzogJ2ltYWdlL2pwZWcnLFxyXG4gIGpwZWc6ICdpbWFnZS9qcGVnJyxcclxuICBqcGU6ICdpbWFnZS9qcGVnJyxcclxuICBnaWY6ICdpbWFnZS9naWYnLFxyXG4gIHBuZzogJ2ltYWdlL3BuZycsXHJcbiAgYm1wOiAnaW1hZ2UvYm1wJyxcclxuICB0aWY6ICdpbWFnZS90aWZmJyxcclxuICB0aWZmOiAnaW1hZ2UvdGlmZicsXHJcbiAgaWNvOiAnaW1hZ2UveC1pY29uJyxcclxuICB3ZWJwOiAnaW1hZ2Uvd2VicCdcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBibG9nQXBpID0ge1xyXG4gIGluaXRCbG9nQXBpKHNpdGVVcmw6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIG5ldyBNZXRhV2VibG9nKHNpdGVVcmwpO1xyXG4gIH0sXHJcbiAgbmV3UG9zdChtZXRhV2VibG9nOiBNZXRhV2VibG9nLCB1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCBwb3N0OiBhbnkpIHtcclxuICAgIHJldHVybiBtZXRhV2VibG9nLm5ld1Bvc3QoJycsIHVzZXJuYW1lLCBwYXNzd29yZCwgcG9zdCwgdHJ1ZSk7XHJcbiAgfSxcclxuICBlZGl0UG9zdChtZXRhV2VibG9nOiBNZXRhV2VibG9nLCBwb3N0aWQ6IHN0cmluZywgdXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgcG9zdDogYW55KSB7XHJcbiAgICByZXR1cm4gbWV0YVdlYmxvZy5lZGl0UG9zdChwb3N0aWQsIHVzZXJuYW1lLCBwYXNzd29yZCwgcG9zdCwgdHJ1ZSk7IC8vIHJldHVybiB0cnVlXHJcbiAgfSxcclxuICBnZXRQb3N0KG1ldGFXZWJsb2c6IE1ldGFXZWJsb2csIHBvc3RpZDogc3RyaW5nLCB1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gbWV0YVdlYmxvZy5nZXRQb3N0KHBvc3RpZCwgdXNlcm5hbWUsIHBhc3N3b3JkKTtcclxuICB9LFxyXG4gIG5ld01lZGlhT2JqZWN0KG1ldGFXZWJsb2c6IE1ldGFXZWJsb2csIHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIGltZ05hbWU6IHN0cmluZywgZmlsZVBhdGg6IHN0cmluZyk6IGFueSB7XHJcbiAgICBjb25zdCBiaXRzID0gQnVmZmVyLmZyb20oZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKSk7XHJcbiAgICBjb25zdCBtZWRpYU9iamVjdDogYW55ID0ge1xyXG4gICAgICBuYW1lOiBpbWdOYW1lLFxyXG4gICAgICB0eXBlOiBnZXRNaW1lVHlwZShmaWxlUGF0aCksXHJcbiAgICAgIGJpdHMsXHJcbiAgICAgIG92ZXJ3cml0ZTogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHJldHVybiBtZXRhV2VibG9nLm5ld01lZGlhT2JqZWN0KCcnLCB1c2VybmFtZSwgcGFzc3dvcmQsIG1lZGlhT2JqZWN0KTtcclxuICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBnZXRNaW1lVHlwZShmaWxlUGF0aDogc3RyaW5nKSB7XHJcbiAgbGV0IGV4dCA9IHBhdGguZXh0bmFtZShmaWxlUGF0aCk7XHJcbiAgZXh0ID0gKGV4dCAmJiBleHQubGVuZ3RoID4gMSAmJiBleHQuc3Vic3RyaW5nKDEpKSB8fCAnJzsgLy8ganBnXHJcbiAgY29uc3QgdHlwZSA9IE1FRElBX01JTUVfVFlQRVNbZXh0XTtcclxuICBpZiAoIXR5cGUpIHRocm93IG5ldyBFcnJvcihgJHtleHR9IOatpOWqkuS9k+WQjue8gOS4jeaUr+aMgWApO1xyXG4gIHJldHVybiB0eXBlO1xyXG59XHJcblxyXG4iXSwibmFtZXMiOlsib3B0aW9ucyIsInVybCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsTUFBQSxVQUFBO0FBQUEsRUFBZ0IsTUFBQTtBQUFBLEVBQ1IsS0FBQTtBQUFBLEVBQ0QsVUFBQTtBQUFBLElBQ0ssU0FBQTtBQUFBLE1BQ0MsY0FBQTtBQUFBLE1BQ08sU0FBQTtBQUFBLE1BQ0wsYUFBQTtBQUFBLE1BQ0ksV0FBQTtBQUFBLElBQ0Y7QUFBQSxJQUNiLE9BQUE7QUFBQSxNQUNPO0FBQUEsUUFDTCxNQUFBO0FBQUEsUUFDUSxLQUFBO0FBQUEsUUFDRCxVQUFBO0FBQUEsUUFDSyxVQUFBO0FBQUEsUUFDQSxVQUFBO0FBQUEsTUFDQTtBQUFBLElBQ1o7QUFBQSxJQUNGLFFBQUE7QUFBQSxNQUNRLFVBQUE7QUFBQSxNQUNJLGNBQUE7QUFBQSxNQUNJLFdBQUE7QUFBQSxJQUNIO0FBQUEsSUFDYixPQUFBO0FBQUEsSUFDTyxVQUFBO0FBQUEsSUFDRyxVQUFBO0FBQUEsRUFDQTtBQUVkO0FBQ0EsTUFBQSxnQkFBQSxJQUFBLGVBQUEsUUFBQSxPQUFBO0FBQ0EsTUFBQSxjQUFBLElBQUEsZUFBQSxRQUFBO0FBQUEsRUFBOEIsTUFBQTtBQUFBLEVBQ3RCLFVBQUE7QUFBQSxJQUNJLE1BQUE7QUFBQSxNQUNGO0FBQUEsUUFDSixNQUFBO0FBQUEsUUFDUSxVQUFBO0FBQUEsUUFDSSxVQUFBO0FBQUEsTUFDQTtBQUFBLElBQ1o7QUFBQSxJQUNGLGVBQUE7QUFBQSxFQUNlO0FBRW5CLENBQUE7QUFDTyxNQUFBLFFBQUE7QUFBQSxFQUFjLGNBQUE7QUFFakIsV0FBQSxjQUFBLElBQUEsWUFBQSxJQUFBO0FBQUEsRUFBeUM7QUFBQSxFQUMzQyxxQkFBQTtBQUVFLFdBQUEsY0FBQSxNQUFBO0FBQUEsRUFBMkI7QUFBQSxFQUM3QixpQkFBQSxLQUFBLE9BQUE7QUFFRSxrQkFBQSxJQUFBLEtBQUEsS0FBQTtBQUFBLEVBQTRCO0FBQUEsRUFDOUIsaUJBQUEsS0FBQSxPQUFBO0FBRUUsV0FBQSxjQUFBLElBQUEsS0FBQSxLQUFBO0FBQUEsRUFBbUM7QUFBQSxFQUNyQyxlQUFBLEtBQUEsT0FBQTtBQUVFLFdBQUEsWUFBQSxJQUFBLEtBQUEsS0FBQTtBQUFBLEVBQWlDO0FBQUEsRUFDbkMsZUFBQSxLQUFBLE9BQUE7QUFFRSxXQUFBLFlBQUEsSUFBQSxLQUFBLEtBQUE7QUFBQSxFQUFpQztBQUFBLEVBQ25DLFlBQUEsT0FBQTtBQUVFLFdBQUEsY0FBQSxJQUFBLFlBQUEsS0FBQTtBQUFBLEVBQTBDO0FBQUEsRUFDNUMsY0FBQTtBQUVFLFVBQUEsTUFBQSxjQUFBLElBQUEsVUFBQTtBQUNBLFFBQUEsT0FBQSxRQUFBO0FBQThCLGFBQUE7QUFBQTtBQUN6QixhQUFBO0FBQUEsRUFBTztBQUFBLEVBQ2QsV0FBQTtBQUVFLFdBQUEsY0FBQSxJQUFBLFNBQUEsSUFBQTtBQUFBLEVBQXNDO0FBQUEsRUFDeEMsU0FBQSxPQUFBO0FBRUUsV0FBQSxjQUFBLElBQUEsU0FBQSxLQUFBO0FBQUEsRUFBdUM7QUFBQSxFQUN6QyxlQUFBO0FBRUUsa0JBQUEsYUFBQTtBQUFBLEVBQTJCO0FBQUEsRUFDN0Isa0JBQUE7QUFFRSxXQUFBLGNBQUE7QUFBQSxFQUFxQjtBQUV6QjtBQ2pGTyxNQUFBLFNBQUE7QUFBQSxFQUFlLFlBQUEsWUFBQSxRQUFBO0FBQUEsRUFDTCxlQUFBLE1BQUE7QUFFYixRQUFBO0FBQ0UsYUFBQSxZQUFBLFFBQUEsYUFBQSxNQUFBLEVBQUEsVUFBQSxTQUFBLENBQUE7QUFBQSxJQUFtRCxRQUFBO0FBRW5ELGFBQUE7QUFBQSxJQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0YsZ0JBQUEsTUFBQTtBQUVFLFFBQUE7QUFDRSxZQUFBLE1BQUEsWUFBQSxRQUFBLGFBQUEsTUFBQSxFQUFBLFVBQUEsU0FBQSxDQUFBO0FBRUEsYUFBQSxPQUFBLEtBQUEsS0FBQSxRQUFBO0FBQUEsSUFBZ0MsUUFBQTtBQUVoQyxhQUFBO0FBQUEsSUFBTztBQUFBLEVBQ1Q7QUFBQSxFQUNGLGFBQUEsWUFBQSxRQUFBO0FBQUEsRUFDZ0IsaUJBQUEsWUFBQSxRQUFBO0FBQUEsRUFDSSxjQUFBLFlBQUEsUUFBQTtBQUFBLEVBQ0gsZUFBQSxZQUFBLFFBQUE7QUFBQSxFQUNDLFlBQUEsWUFBQSxRQUFBO0FBQUEsRUFDSCxhQUFBLFlBQUEsUUFBQTtBQUFBLEVBQ0MsWUFBQSxPQUFBLE1BQUE7QUFFZCxRQUFBO0FBQ0UsWUFBQSxPQUFBLFlBQUEsUUFBQSxVQUFBLGNBQUEsUUFBQSxLQUFBLE9BQUEsSUFBQSxDQUFBO0FBQ0EsYUFBQSxLQUFBLFlBQUE7QUFBQSxJQUF3QixTQUFBLEdBQUE7QUFFeEIsYUFBQTtBQUFBLElBQU87QUFBQSxFQUNUO0FBQUEsRUFDRixNQUFBLE9BQUE7QUFFRSxRQUFBO0FBQ0UsWUFBQSxPQUFBLFlBQUEsUUFBQSxVQUFBLEtBQUE7QUFDQSxhQUFBLEtBQUEsWUFBQTtBQUFBLElBQXdCLFNBQUEsR0FBQTtBQUd4QixhQUFBO0FBQUEsSUFBTztBQUFBLEVBQ1Q7QUFBQSxFQUNGLFNBQUEsWUFBQSxRQUFBO0FBRUY7QUMzQ08sTUFBQSxXQUFBO0FBQUEsRUFBaUIsY0FBQSxjQUFBLFFBQUE7QUFBQSxFQUNILFVBQUEsY0FBQSxRQUFBO0FBQUEsRUFDSixnQkFBQSxjQUFBLFFBQUE7QUFBQSxFQUNNLGFBQUEsY0FBQSxRQUFBO0FBQUEsRUFDSCxhQUFBLGNBQUEsUUFBQTtBQUFBLEVBQ0EsYUFBQSxjQUFBLFFBQUE7QUFFcEI7QUNIQSxTQUFBLE1BQUEsS0FBQTtBQUNFLFFBQUEsYUFBQSxJQUFBLEtBQUE7QUFDQSxNQUFBLFdBQUEsU0FBQSxHQUFBO0FBQThCLFdBQUE7QUFDOUIsTUFBQTtBQUNFLFFBQUEsSUFBQSxJQUFBLEdBQUE7QUFDQSxXQUFBO0FBQUEsRUFBTyxRQUFBO0FBRVAsV0FBQTtBQUFBLEVBQU87QUFFWDtBQUVBLFNBQUEsVUFBQSxPQUFBO0FBQ0UsU0FBQSxJQUFBLFFBQUEsQ0FBQSxZQUFBO0FBQ0UsUUFBQSxDQUFBLE1BQUEsS0FBQSxHQUFBO0FBQ0UsY0FBQSxLQUFBO0FBQUEsSUFBYTtBQUdmLFVBQUFBLFdBQUE7QUFBQSxNQUFnQixRQUFBO0FBQUEsTUFDTixNQUFBLElBQUEsTUFBQSxLQUFBLEVBQUE7QUFBQSxNQUNTLE1BQUEsSUFBQSxNQUFBLEtBQUEsRUFBQTtBQUFBLE1BQ0EsTUFBQTtBQUFBLElBQ1g7QUFHUixVQUFBLE1BQUEsY0FBQSxRQUFBLFFBQUFBLFVBQUEsQ0FBQSxRQUFBO0FBQ0UsVUFBQSxJQUFBLGVBQUEsUUFBQTtBQUNFLGdCQUFBLEtBQUE7QUFBQSxNQUFhLE9BQUE7QUFFYixnQkFBQSxJQUFBLGFBQUEsT0FBQSxJQUFBLGNBQUEsR0FBQTtBQUFBLE1BQXFEO0FBQUEsSUFDdkQsQ0FBQTtBQUVGLFFBQUEsSUFBQTtBQUFBLEVBQVEsQ0FBQTtBQUVaO0FBQ08sTUFBQSxRQUFBO0FBQUEsRUFBYyxNQUFBLGNBQUFDLE1BQUE7QUFFakIsSUFBQUEsT0FBQSxVQUFBQSxJQUFBO0FBQ0EsV0FBQSxNQUFBLFVBQUFBLElBQUE7QUFBQSxFQUEwQjtBQUFBLEVBQzVCLE9BQUEsU0FBQTtBQUFBLEVBQ0Esb0JBQUE7QUFFRSxXQUFBLFNBQUEsVUFBQSxTQUFBO0FBQUEsRUFBMEI7QUFBQSxFQUM1QixVQUFBLFFBQUE7QUFFRjtBQ2hEQSxNQUFBLGdCQUFBO0FBQUEsRUFBc0I7QUFBQSxFQUNwQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFFRjtBQUNPLE1BQUEsTUFBQTtBQUFBLEVBQVksTUFBQSxDQUFBLFNBQUEsU0FBQTtBQUlmLFFBQUEsY0FBQSxTQUFBLE9BQUEsR0FBQTtBQUNFLGVBQUEsWUFBQSxLQUFBLFNBQUEsSUFBQTtBQUFBLElBQThCO0FBQUEsRUFDaEM7QUFBQSxFQUNGLFNBQUEsQ0FBQSxTQUFBLFNBQUE7QUFFRSxRQUFBLGNBQUEsU0FBQSxPQUFBLEdBQUE7QUFFRSxZQUFBLGVBQUEsQ0FBQSxVQUFBLFNBQUEsS0FBQSxHQUFBLElBQUE7QUFDQSxlQUFBLFlBQUEsR0FBQSxTQUFBLFlBQUE7QUFDQSxhQUFBLE1BQUE7QUFDRSxpQkFBQSxZQUFBLGVBQUEsU0FBQSxZQUFBO0FBQUEsTUFBZ0Q7QUFBQSxJQUNsRDtBQUFBLEVBQ0Y7QUFBQSxFQUNGLFNBQUEsQ0FBQSxTQUFBLFNBQUE7QUFFRSxRQUFBLGNBQUEsU0FBQSxPQUFBLEdBQUE7QUFDRSxhQUFBLFNBQUEsWUFBQSxTQUFBLFNBQUEsSUFBQTtBQUFBLElBQXlDO0FBQUEsRUFDM0M7QUFFSjtBQ3hDQSxNQUFBLG1CQUFBO0FBQUEsRUFBOEIsS0FBQTtBQUFBLEVBQ3ZCLE1BQUE7QUFBQSxFQUNDLEtBQUE7QUFBQSxFQUNELEtBQUE7QUFBQSxFQUNBLEtBQUE7QUFBQSxFQUNBLEtBQUE7QUFBQSxFQUNBLEtBQUE7QUFBQSxFQUNBLE1BQUE7QUFBQSxFQUNDLEtBQUE7QUFBQSxFQUNELE1BQUE7QUFFUDtBQUVPLE1BQUEsVUFBQTtBQUFBLEVBQWdCLFlBQUEsU0FBQTtBQUVuQixXQUFBLElBQUEsb0JBQUEsUUFBQSxPQUFBO0FBQUEsRUFBNkI7QUFBQSxFQUMvQixRQUFBLFlBQUEsVUFBQSxVQUFBLE1BQUE7QUFFRSxXQUFBLFdBQUEsUUFBQSxJQUFBLFVBQUEsVUFBQSxNQUFBLElBQUE7QUFBQSxFQUE0RDtBQUFBLEVBQzlELFNBQUEsWUFBQSxRQUFBLFVBQUEsVUFBQSxNQUFBO0FBRUUsV0FBQSxXQUFBLFNBQUEsUUFBQSxVQUFBLFVBQUEsTUFBQSxJQUFBO0FBQUEsRUFBaUU7QUFBQSxFQUNuRSxRQUFBLFlBQUEsUUFBQSxVQUFBLFVBQUE7QUFFRSxXQUFBLFdBQUEsUUFBQSxRQUFBLFVBQUEsUUFBQTtBQUFBLEVBQW9EO0FBQUEsRUFDdEQsZUFBQSxZQUFBLFVBQUEsVUFBQSxTQUFBLFVBQUE7QUFFRSxVQUFBLE9BQUEsT0FBQSxLQUFBLFlBQUEsUUFBQSxhQUFBLFFBQUEsQ0FBQTtBQUNBLFVBQUEsY0FBQTtBQUFBLE1BQXlCLE1BQUE7QUFBQSxNQUNqQixNQUFBLFlBQUEsUUFBQTtBQUFBLE1BQ29CO0FBQUEsTUFDMUIsV0FBQTtBQUFBLElBQ1c7QUFFYixXQUFBLFdBQUEsZUFBQSxJQUFBLFVBQUEsVUFBQSxXQUFBO0FBQUEsRUFBb0U7QUFFeEU7QUFFQSxTQUFBLFlBQUEsVUFBQTtBQUNFLE1BQUEsTUFBQSxjQUFBLFFBQUEsUUFBQSxRQUFBO0FBQ0EsUUFBQSxPQUFBLElBQUEsU0FBQSxLQUFBLElBQUEsVUFBQSxDQUFBLEtBQUE7QUFDQSxRQUFBLE9BQUEsaUJBQUE7QUFDQSxNQUFBLENBQUE7QUFBVyxVQUFBLElBQUEsTUFBQSxHQUFBLHNEQUFBO0FBQ1gsU0FBQTtBQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
