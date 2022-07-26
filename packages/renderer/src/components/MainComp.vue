<!--
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2022-07-26 22:41:01
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\components\MainComp.vue
-->
<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import naturalCompare from 'natural-compare-lite';

  // import File from './File.vue';
  import FilesViewer from './FilesViewer.vue';
  import TabTitle from './TabTitle.vue';
  import Welcome from './Welcome.vue';
  import Markdown from './Markdown.vue';
  import Settings from './Settings.vue';

  import { nodePath, ipc, nodeFs, store } from '#preload';
  import * as useRecord from '/@/logic/useRecord';
  import * as utils from '/@/logic/utils';
  import * as statusBar from '/@/logic/statusBar';
  // import store from '../store/index';

  const tabs = ref(useRecord.getTabs()),
    current = ref(useRecord.getCurrentTab()),
    file = ref(nodePath.pathDirname(tabs.value[current.value]?.file || ipc.syncMsg('__static'))),
    statusText = ref(''),
    showFile = ref(store.getShowFile()),
    { t } = useI18n();

  watch(tabs, (value) => useRecord.saveTabs(value), { deep: true });
  watch(
    current,
    (curr) => {
      const curFile = tabs.value[curr].file;
      file.value = curFile ? nodePath.pathDirname(curFile) : nodePath.pathDirname(ipc.syncMsg('__static'));
      useRecord.saveCurrentTab(curr);
    },
    { deep: true }
  );

  onMounted(() => {
    // store.commit('setTheme', preStore.getTheme());
    statusBar.setCallback((text: string) => {
      statusText.value = text;
    });
    ipc.receive('menu.open', (data: any) => {
      openFile(data);
    });
    ipc.receive('menu.settings', () => {
      const index = tabs.value.findIndex((tab: any) => tab.type === 'settings');
      if (index === -1) {
        addTab({ type: 'settings' });
      } else {
        selectTab(index);
      }
    });
    ipc.receive('menu.showfile', () => {
      showFile.value = !showFile.value;
      store.setShowFile(showFile.value);
    });
    ipc.receive('menu.closetab', () => {
      closeTab(current.value);
    });
    ipc.receive('menu.reloadfile', () => {
      refreshTab(current.value);
    });
    ipc.receive('menu.welcome', () => {
      const index = tabs.value.findIndex((tab: any) => tab.type === 'welcome');
      if (index === -1) {
        addTab({ type: 'welcome' });
      } else {
        selectTab(index);
      }
    });
    ipc.receive('menu.sample', () => {
      openFile(utils.getSampleFile());
    });
    // ipc.receive('menu.theme', (theme: any) => {
    //   store.commit('setTheme', theme);
    // });
  });

  function back() {
    file.value = nodePath.pathDirname(file.value);
  }
  function openDir(folder: any) {
    file.value = nodePath.pathJoin(file.value, folder);
  }
  function filesOrDir() {
    if (file.value == '') return [];
    const path = file.value;
    const fileNames = nodeFs.fsReaddirSync(path);
    const allMD: Array<any> = [];
    fileNames.map((file: string) => {
      const stats = nodeFs.isFileOrDir(path, file);
      if (stats[1] || nodePath.pathExtname(file) == '.md')
        allMD.push({
          name: file,
          path: path,
          directory: stats[1]
        });
    });

    return allMD.sort((a: any, b: any) => {
      if (a.directory === b.directory) {
        // return a.name.localeCompare(b.name);
        return naturalCompare(a.name, b.name);
      }
      return a.directory ? -1 : 1;
    });
  }
  // 拖拽上传
  function fileDragover(e: Event) {
    e.preventDefault();
  }
  const MAX_FILE_SIZE = 1000 * 1000;
  function fileDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0]; // 获取到第一个上传的文件对象
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      return alert('文件大小不能超过10M');
    }
    openFile(file.path);
  }
  async function openFile(file: any) {
    console.log('openFile', file);
    const index = tabs.value.findIndex((tab: any) => tab.file === file);
    if (index === -1) {
      if (nodeFs.fsExistsSync(file)) {
        ipc.syncMsg('addRecentDocument', file);
        addTab({
          type: 'markdown',
          file: file,
          title: utils.fileName(file),
          modified: false
        });
      } else {
        statusBar.show(t('readFileNotExists') + file);
      }
    } else {
      selectTab(index);
    }
  }
  function tabTitle(tab: any) {
    switch (tab.type) {
      case 'settings':
        return t('settings');
      case 'welcome':
        return t('welcome');
      case 'markdown':
        return tab.title;
    }
  }
  function setModified(i: number, modified: boolean) {
    tabs.value[i].modified = modified;
  }
  function selectTab(index: any) {
    console.log('select tab:', current.value, '=>', index);
    current.value = index;
  }
  function addTab(tab: any) {
    const pos = Math.min(current.value + 1, tabs.value.length);
    tabs.value.splice(pos, 0, tab);
    current.value = pos;
  }
  async function refreshTab(index: any) {
    const tab = tabs.value[index];
    const file = tab.file;
    if (tab.type === 'markdown' && tab.modified && !utils.isSampleFile(tab.file)) {
      statusBar.show(t('reloadNeedSaveFirst'));
      return;
    }
    await fileEmpty(index);
    statusBar.show(t('refreshSuccess'));
    tabs.value[index].file = file;
  }
  async function fileEmpty(index: any) {
    tabs.value[index].file = 'tmpClose';
  }
  async function closeTab(index: any) {
    const tab = tabs.value[index];
    if (tab.type === 'markdown' && tab.modified && !utils.isSampleFile(tab.file)) {
      if (!window.confirm(t('closeModifiedFile'))) {
        return;
      }
    }
    if (tabs.value.length <= 1) {
      tabs.value[0] = { type: 'welcome' };
      current.value = 0;
      file.value = nodePath.pathDirname(ipc.syncMsg('__static'));
      return;
    }
    if (index === current.value) {
      current.value = Math.max(0, index - 1);
    } else if (index < current.value) {
      current.value = current.value - 1;
    }
    tabs.value.splice(index, 1);
    if (index == 0) {
      const curFile = tabs.value[current.value].file;
      file.value = curFile ? nodePath.pathDirname(curFile) : nodePath.pathDirname(ipc.syncMsg('__static'));
      useRecord.saveCurrentTab(current.value);
    }
  }
