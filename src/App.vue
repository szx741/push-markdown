<!--
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2021-07-08 17:24:05
 * @Description: 
 * @FilePath: \push-markdown\src\App.vue
-->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<!-- <template>
  <div id="app">
    <router-link to="/">Home</router-link>
  </div>
  <router-view />
</template> -->

<script lang="ts">
  import { useI18n } from 'vue-i18n';
  export default {
    name: 'PublishMarkdown',
    setup() {
      const { t, locale } = useI18n();
      window.api.receive('menu.language', (data: any) => {
        console.log('修改后的locale', locale.value);
        locale.value = data; // change!
      });
      locale.value = window.api.getLanguage() === 'en' ? 'en' : 'zh';
      console.log('初始化的locale', locale.value);
      return { t, locale };
    }
  };
</script>

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
  @import '~github-markdown-css/github-markdown.css';

  /* CSS */
  #app {
    height: 100%;
  }
</style>
