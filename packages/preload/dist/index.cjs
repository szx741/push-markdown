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
        selected: false
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
const storeRecord = new Store__default.default({ name: "use-record" });
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
      bits
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6W10sInNvdXJjZXNDb250ZW50IjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
