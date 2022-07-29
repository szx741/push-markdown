<script setup lang="ts">
  import { reactive, watch, toRefs, ref, onUpdated, onMounted, toRef, Ref, onUnmounted } from 'vue';
  import dayjs from 'dayjs';
  import { useI18n } from 'vue-i18n';
  import Publish from '/@/components/Publish.vue';
  import * as utils from '../logic/utils';
  import * as statusBar from '../logic/statusBar';
  import { mdRender } from '../mdRenderer';
  import { nodeFs, ipc } from '#preload';
  const props = defineProps<{
      filePath: string;
      active: boolean;
      num: number;
    }>(),
    emit = defineEmits<{
      (e: 'setModified', i: number, modified: boolean): void;
    }>(),
    filePath = toRef(props, 'filePath'),
    modified = ref(false),
    fileText: Ref<string> = ref(''),
    post: Ref<any> = ref({}),
    refMarkdown = ref(),
    refTextarea = ref(),
    { t } = useI18n();

  // 监听
  watch(filePath, () => {
    readFile();
  });
  watch(fileText, () => debounceUpdate());
  watch(modified, (value) => {
    emit('setModified', props.num, value);
  });

  const theme: any = reactive({
    githubActive: true,
    darkActive: false,
    splendorActive: false,
    wysiwygActive: false
  });

  readFile();
  const destory = ipc.receive('menu.save', onSave);

  onUpdated(() => {
    const markdown: any = refMarkdown.value;
    utils.setLinks(markdown);
  });

  onMounted(() => {
    utils.setTextareaTabKey(refTextarea.value);
  });

  onUnmounted(() => {
    destory();
  });

  async function debounceUpdate() {
    post.value = mdRender(fileText.value, filePath.value, true);
    console.log(post.value);
  }
  function onSave() {
    if (props.active && modified.value) {
      writeFile();
    }
  }
  function readFile() {
    if (filePath.value != 'tmpClose') {
      nodeFs.fsReadFile(filePath.value, { encoding: 'utf-8' }, (err: any, data: string) => {
        if (err) {
          console.error(err);
          const text = t('readFileError') + err.message;
          statusBar.show(text);
          console.log(fileText.value);
          fileText.value = text;
        } else {
          //   const result = data.replace(/\t/g, '&emsp;');
          fileText.value = data;
        }
      });
    }
  }
  function writeFile() {
    if (utils.isSampleFile(filePath.value)) {
      statusBar.show(t('cannotWriteSampleFile'));
      return;
    }
    nodeFs.fsWriteFile(filePath.value, fileText.value, { encoding: 'utf-8' }, (err: any) => {
      // do nothing
      if (!err) {
        modified.value = false;
        statusBar.show(t('saveFileSuccess'));
      } else {
        console.error(err);
        statusBar.show(t('saveFileError') + err.message);
      }
    });
  }
  function update() {
    modified.value = true;
  }
  function formatDate(date: any) {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  }
</script>

<template>
  <div class="wrapper">
    <!-- <div class="container" :class="{ 'markdown-body-light': githubActive, 'markdown-body-dark': darkActive, splendor: splendorActive, wysiwyg: wysiwygActive }"> -->
    <div class="container">
      <!-- 编辑器  -->
      <div class="left">
        <textarea ref="textarea" v-model="fileText" class="left-content" title="text" @input="update"></textarea>
        <!-- <textarea ref="textarea" v-model="fileText" class="left-content" :class="{ 'left-light': !darkActive, 'left-dark': darkActive }" title="text" @input="update"></textarea> -->
      </div>

      <div class="right">
        <!-- <div class="right" :class="{ 'right-light': !darkActive, 'right-dark': darkActive }"> -->
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
                <td v-if="post.url" class="meta-value url">{{ post.url }}</td>
                <td v-else class="meta-value empty url">{{ $t('meta.empty') }}</td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.time') }}</td>
                <td v-if="post.date" class="meta-value date">{{ formatDate(post.date) }}</td>
                <td v-else class="meta-value empty">{{ $t('meta.empty') }}</td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.categories') }}</td>
                <td v-if="post.categories" class="meta-value list">
                  <span v-for="category in post.categories" :key="category" class="category">{{ category }}</span>
                </td>
                <td v-else class="meta-value empty">{{ $t('meta.empty') }}</td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.tags') }}</td>
                <td v-if="post.tags" class="meta-value list">
                  <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
                </td>
                <td v-else class="meta-value empty">{{ $t('meta.empty') }}</td>
              </tr>
            </table>
          </div>

          <div ref="markdown" class="markdown" v-html="post.html"></div>
        </div>
      </div>
    </div>

    <Publish class="markdown-body" :post="post" :active="active"></Publish>
  </div>
</template>

<style lang="scss" scoped>
  /*@import "../assets/MathJax.css";*/
  // @import 'highlight.js/styles/github.css';
  // @import 'github-markdown-css/github-markdown-light.css';
  @import '../common/assets/theme/github-markdown-light.css';
  @import '../common/assets/theme/github-markdown-dark.css';
  // @import 'github-markdown-css/github-markdown-dark.css';
  // @import '../common/assets/theme/splendor.css';
  // @import '../common/assets/theme/wysiwyg.css';

  .wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }

  .left {
    width: 47%;
    // flex-grow: 1;
    display: flex;
    overflow: hidden;
    border-right: 1px solid #eeeeee;
  }

  .right {
    width: 53%;
    flex-grow: 1;
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

  .left-content {
    padding: 35px;
    box-sizing: border-box;
  }
  .content {
    padding: 37px;
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
