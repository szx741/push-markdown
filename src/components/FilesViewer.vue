<!--
 * @Author: szx
 * @Date: 2021-11-14 19:41:30
 * @LastEditTime: 2021-11-16 17:36:00
 * @Description: 
 * @FilePath: \push-markdown\src\components\FilesViewer.vue
-->

<template>
  <table>
    <tbody>
      <tr class="clickable" @click="$emit('back')">
        <td class="icon-row">
          <svg class="icon-folder" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path
              d="M527.9 224H480v-48c0-26.5-21.5-48-48-48H272l-64-64H48C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h400c16.5 0 31.9-8.5 40.7-22.6l79.9-128c20-31.9-3-73.4-40.7-73.4zM48 118c0-3.3 2.7-6 6-6h134.1l64 64H426c3.3 0 6 2.7 6 6v42H152c-16.8 0-32.4 8.8-41.1 23.2L48 351.4zm400 282H72l77.2-128H528z"
            />
          </svg>
        </td>
        <td>...</td>
        <td></td>
      </tr>

      <tr v-for="file in files" :key="file.name" class="clickable" @click="onFileClick(file)">
        <td class="icon-row">
          <svg v-if="file.directory" class="icon-folder" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M464 128H272l-54.63-54.63c-6-6-14.14-9.37-22.63-9.37H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zm0 272H48V112h140.12l54.63 54.63c6 6 14.14 9.37 22.63 9.37H464v224z"
            />
          </svg>
          <!-- <svg v-else class="icon-file" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path
              d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48z"
            />
          </svg> -->
          <svg v-else class="icon-file" t="1637054972741" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2452" width="18" height="18">
            <path
              d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326z m1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494z"
              p-id="2453"
            ></path>
            <path
              d="M429 481.2c-1.9-4.4-6.2-7.2-11-7.2h-35c-6.6 0-12 5.4-12 12v272c0 6.6 5.4 12 12 12h27.1c6.6 0 12-5.4 12-12V582.1l66.8 150.2c1.9 4.3 6.2 7.1 11 7.1H524c4.7 0 9-2.8 11-7.1l66.8-150.6V758c0 6.6 5.4 12 12 12H641c6.6 0 12-5.4 12-12V486c0-6.6-5.4-12-12-12h-34.7c-4.8 0-9.1 2.8-11 7.2l-83.1 191-83.2-191z"
              p-id="2454"
            ></path>
          </svg>
        </td>
        <td>{{ file.name }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: ['files'],
    setup(_: any, { emit }: { emit: any }) {
      const onFileClick = (file: any) => {
        console.log('onFileClick:', file);
        if (file.directory) emit('folderclick', file);
        else {
          console.log(window.api.pathJoin(file.path, file.name));
          emit('mdclick', window.api.pathJoin(file.path, file.name));
        }
      };
      return { onFileClick };
    }
  });
</script>

<style scoped>
  /* tbody,
  td,
  tfoot,
  th,
  thead,
  tr {
    border-color: inherit;
    border-style: solid;
    border-width: 0;
  } */

  table {
    border-collapse: collapse;
  }
  table,
  tbody {
    width: 100%;
  }
  .clickable {
    cursor: pointer;
    height: 30px;
    width: 100%;
    border-bottom: 1px solid #dee2e6;
    justify-content: center;
  }

  .icon-row {
    margin-left: 10em;
    width: 2em;
  }
  .icon-folder {
    width: 1em;
  }
  .icon-file {
    width: 1.1em;
  }
</style>
