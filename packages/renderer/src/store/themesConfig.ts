/*
 * @Author: szx
 * @Date: 2022-07-28 20:08:08
 * @LastEditTime: 2022-07-28 21:21:27
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\store\themesConfig.ts
 */
import { StoreOptions } from 'vuex';
interface state {
  theme: string;
}
import { store } from '#preload';
export const moduleThemes: StoreOptions<state> = {
  state: {
    theme: store.getTheme()
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme;
    }
  }
};
