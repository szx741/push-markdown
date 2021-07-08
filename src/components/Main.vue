<!--
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2021-07-08 17:26:12
 * @Description: 
 * @FilePath: \push-markdown\src\components\Main.vue
-->
<template>
  <div class="root">
    <div class="tab-titles">
      <TabTitle v-for="(tab, i) in tabs" :key="tab.type" :tab-title="tabTitle(tab)" :selected="current === i" :tab-click="() => selectTab(i)" :tab-close="() => closeTab(i)" :modified="tab.modified">
      </TabTitle>
      <!-- <TabTitle></TabTitle> -->
    </div>

    <div class="tab-contents">
      <div class="tab-content" v-for="(tab, i) in tabs" :key="tab.type" v-show="current === i">
        <template v-if="tab.type === 'welcome'">
          <Welcome></Welcome>
        </template>
      </div>
    </div>

    <div class="status-bar" v-if="statusText">{{ statusText }}</div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import TabTitle from './TabTitle.vue';
  import Welcome from './Welcome.vue';
  import i18n from '@/common/lib/language/index';
  import * as useRecord from '@/logic/useRecord';
  import * as utils from '@/logic/utils';

  export default defineComponent({
    name: 'Main',
    components: { TabTitle, Welcome },
    data() {
      return {
        tabs: useRecord.getTabs(),
        current: useRecord.getCurrentTab(),
        statusText: null
      };
    },
    methods: {
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
      selectTab(index: any) {
        console.log('select tab:', this.current, '=>', index);
        this.current = index;
      },
      addTab(tab: any) {
        const pos = Math.min(this.current + 1, this.tabs.length);
        this.tabs.splice(pos, 0, tab);
        this.current = pos;
      },
      closeTab(index: any) {
        const tab = this.tabs[index];
        if (tab.type === 'markdown' && tab.modified && !utils.isSampleFile(tab.file)) {
          if (!window.confirm(this.$t('closeModifiedFile'))) {
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

    setup() {
      console.log(i18n.global.t('meta.abstract'));
    },
    mounted() {
      window.api.receive('menu.welcome', () => {
        console.log('menu.welcome');
        const index = this.tabs.findIndex((tab: any) => tab.type === 'welcome');
        if (index === -1) {
          this.addTab({ type: 'welcome' });
        } else {
          this.selectTab(index);
        }
      });
    }
  });
</script>

<style lang="scss" scoped>
  @import '@/common/assets/style.scss';

  .root {
    height: 100%;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
  }

  .tab-titles {
    // background-color: #eee;
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

  .tab-contents {
    height: 100%;
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
