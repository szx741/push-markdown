<!--
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2021-07-07 19:25:17
 * @Description: 
 * @FilePath: \push-markdown\src\components\HelloWorld.vue
-->
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>{{ $t('meta.abstract') }}</p>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import i18n from '../common/lib/language/index';
  export default defineComponent({
    name: 'HelloWorld',
    props: {
      msg: String
    },

    methods: {},

    setup() {
      console.log(i18n.global.t('meta.abstract'));
    }
  });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
