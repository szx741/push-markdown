/*
 * @Author: szx
 * @Date: 2022-07-23 13:21:25
 * @LastEditTime: 2023-04-07 15:06:54
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
  releaseInfo: {
    releaseNotes: "添加设置文章头图，可以在上传的时候直接设置头图，只需要在文件头部的参数中加入thumbnai和图片路径即可 \n 注意：此版本的数据结构与2.0.X不一致，都赖作者没有做好规划！建议重新导入数据，看使用教程的说明！",
    releaseDate: '2023-4-7'
  },
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
