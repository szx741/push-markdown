<!-- Markdown预览页面 -->

<template>
  <div class="wrapper">
    <div class="container" :class="{ 'markdown-body-light': githubActive, 'markdown-body-dark': darkActive, splendor: splendorActive, wysiwyg: wysiwygActive }">
      <!-- 编辑器  -->
      <div class="left">
        <textarea ref="textarea" class="content" :class="{ 'left-light': !darkActive, 'left-dark': darkActive }" v-model="src" @input="update" title="text"></textarea>
      </div>

      <div class="right" :class="{ 'right-light': !darkActive, 'right-dark': darkActive }">
        <div class="content">
          <h1 v-if="post.title" class="title">{{ post.title }}</h1>

          <blockquote class="abstract">
            <span class="meta-name">{{ $t('meta.abstract') }}</span
            >{{ post.abstract || $t('meta.empty') }}
          </blockquote>

          <div class="meta">
            <table>
              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.file') }}</td>
                <td class="meta-value">{{ post.file }}</td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.url') }}</td>
                <td class="meta-value url" v-if="post.url">{{ post.url }}</td>
                <td class="meta-value empty url" v-else>{{ $t('meta.empty') }}</td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.time') }}</td>
                <td class="meta-value date" v-if="post.date">{{ formatDate(post.date) }}</td>
                <td class="meta-value empty" v-else>{{ $t('meta.empty') }}</td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.categories') }}</td>
                <td class="meta-value list" v-if="post.categories">
                  <span v-for="category in post.categories" :key="category" class="category">{{ category }}</span>
                </td>
                <td class="meta-value empty" v-else>{{ $t('meta.empty') }}</td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.tags') }}</td>
                <td class="meta-value list" v-if="post.tags">
                  <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
                </td>
                <td class="meta-value empty" v-else>{{ $t('meta.empty') }}</td>
              </tr>
            </table>
          </div>

          <div class="markdown" ref="markdown" v-html="post.html"></div>
        </div>
      </div>
    </div>

    <Publish class="markdown-body" :post="post" :active="active"></Publish>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, watch as watchSetup, toRefs } from 'vue';

  import dateFormat from 'dateformat';
  import * as utils from '../logic/utils';
  // import { djfj } from '@/logic/test';
  // import { djfj } from '@/logic/renderer';
  import * as renderer from '@/logic/renderer';
  import Publish from '@/components/Publish.vue';
  import * as statusBar from '../logic/statusBar';
  import i18n from '@/common/lib/language';
  import dayjs from 'dayjs';

  import store from '../store/index';

  interface data {
    modified: any;
    src: any;
    post: any;
  }
  export default defineComponent({
    name: 'Markdown',
    components: { Publish },
    props: ['file', 'active', 'num', 'modifiedHandler'],

    data(): data {
      return {
        modified: false,
        src: {},
        post: {}
      };
    },
    methods: {
      async debounceUpdate() {
        const _this = this;
        this.post = await renderer.render(_this.src, _this.file, true);
      },
      onSave() {
        if (this.active && this.modified) {
          this.writeFile();
        }
      },
      readFile() {
        window.api.fsReadFile(this.file, { encoding: 'utf-8' }, (err: any, data: string) => {
          if (err) {
            console.error(err);
            const text = i18n.global.t('readFileError') + err.message;
            statusBar.show(text);
            this.src = text;
          } else {
            //   const result = data.replace(/\t/g, '&emsp;');
            this.src = data;
          }
        });
      },
      writeFile() {
        if (utils.isSampleFile(this.file)) {
          statusBar.show(i18n.global.t('cannotWriteSampleFile'));
          return;
        }
        window.api.fsWriteFile(this.file, this.src, { encoding: 'utf-8' }, (err: any) => {
          // do nothing
          if (!err) {
            this.modified = false;
            // console.log('write file success', this.file);
            statusBar.show(i18n.global.t('saveFileSuccess'));
          } else {
            console.error(err);
            statusBar.show(i18n.global.t('saveFileError') + err.message);
          }
        });
      },
      update() {
        this.modified = true;
      },
      formatDate(date: any) {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    async mounted() {
      utils.setTextareaTabKey(this.$refs['textarea']);
      this.readFile();
      window.api.receive('menu.save', this.onSave);
    },
    watch: {
      file() {
        this.readFile();
      },
      async src() {
        await this.debounceUpdate();
      },
      modified() {
        console.log('this.num', this.num);
        this.$emit('setModified', this.num, this.modified);
      }
    },
    async updated() {
      const markdown: any = this.$refs['markdown'];
      utils.setLinks(markdown);
    },

    setup() {
      const theme: any = reactive({
        githubActive: true,
        darkActive: false,
        splendorActive: false,
        wysiwygActive: false
      });

      watchSetup(
        () => store.state.theme,
        (newVal: any, oldVal: any) => {
          theme[oldVal + 'Active'] = false;
          theme[newVal + 'Active'] = true;
        }
      );

      return {
        ...toRefs(theme)
      };
    }
  });
</script>

<style lang="scss" scoped>
  /*@import "../assets/MathJax.css";*/
  @import '~highlight.js/styles/github.css';
  @import '../common/assets/theme/github-markdown-light.css';
  @import '../common/assets/theme/github-markdown-dark.css';
  @import '../common/assets/theme/splendor.css';
  @import '../common/assets/theme/wysiwyg.css';

  .wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    // > * {
    // position: absolute;
    // left: 0;
    // top: 0;

    // width: 100%;
    // height: 100%;
    // }
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }

  .left,
  .right {
    width: 0;
    flex-grow: 1;
  }

  .left {
    display: flex;
    overflow: hidden;
    border-right: 1px solid #eeeeee;
  }

  .right {
    overflow-y: scroll;
  }

  .right::-webkit-scrollbar {
    width: 10px;
    height: 1px;
  }

  // /*定义滚动条的滑块的样式有圆角和阴影以及自定义的背景色*/
  .right-light::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #cacaca;
  }
  /*定义滚动条所在轨道的样式。有圆角和阴影以及淡色系的背景色*/
  .right-light::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #eeeeee;
  }

  .right-dark::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #686c6f;
  }
  /*定义滚动条所在轨道的样式。有圆角和阴影以及淡色系的背景色*/
  .right-dark::-webkit-scrollbar-track {
    border-radius: 10px;
    background: transparent;
  }

  textarea {
    width: 100%;
    height: 100%;
    // overflow: hidden;
    margin: 0;
    border: none;
    outline: none;
    resize: none;
    background-color: rgb(255, 255, 255);
    color: rgb(77, 77, 77);
  }

  textarea::-webkit-scrollbar {
    width: 10px;
    height: 1px;
  }
  // /*定义滚动条的滑块的样式有圆角和阴影以及自定义的背景色*/
  .left-light::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #cacaca;
  }
  /*定义滚动条所在轨道的样式。有圆角和阴影以及淡色系的背景色*/
  .left-light::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #eeeeee;
  }

  .left-dark::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #686c6f;
  }
  /*定义滚动条所在轨道的样式。有圆角和阴影以及淡色系的背景色*/
  .left-dark::-webkit-scrollbar-track {
    border-radius: 10px;
    background: transparent;
  }

  .content {
    padding: 40px;
    box-sizing: border-box;
  }

  .markdown {
    width: 100%;
    height: auto;
  }

  .abstract {
    margin: 15px 0 25px 0;
    padding: 0 1em;
    // color: #6a737d;
    // color: #454d57;
    border-left: 0.25em solid #dfe2e5;

    .meta-name {
      margin-right: 20px;
    }
  }

  .meta {
    width: 100%;
    overflow-x: scroll;
    margin-top: 20px;
    margin-bottom: 50px;

    table {
      width: 98%;
      box-sizing: border-box;
      border: 1px solid #eee;
      border-spacing: 20px 15px;

      * {
        background: transparent;
        vertical-align: top;
        text-align: left;
      }
    }
  }

  .meta-item {
  }

  .meta-name {
    color: #555;
    font-weight: 500;
    white-space: nowrap;
  }

  .meta-value {
    word-break: break-all;
  }

  @mixin float-left {
    float: left;
    white-space: nowrap;
    margin-bottom: 5px;
    overflow-x: hidden;
    max-width: 100%;
    text-overflow: ellipsis;

    &:not(:last-child) {
      margin-right: 5px;
    }
  }

  .category {
    @include float-left;

    text-decoration-style: solid;
    text-decoration: underline;
  }

  .tag {
    @include float-left;

    border: 1px solid;
    border-radius: 2px;
    padding: 0.15em 0.3em;
    font-size: 0.8em;
    color: #666;
  }

  .meta-value.url.empty {
    color: red;
  }
</style>
