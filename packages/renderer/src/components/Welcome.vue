<!--
 * @Author: szx
 * @Date: 2021-07-07 17:32:39
 * @LastEditTime: 2022-08-03 23:09:03
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\components\Welcome.vue
-->
<!-- 欢迎页面 -->
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { setLinks } from '../utils/tools';
  const introduction = ref();

  onMounted(() => {
    // 设置链接，应用内的链接和网页链接分开来设置
    setLinks(introduction.value);
  });
</script>

<template>
  <div class="wel-container">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div ref="introduction" v-html="$t('introduction')"></div>
  </div>
</template>

<style lang="scss" scoped>
  .wel-container {
    height: 100%;
    overflow-y: auto;
    padding: 20px 50px;
    box-sizing: border-box;
  }
  ::-webkit-scrollbar {
    display: none;
  }
</style>
