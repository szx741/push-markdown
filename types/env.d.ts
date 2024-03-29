/*
 * @Author: szx
 * @Date: 2022-07-23 13:20:21
 * @LastEditTime: 2022-08-05 10:56:10
 * @Description:
 * @FilePath: \push-markdown\types\env.d.ts
 */
/// <reference types="vite/client" />

/**
 * Describes all existing environment variables and their types.
 * Required for Code completion and type checking
 *
 * Note: To prevent accidentally leaking env variables to the client, only variables prefixed with `VITE_` are exposed to your Vite-processed code
 *
 * @see https://github.com/vitejs/vite/blob/cab55b32de62e0de7d7789e8c2a1f04a8eae3a3f/packages/vite/types/importMeta.d.ts#L62-L69 Base Interface
 * @see https://vitejs.dev/guide/env-and-mode.html#env-files Vite Env Variables Doc
 * @see https://vitejs.cn/guide/env-and-mode.html#intellisense
 * 相当于给VITE_前缀的自定义环境变量一个TypeScript的智能提示
 */
interface ImportMetaEnv {
  /**
   * URL where `renderer` web page is running.
   * This variable is initialized in scripts/watch.ts
   */
  readonly VITE_DEV_SERVER_URL: undefined | string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