</script>
<!-- <script lang="ts">
  import { defineComponent, reactive } from 'vue';
  // import File from './File.vue';
  import FilesViewer from './FilesViewer.vue';
  import TabTitle from './TabTitle.vue';
  import Welcome from './Welcome.vue';
  import Markdown from './Markdown.vue';
  import Settings from './Settings.vue';

  import i18n from '/@/common/i18n';
  import naturalCompare from 'natural-compare-lite';
  import * as useRecord from '/@/logic/useRecord';
  import * as utils from '/@/logic/utils';
  import * as statusBar from '/@/logic/statusBar';
  import store from '../store/index';
  import { nodePath, ipc, nodeFs, store as preStore } from '#preload';

  // import FileTree from '/@/logic/fileManager/fileFree';·

  export default defineComponent({
    name: 'MainComp',
    components: { FilesViewer, TabTitle, Welcome, Markdown, Settings },
    // setup() {
    //   const tabs = reactive(useRecord.getTabs());
    //   return { tabs };
    // },
    data() {
      return {
        current: useRecord.getCurrentTab(),
        file: nodePath.pathDirname(useRecord.getTabs()[useRecord.getCurrentTab()]?.file || ipc.syncMsg('__static')),
        statusText: null,
        MAX_FILE_SIZE: 1000 * 1000,
        showfile: preStore.getShowFile()
      };
    },
    watch: {
      tabs: {
        handler(val) {
          useRecord.saveTabs(val);
          // file.value = val[current.value].file;
        },
        deep: true
      },
      current() {
        const file = tabs.value[current.value].file;
        file.value = file ? nodePath.pathDirname(file) : nodePath.pathDirname(ipc.syncMsg('__static'));
        useRecord.saveCurrentTab(current.value);
      }
    },

    mounted() {
      store.commit('setTheme', preStore.getTheme());

      statusBar.setCallback((text: any) => {
        this.statusText = text;
      });

      ipc.receive('menu.open', (data: any) => {
        this.openFile(data);
      });

      ipc.receive('menu.settings', () => {
        const index = tabs.value.findIndex((tab: any) => tab.type === 'settings');
        if (index === -1) {
          this.addTab({ type: 'settings' });
        } else {
          this.selectTab(index);
        }
      });
      ipc.receive('menu.showfile', () => {
        this.showfile = !this.showfile;
        preStore.setShowFile(this.showfile);
      });
      ipc.receive('menu.closetab', () => {
        this.closeTab(current.value);
      });
      ipc.receive('menu.reloadfile', () => {
        this.refreshTab(current.value);
      });

      ipc.receive('menu.welcome', () => {
        const index = tabs.value.findIndex((tab: any) => tab.type === 'welcome');
        if (index === -1) {
          this.addTab({ type: 'welcome' });
        } else {
          this.selectTab(index);
        }
      });

      ipc.receive('menu.sample', () => {
        this.openFile(utils.getSampleFile());
      });

      ipc.receive('menu.theme', (theme: any) => {
        store.commit('setTheme', theme);
      });
    },
    methods: {
      back() {
        file.value = nodePath.pathDirname(file.value);
      },
      openDir(folder: any) {
        file.value = nodePath.pathJoin(file.value, folder);
      },
      filesOrDir() {
        if (file.value == '') return [];
        const path = file.value;
        const fileNames = nodeFs.fsReaddirSync(path);
        const allMD: Array<any> = [];
        fileNames.map((file: string) => {
          const stats = nodeFs.isFileOrDir(path, file);
          if (stats[1] || nodePath.pathExtname(file) == '.md')
            allMD.push({
              name: file,
              path: path,
              directory: stats[1]
            });
        });

        return allMD.sort((a: any, b: any) => {
          if (a.directory === b.directory) {
            // return a.name.localeCompare(b.name);
            return naturalCompare(a.name, b.name);
          }
          return a.directory ? -1 : 1;
        });
      },
      // 拖拽上传
      fileDragover(e: Event) {
        e.preventDefault();
      },
      fileDrop(e: DragEvent) {
        e.preventDefault();
        const file = e.dataTransfer?.files[0]; // 获取到第一个上传的文件对象
        if (!file) return;
        if (file.size > this.MAX_FILE_SIZE) {
          return alert('文件大小不能超过10M');
        }
        this.openFile(file.path);
      },
      async openFile(file: any) {
        console.log('openFile', file);
        const index = tabs.value.findIndex((tab: any) => tab.file === file);
        if (index === -1) {
          if (nodeFs.fsExistsSync(file)) {
            ipc.syncMsg('addRecentDocument', file);
            this.addTab({
              type: 'markdown',
              file: file,
              title: utils.fileName(file),
              modified: false
            });
          } else {
            statusBar.show(i18n.global.t('readFileNotExists') + file);
          }
        } else {
          this.selectTab(index);
        }
      },
      tabTitle(tab: any) {
        switch (tab.type) {
          case 'settings':
            return i18n.global.t('settings');
          case 'welcome':
            return i18n.global.t('welcome');
          case 'markdown':
            return tab.title;
        }
      },
      setModified(i: number, modified: boolean) {
        tabs.value[i].modified = modified;
      },
      selectTab(index: any) {
        console.log('select tab:', current.value, '=>', index);
        current.value = index;
      },
      addTab(tab: any) {
        const pos = Math.min(current.value + 1, tabs.value.length);
        tabs.value.splice(pos, 0, tab);
        current.value = pos;
      },
      async refreshTab(index: any) {
        const tab = tabs.value[index];
        const file = tab.file;
        if (tab.type === 'markdown' && tab.modified && !utils.isSampleFile(tab.file)) {
          statusBar.show(i18n.global.t('reloadNeedSaveFirst'));
          return;
        }
        await file.valueEmpty(index);
        statusBar.show(i18n.global.t('refreshSuccess'));
        tabs.value[index].file = file;
      },
      async fileEmpty(index: any) {
        tabs.value[index].file = 'tmpClose';
      },
      async closeTab(index: any) {
        const tab = tabs.value[index];
        if (tab.type === 'markdown' && tab.modified && !utils.isSampleFile(tab.file)) {
          if (!window.confirm(i18n.global.t('closeModifiedFile'))) {
            return;
          }
        }
        if (tabs.value.length <= 1) {
          tabs.value[0] = { type: 'welcome' };
          current.value = 0;
          file.value = nodePath.pathDirname(ipc.syncMsg('__static'));
          return;
        }
        if (index === current.value) {
          current.value = Math.max(0, index - 1);
        } else if (index < current.value) {
          current.value = current.value - 1;
        }
        tabs.value.splice(index, 1);
        if (index == 0) {
          const file = tabs.value[current.value].file;
          file.value = file ? nodePath.pathDirname(file) : nodePath.pathDirname(ipc.syncMsg('__static'));
          useRecord.saveCurrentTab(current.value);
        }
      }
    }
  });
