<!--
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2021-11-19 17:47:43
 * @Description: 
 * @FilePath: \push-markdown\src\App.vue
-->
<template>
  <!-- <div id="app"> -->
  <router-view></router-view>

  <!-- </div> -->
</template>
<!--<template>
  <div id="app">
    <router-link to="/"></router-link>
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
</template>-->

<script lang="ts">
  import { useI18n } from 'vue-i18n';
  export default {
    name: 'PublishMarkdown',
    setup() {
      const theme = 'markdown-body-light';

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
  @import './common/assets/theme/github-markdown-light.css';
  @import './common/assets/theme/github-markdown-dark.css';
  @import './common/assets/theme/splendor.css';
  @import './common/assets/theme/wysiwyg.css';

  #app {
    height: 100%;
  }
</style>
