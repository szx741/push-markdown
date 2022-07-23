<!--
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2022-07-23 22:11:50
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\App.vue
-->
<script lang="ts">
  import { useI18n } from 'vue-i18n';
  import { ipc, store } from '#preload';
  export default {
    name: 'PublishMarkdown',
    setup() {
      // const theme = 'markdown-body-light';
      const { t, locale } = useI18n();
      ipc.receive('menu.language', (data: any) => {
        console.log('修改后的locale', locale.value);
        locale.value = data; // change!
      });
      locale.value = store.getLanguage() === 'en' ? 'en' : 'zh';
      console.log('初始化的locale', locale.value, store.getTheme());
      return { t, locale };
    }
  };
</script>

<template>
  <router-view></router-view>
  <!-- <img alt="Vue logo" src="../assets/logo.svg" width="150" /> -->
</template>

<!-- <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style> -->
<style lang="scss">
  @import 'github-markdown-css/github-markdown.css';
  #app {
    height: 100%;
  }
</style>
