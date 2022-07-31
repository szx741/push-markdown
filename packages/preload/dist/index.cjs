"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const crypto = require("crypto");
const Store = require("electron-store");
const fs = require("fs");
const path = require("path");
const md5File = require("md5-file");
const MetaWeblog = require("metaweblog-api");
const electron = require("electron");
const _interopDefaultLegacy = (e) => e && typeof e === "object" && "default" in e ? e : { default: e };
const Store__default = /* @__PURE__ */ _interopDefaultLegacy(Store);
const fs__default = /* @__PURE__ */ _interopDefaultLegacy(fs);
const path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
const md5File__default = /* @__PURE__ */ _interopDefaultLegacy(md5File);
const MetaWeblog__default = /* @__PURE__ */ _interopDefaultLegacy(MetaWeblog);
function sha256sum(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}
const versions = process.versions;
const storeSettings = new Store__default.default({ name: "settings" });
const storeRecord = new Store__default.default({ name: "use-record" });
const store = {
  getLanguage() {
    return storeSettings.get("language", "zh");
  },
  getStoreSettingsClear() {
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
    return storeSettings.set("show-file", value);
  },
  getShowFile() {
    const res = storeSettings.get("show-file", true);
    if (typeof res === "boolean")
      return res;
    else
      return true;
  },
  newStore(name) {
    return new Store__default.default({ name }).path;
  },
  storeSet(name, key, value) {
    const store2 = new Store__default.default({ name });
    return store2.set(key, value);
  },
  storeGet(name, key, value) {
    const store2 = new Store__default.default({ name });
    return store2.get(key);
  },
  getTheme() {
    return storeSettings.get("theme", true);
  },
  setTheme(theme) {
    return storeSettings.set("theme", theme);
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
const other = {
  md5(file) {
    return md5File__default.default.sync(file);
  },
  async checkUrlValid(url) {
    return true;
  },
  metaWeblog(url) {
    return new MetaWeblog__default.default(url);
  },
  shell: electron.shell
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
  "process.versions",
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
    } else
      return () => {
      };
  },
  syncMsg: (channel, data) => {
    if (validChannels.includes(channel)) {
      return electron.ipcRenderer.sendSync(channel, data);
    }
  }
};
exports.ipc = ipc;
exports.nodeFs = nodeFs;
exports.nodePath = nodePath;
exports.other = other;
exports.sha256sum = sha256sum;
exports.store = store;
exports.versions = versions;
const { contextBridge } = require("electron");
;
contextBridge.exposeInMainWorld("__electron_preload__ipc", exports.ipc);
;
contextBridge.exposeInMainWorld("__electron_preload__nodeFs", exports.nodeFs);
;
contextBridge.exposeInMainWorld("__electron_preload__nodePath", exports.nodePath);
;
contextBridge.exposeInMainWorld("__electron_preload__other", exports.other);
;
contextBridge.exposeInMainWorld("__electron_preload__sha256sum", exports.sha256sum);
;
contextBridge.exposeInMainWorld("__electron_preload__store", exports.store);
;
contextBridge.exposeInMainWorld("__electron_preload__versions", exports.versions);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6W10sInNvdXJjZXNDb250ZW50IjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
