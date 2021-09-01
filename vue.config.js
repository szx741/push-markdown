/* eslint-disable */
/*
 * @Author: szx
 * @Date: 2021-07-04 14:14:13
 * @LastEditTime: 2021-09-01 21:14:40
 * @Description:
 * @FilePath: \push-markdown\vue.config.js
 */

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

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
        }
      }
    },
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, 'common/assets/style.scss')]
      // preProcessor: '',
      // patterns: []
    }
  }
};
