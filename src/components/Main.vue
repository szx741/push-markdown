<!--
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2021-11-20 18:02:29
 * @Description: 
 * @FilePath: \push-markdown\src\components\Main.vue
-->
<template>
  <div class="out-root" id="drag" @dragover="fileDragover" @drop="fileDrop">
    <!-- <div class="file-box"><File></File></div> -->
    <div v-if="showfile" class="file-box">
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
        <!-- <TabTitle></TabTitle> -->
      </div>

      <div class="tab-contents">
        <div class="tab-content" v-for="(tab, i) in tabs" :key="tab.type" v-show="current === i" :file="tab.file">
          <template v-if="tab.type === 'welcome'">
            <Welcome></Welcome>
          </template>

          <template v-else-if="tab.type === 'markdown'">
            <Markdown :file="tab.file" :active="current === i" :num="i" @setModified="setModified"> </Markdown>
          </template>

          <template v-else-if="tab.type === 'settings'">
            <Settings :active="current === i"> </Settings>
          </template>
        </div>
      </div>

      <div class="status-bar" v-if="statusText">{{ statusText }}</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  // import File from './File.vue';
  import FilesViewer from './FilesViewer.vue';
  import TabTitle from './TabTitle.vue';
  import Welcome from './Welcome.vue';
  import Markdown from './Markdown.vue';
  import Settings from './Settings.vue';

  import i18n from '@/common/lib/language/index';
  import * as useRecord from '@/logic/useRecord';
  import * as utils from '@/logic/utils';
  import * as statusBar from '@/logic/statusBar';
  import store from '../store/index';

  // import FileTree from '@/logic/fileManager/fileFree';·

  export default defineComponent({
    name: 'Main',
    components: { FilesViewer, TabTitle, Welcome, Markdown, Settings },
    setup() {
      const tabs = reactive(useRecord.getTabs());
      return { tabs };
    },
    data() {
      return {
        current: useRecord.getCurrentTab(),
        file: window.api.pathDirname(useRecord.getTabs()[useRecord.getCurrentTab()]?.file || window.api.syncMsg('__static')),
        statusText: null,
        MAX_FILE_SIZE: 1000 * 1000,
        showfile: window.api.getShowFile()
      };
    },
    watch: {
      tabs: {
        handler(val, oldVal) {
          useRecord.saveTabs(val);
          // this.file = val[this.current].file;
        },
        deep: true
      },
      current() {
        const file = this.tabs[this.current].file;
        this.file = file ? window.api.pathDirname(file) : window.api.pathDirname(window.api.syncMsg('__static'));
        useRecord.saveCurrentTab(this.current);
      }
    },
    methods: {
      back() {
        this.file = window.api.pathDirname(this.file);
      },
      openDir(folder: any) {
        this.file = window.api.pathJoin(this.file, folder);
      },
      filesOrDir() {
        if (this.file == '') return [];
        const path = this.file;
        const fileNames = window.api.fsReaddirSync(path);
        const allMD: Array<any> = [];
        fileNames.map((file: string) => {
          const stats = window.api.isFileOrDir(path, file);
          if (stats[1] || window.api.pathExtname(file) == '.md')
            allMD.push({
              name: file,
              path: path,
              directory: stats[1]
            });
        });

        return allMD.sort((a: any, b: any) => {
          if (a.directory === b.directory) {
            return a.name.localeCompare(b.name);
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
        const index = this.tabs.findIndex((tab: any) => tab.file === file);

        if (index === -1) {
          if (window.api.fsExistsSync(file)) {
            window.api.syncMsg('addRecentDocument', file);
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
        this.tabs[i].modified = modified;
      },
      selectTab(index: any) {
        console.log('select tab:', this.current, '=>', index);
        this.current = index;
      },
      addTab(tab: any) {
        const pos = Math.min(this.current + 1, this.tabs.length);
        this.tabs.splice(pos, 0, tab);
        this.current = pos;
      },
      async refreshTab(index: any) {
        const file = this.tabs[index].file;
        await this.closeTab(index);
        await this.openFile(file);
      },
      async closeTab(index: any) {
        const tab = this.tabs[index];
        if (tab.type === 'markdown' && tab.modified && !utils.isSampleFile(tab.file)) {
          if (!window.confirm(i18n.global.t('closeModifiedFile'))) {
            return;
          }
        }
        if (this.tabs.length <= 1) {
          this.tabs = [{ type: 'welcome' }];
          this.current = 0;
          return;
        }
        if (index === this.current) {
          this.current = Math.max(0, index - 1);
        } else if (index < this.current) {
          this.current = this.current - 1;
        }
        this.tabs.splice(index, 1);
      }
    },

    mounted() {
      store.commit('setTheme', window.api.getTheme());

      statusBar.setCallback((text: any) => {
        this.statusText = text;
      });

      window.api.receive('menu.open', (data: any) => {
        this.openFile(data);
      });

      window.api.receive('menu.settings', () => {
        const index = this.tabs.findIndex((tab: any) => tab.type === 'settings');
        if (index === -1) {
          this.addTab({ type: 'settings' });
        } else {
          this.selectTab(index);
        }
      });
      window.api.receive('menu.showfile', () => {
        this.showfile = !this.showfile;
        window.api.setShowFile(this.showfile);
      });

      window.api.receive('menu.welcome', () => {
        const index = this.tabs.findIndex((tab: any) => tab.type === 'welcome');
        if (index === -1) {
          this.addTab({ type: 'welcome' });
        } else {
          this.selectTab(index);
        }
      });

      window.api.receive('menu.sample', () => {
        this.openFile(utils.getSampleFile());
      });

      window.api.receive('menu.theme', (theme: any) => {
        store.commit('setTheme', theme);
      });
    }
  });
</script>

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
    overflow-x: scroll;

    &::-webkit-scrollbar {
      display: none;
    }
  }
  .file-box::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  /*定义滚动条的滑块的样式有圆角和阴影以及自定义的背景色*/
  .file-box::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #d4d4d4;
  }
  /*定义滚动条所在轨道的样式。有圆角和阴影以及淡色系的背景色*/
  .file-box::-webkit-scrollbar-track {
    border-radius: 4px;
    background: #f1f1f1;
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
