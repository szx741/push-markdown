/*
 * @Author: szx
 * @Date: 2022-07-23 13:21:25
 * @LastEditTime: 2023-04-10 14:14:25
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
    releaseNotes: "添加批量上传界面，在文件-批量上传中，使用前建议看看注意事项\n修复关闭当前页面左侧的页面，导致后续页面重新读取渲染的问题（vue的v-for索引key值的问题，经典问题）\n修复外链图片没有加上fancybox的问题（仅支持argon主题）",
    releaseDate: '2023-4-10'
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