</script> -->

<template>
  <div id="drag" class="out-root" @dragover="fileDragover" @drop="fileDrop">
    <!-- <div class="file-box"><File></File></div> -->
    <div v-if="showFile" class="file-box">
      <div class="file-box-header">
        <strong>{{ file }}</strong>
      </div>
      <hr />
      <FilesViewer :files="filesOrDir()" @back="back" @folderclick="openDir($event.name)" @mdclick="openFile($event)" />
    </div>

    <div class="root">
      <div class="tab-titles">
        <TabTitle
          v-for="(tab, i) in tabs"
          :key="tab.type"
          :tab-type="tab.type"
          :tab-title="tabTitle(tab)"
          :selected="current === i"
          :tab-refresh="() => refreshTab(i)"
          :tab-click="() => selectTab(i)"
          :tab-close="() => closeTab(i)"
          :modified="tab.modified"
        >
        </TabTitle>
      </div>

      <div class="tab-contents">
        <div v-for="(tab, i) in tabs" v-show="current === i" :key="tab.type" class="tab-content" :file="tab.file">
          <template v-if="tab.type === 'welcome'">
            <Welcome></Welcome>
          </template>

          <template v-else-if="tab.type === 'markdown'">
            <Markdown :file="tab.file" :active="current === i" :num="i" @set-modified="setModified"> </Markdown>
          </template>

          <template v-else-if="tab.type === 'settings'">
            <Settings :active="current === i"> </Settings>
          </template>
        </div>
      </div>

      <div v-if="statusText" class="status-bar">{{ statusText }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .out-root {
    display: flex;
    height: 100%;
    width: 100%;
  }
  .file-box {
    float: left;
    max-width: 300px;
    min-width: 150px;
    // width: 250px;
    width: calc(15%); /*左侧初始化宽度*/
    overflow: auto;
    margin: 5px 0;
    padding: 0px 12px 10px;
    border-right: 2px solid #f1f1f1;

    &::-webkit-scrollbar {
      width: 4px;
      height: 1px;
    }
    /*定义滚动条的滑块的样式有圆角和阴影以及自定义的背景色*/
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #d4d4d4;
    }
    /*定义滚动条所在轨道的样式。有圆角和阴影以及淡色系的背景色*/
    &::-webkit-scrollbar-track {
      border-radius: 4px;
      background: #f1f1f1;
    }
  }
  .file-box-header {
    background-color: white;
    opacity: 0.9;
    position: sticky;
    top: 0;
    z-index: 99;
  }

  .root {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    // display: flex;
    flex-direction: column;
    flex: 1;
  }

  .tab-titles {
    background-color: rgb(248, 246, 246);
    padding: 3px 3px 0 3px;
    height: 30px;
    display: flex;
    flex-direction: row;
    overflow-y: hidden;
    overflow-x: auto;

    // &::-webkit-scrollbar {
    //   display: none;
    // }
    &::-webkit-scrollbar-track {
      border-radius: 5px;
    }
    &::-webkit-scrollbar {
      height: 3px; /*设置滚动条样式*/
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: rgb(175, 175, 175);
    }
  }

  .tab-contents {
    height: calc(100% - 32px);
    flex-grow: 1;
  }

  .tab-content {
    width: 100%;
    height: 100%;
  }

  .status-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    min-width: 30%;
    max-width: 95%;
    padding: 2px 10px;

    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.9em;
    color: #666;

    background-color: white;
    border-top-right-radius: 3px;
    border-right: 1px solid #bbb;
    border-top: 1px solid #bbb;
    box-shadow: rgba(128, 128, 128, 0.3) 0 0 50px 0;
  }
</style>
