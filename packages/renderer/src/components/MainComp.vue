<!--
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2022-07-28 19:55:03
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\components\MainComp.vue
-->
<script setup lang="ts">
  import { onMounted, ref, toRaw, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  import FilesViewer from './FilesViewer.vue';
  import TabTitle from './TabTitle.vue';
  import Welcome from './Welcome.vue';
  import Markdown from './Markdown.vue';
  import Settings from './Settings.vue';

  import { nodePath, ipc, nodeFs, store } from '#preload';
  import { getTabs, getCurrentTab, saveTabs, saveCurrentTab, Tab } from '/@/logic/useRecord';
  import * as utils from '/@/logic/utils';
  import * as statusBar from '/@/logic/statusBar';

  const tabs = ref(getTabs()), // 保存标签
    currIndex = ref(getCurrentTab()),
    statusText = ref(''),
    showFile = ref(store.getShowFile()),
    { t } = useI18n(),
    appDir = nodePath.pathDirname(ipc.syncMsg('__static')),
    pathDir = ref(nodePath.pathDirname(tabs.value[currIndex.value]?.filePath || appDir)),
    currPost = ref();
  watch(tabs, (value) => saveTabs(toRaw(value)), { deep: true });
  watch(
    currIndex,
    (curr) => {
      const curFile = tabs.value[curr].filePath;
      pathDir.value = curFile ? nodePath.pathDirname(curFile) : appDir;
      saveCurrentTab(curr);
    },
    { deep: true }
  );

  statusBar.setCallback((text: string) => {
    statusText.value = text;
  });
  // 菜单栏打开文件
  ipc.receive('menu.open', (data: any) => {
    openFile(data);
  });
  // 菜单栏打开设置
  ipc.receive('menu.settings', () => {
    const index = tabs.value.findIndex((tab) => tab.type === 'settings');
    if (index === -1) addTab({ type: 'settings', filePath: '' });
    else selectTab(index);
  });
  // 展示文件夹
  ipc.receive('menu.showfile', () => {
    showFile.value = !showFile.value;
    store.setShowFile(showFile.value);
  });
  // 关闭当前网页标签
  ipc.receive('menu.closetab', () => {
    closeTab(currIndex.value);
  });
  // 重新加载文件
  ipc.receive('menu.reloadfile', () => {
    refreshTab(currIndex.value);
  });
  // 打开欢迎界面
  ipc.receive('menu.welcome', () => {
    const index = tabs.value.findIndex((tab: any) => tab.type === 'welcome');
    if (index === -1) addTab({ type: 'welcome', filePath: '' });
    else selectTab(index);
  });
  // 打开示例文档
  ipc.receive('menu.sample', () => {
    openFile(utils.getSampleFile());
  });

  // onMounted(() => {
  //   // ipc.receive('menu.theme', (theme: any) => {
  //   //   config.setTheme(theme);
  //   // });
  // });

  // 打开文件
  function openFile(filePath: string) {
    console.log('文件的路径', filePath);
    const index = tabs.value.findIndex((tab) => tab.filePath === filePath);
    if (index === -1) {
      if (nodeFs.fsExistsSync(filePath)) {
        ipc.syncMsg('addRecentDocument', filePath);
        addTab({
          type: 'markdown',
          filePath: filePath,
          title: utils.fileName(filePath),
          modified: false
        });
      } else {
        statusBar.show(t('readFileNotExists') + filePath);
      }
    } else {
      selectTab(index);
    }
  }

  // 文件夹前进
  function forward(fileName: string) {
    pathDir.value = nodePath.pathJoin(pathDir.value, fileName);
  }
  // 文件夹后退
  function back() {
    pathDir.value = nodePath.pathDirname(pathDir.value);
  }

  function fileDragover(e: Event) {
    e.preventDefault();
  }
  const MAX_FILE_SIZE = 1000 * 1000;
  // 拖拽打开
  function fileDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0]; // 获取到第一个上传的文件对象
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      return alert('文件大小不能超过10M');
    }
    openFile(file.path);
  }

  // 切换tab的标题
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
  // 文档的修改状态
  function setModified(i: number, modified: boolean) {
    tabs.value[i].modified = modified;
  }
  // 选择Tab
  function selectTab(index: number) {
    console.log('select tab:', currIndex.value, '=>', index);
    currIndex.value = index;
  }

  // 添加新的Tab
  function addTab(tab: Tab) {
    const pos = Math.min(currIndex.value + 1, tabs.value.length);
    tabs.value.splice(pos, 0, tab);
    currIndex.value = pos;
  }
  async function refreshTab(index: any) {
    const tab = tabs.value[index];
    const file = tab.filePath;
    if (tab.type === 'markdown' && tab.modified && !utils.isSampleFile(tab.filePath)) {
      statusBar.show(t('reloadNeedSaveFirst'));
      return;
    }
    await fileEmpty(index);
    statusBar.show(t('refreshSuccess'));
    tabs.value[index].filePath = file;
  }
  async function fileEmpty(index: any) {
    tabs.value[index].filePath = 'tmpClose';
  }
  async function closeTab(index: any) {
    const tab = tabs.value[index];
    if (tab.type === 'markdown' && tab.modified && !utils.isSampleFile(tab.filePath)) {
      if (!window.confirm(t('closeModifiedFile'))) {
        return;
      }
    }
    if (tabs.value.length <= 1) {
      tabs.value[0] = { type: 'welcome', filePath: '' };
      currIndex.value = 0;
      pathDir.value = appDir;
      return;
    }
    if (index === currIndex.value) {
      currIndex.value = Math.max(0, index - 1);
    } else if (index < currIndex.value) {
      currIndex.value = currIndex.value - 1;
    }
    tabs.value.splice(index, 1);
    if (index == 0) {
      const curFile = tabs.value[currIndex.value].filePath;
      pathDir.value = curFile ? nodePath.pathDirname(curFile) : appDir;
      saveCurrentTab(currIndex.value);
    }
  }
</script>

<template>
  <div id="drag" class="out-root" @dragover="fileDragover" @drop="fileDrop">
    <div v-if="showFile" class="file-box">
      <div class="file-box-header">
        <p> {{ pathDir }}</p>
      </div>
      <hr />
      <FilesViewer :path-dir="pathDir" @forward="forward" @back="back" @open-file="openFile($event)" />
    </div>

    <div class="root">
      <div class="tab-titles">
        <TabTitle
          v-for="(tab, i) in tabs"
          :key="tab.type"
          :tab-type="tab.type"
          :tab-title="tabTitle(tab)"
          :selected="currIndex === i"
          :tab-refresh="() => refreshTab(i)"
          :tab-click="() => selectTab(i)"
          :tab-close="() => closeTab(i)"
          :modified="tab.modified"
        >
        </TabTitle>
      </div>

      <div class="tab-contents">
        <div v-for="(tab, i) in tabs" v-show="currIndex === i" :key="tab.type" class="tab-content" :file="tab.filePath">
          <template v-if="tab.type === 'welcome'">
            <Welcome></Welcome>
          </template>

          <template v-else-if="tab.type === 'settings'">
            <Settings :active="currIndex === i"> </Settings>
          </template>

          <template v-else-if="tab.type === 'markdown'">
            <Markdown :file-path="tab.filePath || ''" :active="currIndex === i" :num="i" @set-modified="setModified"> </Markdown>
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
    p {
      width: 100%;
      color: #212;
      white-space: unwrap;
      font-weight: bold;
      word-break: break-all;
      padding: 0;
    }
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