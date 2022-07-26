<!--
 * @Author: szx
 * @Date: 2021-07-07 17:32:39
 * @LastEditTime: 2022-07-26 19:35:09
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\components\Welcome.vue
-->
<!-- 欢迎页面 -->
<script setup lang="ts">
  import { onMounted, onUpdated, ref } from 'vue';
  import * as utils from '/@/logic/utils';

  const introduction = ref();

  onMounted(() => {
    // 设置链接，应用内的链接和网页链接分开来设置
    utils.setLinks(introduction.value);
  });
  // onUpdated(() => {
  //   console.log('WelCome 页面更新了');
  //   utils.setLinks(introduction.value);
  // });
</script>

<template>
  <div class="container">
    <div class="markdown-body">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div ref="introduction" v-html="$t('introduction')"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 50px;
    box-sizing: border-box;
  }
  ::-webkit-scrollbar {
    display: none;
  }
</style>
