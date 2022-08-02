<!--
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2022-08-02 20:21:01
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\App.vue
-->
<template>
  <main-comp />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { ipc, store } from '#preload';
  import MainComp from './components/MainComp.vue';
  const { locale } = useI18n();
  ipc.receive('menu.language', (data: string) => {
    console.log('修改后的语言', locale.value);
    locale.value = data; // change!
  });
  locale.value = store.getLanguage() === 'en' ? 'en' : 'zh';
</script>

<style lang="scss">
  #app {
    height: 100%;
  }
</style>
