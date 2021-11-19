/*
 * @Author: szx
 * @Date: 2021-11-19 12:54:18
 * @LastEditTime: 2021-11-19 17:13:29
 * @Description:
 * @FilePath: \push-markdown\src\store\index.ts
 */
import { createStore } from 'vuex';

export default createStore({
  state: {
    theme: 'light'
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme;
    }
  },
  actions: {},
  modules: {}
});
