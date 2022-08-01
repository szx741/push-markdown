/*
 * @Author: szx
 * @Date: 2022-07-23 13:40:31
 * @LastEditTime: 2022-08-01 13:00:26
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\vite.config.js
 */
/* eslint-env node */
import vue from '@vitejs/plugin-vue';
import { renderer } from 'unplugin-auto-expose';
import { join } from 'path';

import { chrome } from '../../.electron-vendors.cache.json';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/'
    }
  },
  base: '',
  server: {
    fs: {
      strict: true
    }
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index.html')
    },
    emptyOutDir: true,
    brotliSize: false
  },
  test: {
    environment: 'happy-dom'
  },
  plugins: [
    vue(),
    renderer.vite({
      preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts')
    })
  ]
};

export default config;
