/*
 * @Author: szx
 * @Date: 2021-07-05 17:34:12
 * @LastEditTime: 2021-07-05 22:00:08
 * @Description:
 * @FilePath: \push-markdown\src\config\browser.options.ts
 */
/**
 * 软件数据和配置
 * C:\Users\{用户名}\AppData\Roaming
 * 共享
 * C:\ProgramData\Intel\ShaderCache\i-notes{xx}
 * 快捷方式
 * C:\Users\{用户名}\AppData\Roaming\Microsoft\Windows\Recent
 * 电脑自动创建缓存
 * C:\Windows\Prefetch\I-NOTES.EXE{xx}
 */

/** */
import path from 'path';
const globalEnv = process.env.NODE_ENV;
const devWid = globalEnv === 'development' ? 950 : 0;
const devHei = globalEnv === 'development' ? 600 : 0;

// {
//   // frame: false, // 无边框
//   hasShadow: true,
//   // transparent: true, // 透明
//   width: 1200,
//   height: 800,
//   webPreferences: {
//     // preload: './preload.ts',
//     nodeIntegration: true,
//     enableRemoteModule: true,
//     contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
//     // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION as unknown as boolean as unknown as boolean,
//     // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
//     // 取消跨域限制
//     webSecurity: false
//   },
//   // eslint-disable-next-line
//   icon: `${process.env.VUE_APP_BASE_URL}/app.ico`
// }
/**
 * BrowserWindow的配置项
 * @param type 单独给编辑窗口的配置
 */
const browserWindowOption = {
  minHeight: 180,
  minWidth: 320,
  // frame: false, // 无边框
  hasShadow: true,
  // transparent: true, // 透明
  width: 1200,
  height: 800,
  webPreferences: {
    // preload: './preload.ts',
    nodeIntegration: true,
    // enableRemoteModule: true,
    contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION as unknown as boolean as unknown as boolean,
    // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    // 取消跨域限制
    // webSecurity: false
  },
  // eslint-disable-next-line
  icon: `${process.env.VUE_APP_BASE_URL}/app.ico`
};

/**
 * 开发环境: http://localhost:8080
 * 正式环境: file://${__dirname}/index.html
 */
const winURL =
  globalEnv === 'development'
    ? 'http://localhost:8080'
    : `
file://${__dirname}/index.html`;

export { browserWindowOption, winURL };
