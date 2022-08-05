/*
 * @Author: szx
 * @Date: 2022-07-23 13:24:12
 * @LastEditTime: 2022-08-05 10:53:41
 * @Description:
 * @FilePath: \push-markdown\vitest.config.js
 */
/**
 * Config for global end-to-end tests
 * placed in project root tests folder
 * @type {import('vite').UserConfig}
 * @see https://vitest.dev/config/
 */
 const config = {
  test: {
    /**
     * By default, vitest searches for the test files in all packages.
     * For e2e tests, have vitest search only in the project root 'tests' folder.
     */
    include: ['./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    /**
     * The default timeout of 5000ms is sometimes not enough for playwright.
     */
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
};

export default config;
