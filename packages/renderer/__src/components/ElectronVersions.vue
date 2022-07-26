<!--
 * @Author: szx
 * @Date: 2022-07-26 16:57:40
 * @LastEditTime: 2022-07-26 17:03:08
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\__src\components\ElectronVersions.vue
-->
<script lang="ts" setup>
  import { versions } from '#preload';
</script>

<template>
  <ul id="process-versions">
    <li v-for="(version, lib) in versions" :key="lib">
      <strong>{{ lib }}</strong
      >: v{{ version }}
    </li>
  </ul>
  <code>packages/renderer/src/components/ElectronVersions.vue</code>
</template>

<style scoped>
  ul {
    list-style: none;
  }
</style>
