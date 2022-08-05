/*
 * @Author: szx
 * @Date: 2022-07-23 13:40:31
 * @LastEditTime: 2022-08-05 11:01:22
 * @Description:
 * @FilePath: \push-markdown\packages\preload\vite.config.js
 */
import { chrome } from '../../.electron-vendors.cache.json';
import { preload } from 'unplugin-auto-expose';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  build: {
    ssr: true,
    sourcemap: 'inline',
    target: `chrome${chrome}`, // 这里和main的不同，preload已经算是渲染进程的一部分了，没有node支持了
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
    reportCompressedSize: false
  },
  plugins: [preload.vite()]
};

export default config;
