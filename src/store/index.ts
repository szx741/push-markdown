/*
 * @Author: szx
 * @Date: 2021-11-19 12:54:18
 * @LastEditTime: 2021-11-19 21:46:33
 * @Description:
 * @FilePath: \push-markdown\src\store\index.ts
 */
import { createStore } from 'vuex';

export default createStore({
  state: {
    theme: window.api.getTheme()
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme;
    }
  },
  actions: {},
  modules: {}
});
