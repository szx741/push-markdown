import { createStore } from 'vuex';

export default createStore({
  state: {
    theme: 'github'
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme
    }
  },
  actions: {},
  modules: {}
});
