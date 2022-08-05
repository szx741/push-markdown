<!--
 * @Author: szx
 * @Date: 2021-11-14 19:41:30
 * @LastEditTime: 2022-08-04 18:59:35
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\components\FilesViewer.vue
-->
<script setup lang="ts">
  import { watch, ref, toRef } from 'vue';
  import naturalCompare from 'natural-compare-lite';
  import { nodeFs, nodePath, other } from '#preload';

  interface FolderFile {
    name: string;
    path: string;
    directory: boolean;
  }

  const props = defineProps<{
      pathDir: string;
    }>(),
    emit = defineEmits<{
      (e: 'forward', file: string): void;
      (e: 'back'): void;
      (e: 'openFile', files: string): void;
    }>(),
    pathDir = toRef(props, 'pathDir'),
    files = ref(filesOrDir());

  watch(pathDir, () => {
    files.value = filesOrDir();
  });

  function onFileClick(folderFile: FolderFile) {
    if (folderFile.directory) emit('forward', folderFile.name);
    else emit('openFile', nodePath.pathJoin(folderFile.path, folderFile.name));
  }

  function rightClickOpen(folderFile: FolderFile) {
    if (folderFile.directory) other.shell.showItemInFolder(pathDir.value);
    else other.shell.openPath(nodePath.pathJoin(folderFile.path, folderFile.name));
  }

  function filesOrDir() {
    if (pathDir.value == '') return [];
    const path = pathDir.value,
      fileNames = nodeFs.fsReaddirSync(path),
      allMD: Array<FolderFile> = [];
    fileNames.map((fileName: string) => {
      const stats = nodeFs.isFileOrDir(path, fileName);
      if (stats || nodePath.pathExtname(fileName) == '.md')
        allMD.push({
          name: fileName,
          path: path,
          directory: stats
        });
    });
    return allMD.sort((a: any, b: any) => {
      if (a.directory === b.directory) {
        return naturalCompare(a.name, b.name);
      }
      return a.directory ? -1 : 1;
    });
  }
</script>

<template>
  <div class="file-box scroll-bar">
    <div class="file-box-header">
      <p> {{ pathDir }}</p>
      <div class="div-hr"></div>
    </div>
    <div class="file-box-table">
      <div class="file-box-tr" @click="$emit('back')">
        <div class="icon-row">
          <svg class="icon-folder" viewBox="0 0 1024 1024">
            <path
              d="M529.664 213.333333H896a42.666667 42.666667 0 0 1 42.666667 42.666667v597.333333a42.666667 42.666667 0 0 1-42.666667 42.666667H128a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h316.330667l85.333333 85.333333zM853.333333 469.333333H170.666667v341.333334h682.666666v-341.333334z m0-85.333333V298.666667h-358.997333l-85.333333-85.333334H170.666667v170.666667h682.666666z"
            ></path>
          </svg>
        </div>
        <div>...</div>
      </div>

      <div v-for="file in files" :key="file.name" class="file-box-tr" @click="() => onFileClick(file)" @click.right="() => rightClickOpen(file)">
        <div class="icon-row">
          <svg v-if="file.directory" class="icon-folder" viewBox="0 0 1024 1024">
            <path
              d="M170.666667 213.333333v597.333334h682.666666V298.666667h-358.997333l-85.333333-85.333334H170.666667z m358.997333 0H896a42.666667 42.666667 0 0 1 42.666667 42.666667v597.333333a42.666667 42.666667 0 0 1-42.666667 42.666667H128a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h316.330667l85.333333 85.333333z"
            ></path>
          </svg>

          <svg v-else class="icon-file" viewBox="0 0 1024 1024">
            <path
              d="M128 128h768a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H128a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z m42.666667 85.333333v597.333334h682.666666V213.333333H170.666667z m128 448H213.333333v-298.666666h85.333334l85.333333 85.333333 85.333333-85.333333h85.333334v298.666666h-85.333334v-170.666666l-85.333333 85.333333-85.333333-85.333333v170.666666z m469.333333-128h85.333333l-128 128-128-128h85.333334v-170.666666h85.333333v170.666666z"
            ></path>
          </svg>
        </div>
        <div>{{ file.name }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .file-box {
    min-width: 150px;
    width: 18%; /*左侧初始化宽度*/
    margin: 5px 0;
    padding: 0 8px 0 10px;
    border-right: 2px solid;
    overflow-y: auto;
    height: 100%;
  }
  .scroll-bar::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }

  .file-box-header {
    background-color: var(--color-canvas-default);
    padding-top: 10px;
    opacity: 0.9;
    top: 0;
    position: sticky;
    z-index: 99;
    p {
      font-weight: bold;
      word-break: break-all;
      margin-bottom: 5px;
    }
  }
  .file-box-hr {
    border-bottom: 2px solid var(--color-prettylights-syntax-comment);
  }

  .file-box-table {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .file-box-tr {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    border-bottom: 1px solid;
    margin: 1px;
  }

  .icon-row {
    margin-top: 6px;
    width: 2em;
  }
  .icon-folder {
    width: 1em;
  }
  .icon-file {
    width: 1.1em;
  }
</style>
