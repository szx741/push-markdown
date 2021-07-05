/*
 * @Author: szx
 * @Date: 2021-07-04 14:14:13
 * @LastEditTime: 2021-07-05 22:00:17
 * @Description:
 * @FilePath: \push-markdown\vue.config.js
 */
/* eslint-disable */
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
process.env.VUE_APP_BASE_URL = resolve('public');

module.exports = {
  publicPath: './',
  devServer: {
    host: '0.0.0.0',
    port: 8080
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src')).set('src', resolve('src')).set('common', resolve('src/common')).set('components', resolve('src/components'));
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      // option: default // description
      // disableMainProcessTypescript: false, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
      // mainProcessTypeChecking: false, // Manually enable type checking during webpack bundling for background file.
      builderOptions: {
        productName: `push-markdown`,
        copyright: `Copyright © year `,
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        win: {
          icon: './public/app.ico',
          target: [
            {
              target: 'nsis', //使用nsis打成安装包，"portable"打包成免安装版
              arch: 'x64' //64位
            }
          ]
        },
        mac: {
          icon: './public/app.png'
        }
      }
    }
  }
};
