/*
 * @Author: szx
 * @Date: 2021-11-19 12:54:18
 * @LastEditTime: 2022-07-28 21:21:30
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\store\index.ts
 */
import { createStore } from 'vuex';
import { moduleSites } from './sitesConfig';
import { moduleThemes } from './themesConfig';

export const vuexStore = createStore({
  modules: {
    sites: moduleSites
    // themes: themesConfig
  }
});
