/*
 * @Author: szx
 * @Date: 2021-11-19 12:54:18
 * @LastEditTime: 2022-07-23 21:09:11
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\store\index.ts
 */
import { createStore } from 'vuex';
import { store } from '#preload';

export default createStore({
  state: {
    theme: store.getTheme()
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme;
    }
  },
  actions: {},
  modules: {}
});
