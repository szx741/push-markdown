/* eslint-disable */
/*
 * @Author: szx
 * @Date: 2021-07-04 14:14:13
 * @LastEditTime: 2022-07-21 22:45:55
 * @Description:
 * @FilePath: \push-markdown\vue.config.js
 */

const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: './',
  devServer: {
    host: '0.0.0.0',
    port: 8080
  },
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    externals: {
      fs: require('fs-extra'),
      tls: require('tls'),
      net: require('net'),
      child_process: require('child_process')
    }
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
        }
      }
    }
  }
};
