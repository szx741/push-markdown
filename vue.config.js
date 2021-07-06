/*
 * @Author: szx
 * @Date: 2021-07-04 14:14:13
 * @LastEditTime: 2021-07-06 17:20:35
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
      preload: 'src/preload.ts',
      builderOptions: {
        productName: 'push-markdown',
        copyright: 'Copyright © year ',
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
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
          icon: './public/app.png'
        }
      }
    },
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/less/index.less')]
    }
  }
};
