<!--
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2021-07-21 18:46:06
 * @Description: 
 * @FilePath: \push-markdown\src\views\About.vue
-->
<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
  <Welcome></Welcome>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Welcome from '@/components/Welcome.vue'; // @ is an alias to /src

  export default defineComponent({
    name: 'Home',
    components: {
      Welcome
    }
  });
</script>
