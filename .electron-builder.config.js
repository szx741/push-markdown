/*
 * @Author: szx
 * @Date: 2022-07-23 13:21:25
 * @LastEditTime: 2022-08-06 20:26:13
 * @Description:
 * @FilePath: \push-markdown\.electron-builder.config.js
 */
const packageConf = require('./package.json');

if (process.env.VITE_APP_VERSION === undefined) {
  // const now = new Date();
  // process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${now.getUTCMonth() + 1}.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`;
  process.env.VITE_APP_VERSION = packageConf.version;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: 'com.szx.life.push_markdown',
  productName: 'push-markdown',
  directories: {
    output: 'dist'
  },
  files: ['packages/**/dist/**'],
  extraResources: './public/**',
  extraMetadata: {
    version: process.env.VITE_APP_VERSION
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    installerIcon: './public/app.ico',
    createStartMenuShortcut: true,
    shortcutName: 'push-markdown'
  },
  win: {
    icon: './public/app.ico',
    target: [
      {
        target: 'nsis',
        arch: 'x64'
      }
    ]
  },
  mac: {
    icon: './public/app.ico',
    target: [
      {
        target: 'default'
      }
    ]
  },
  publish: [
    {
      provider: 'generic',
      url: 'http://download.szx.life/push-markdown'
    }
  ]
};

module.exports = config;
