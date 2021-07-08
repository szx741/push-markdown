<!--
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2021-07-08 13:13:27
 * @Description: 
 * @FilePath: \push-markdown\src\views\Home.vue
-->
<template>
  <div class="home">
    <img alt="Vue logo" src="../common/assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import HelloWorld from '@/components/Main.vue'; // @ is an alias to /src

  export default defineComponent({
    name: 'Home',
    components: {
      HelloWorld
    }
  });
</script>
