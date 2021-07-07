<!--
 * @Author: szx
 * @Date: 2021-07-07 17:32:39
 * @LastEditTime: 2021-07-07 20:11:40
 * @Description: 
 * @FilePath: \push-markdown\src\components\Welcome.vue
-->
<!-- 欢迎页面 -->

<template>
  <div class="container">
    <div class="markdown-body">
      <div v-html="$t('introduction')" ref="introduction"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import * as utils from '@/logic/utils';

  export default defineComponent({
    name: 'Welcome',
    data() {
      return {};
    },
    methods: {
      setLinks() {
        const ref = this.$refs['introduction'];
        console.log(ref);
        utils.setLinks(ref);
      }
    },
    mounted() {
      this.setLinks();
    },
    updated() {
      this.setLinks();
    }
  });
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding: 50px;
    box-sizing: border-box;
  }
</style>
