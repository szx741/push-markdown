/*
 * @Author: szx
 * @Date: 2022-07-23 13:40:31
 * @LastEditTime: 2022-07-23 17:20:38
 * @Description:
 * @FilePath: \push-markdown\packages\main\vite.config.js
 */
import { node } from '../../.electron-vendors.cache.json';
import { join } from 'path';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/'
    }
  },
  build: {
    ssr: true,
    sourcemap: 'inline',
    // 因为electron主进程是有node.js的
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs']
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].cjs'
      }
    },
    emptyOutDir: true,
    brotliSize: false
  }
};

export default config;
