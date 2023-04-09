<script setup lang="ts">
  import { watch, ref, onUpdated, onMounted, toRef, Ref, onUnmounted, computed } from 'vue';
  import dayjs from 'dayjs';
  import { useI18n } from 'vue-i18n';

  import Publish from './Publish.vue';

  import { nodeFs, ipc } from '#preload';
  import { setLinks, setTextareaTabKey, isSampleFile } from '../utils/tools';
  import { show } from '../utils/statusBar';
  import { mdRender, Post } from '../mdRenderer';

  const props = defineProps<{
      filePath: string;
      active: boolean;
      index: number;
    }>(),
    emit = defineEmits<{
      (e: 'setModified', index: number, modified: boolean): void;
    }>(),
    filePath = toRef(props, 'filePath'),
    modified = ref(false),
    fileText: Ref<string> = ref(''),
    post: Ref<Post> = ref({
      filePath: undefined,
      fileText: undefined,
      title: '',
      html: '',
      url: undefined,
      tags: undefined,
      categories: undefined,
      authors: undefined,
      date: undefined,
      abstract: undefined,
      thumbnail: undefined,
      other_images: undefined,
      upload: ''
    }),
    refMarkdown = ref(),
    refTextarea = ref(),
    { t } = useI18n();

  // 监听
  watch(filePath, () => {
    readFile();
  });
  watch(fileText, () => postRender());
  watch(modified, (value) => {
    emit('setModified', props.index, value);
  });

  readFile();
  const destory = ipc.receive('menu.save', onSave);

  onUpdated(() => {
    const markdown: any = refMarkdown.value;
    setLinks(markdown);
  });

  onMounted(() => {
    setTextareaTabKey(refTextarea.value);
  });

  onUnmounted(() => {
    if (destory) destory();
  });

  function postRender() {
    post.value = mdRender(fileText.value, filePath.value);
  }

  function onSave() {
    if (props.active && modified.value) writeFile();
  }
  function readFile() {
    if (filePath.value != 'tmpClose') {
      nodeFs.fsReadFile(filePath.value, { encoding: 'utf-8' }, (err: any, data: string) => {
        if (err) {
          console.error(err);
          const text = t('readFileError') + err.message;
          show(text);
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
    if (isSampleFile(filePath.value)) {
      show(t('cannotWriteSampleFile'));
      return;
    }
    nodeFs.fsWriteFile(filePath.value, fileText.value, { encoding: 'utf-8' }, (err: any) => {
      // do nothing
      if (!err) {
        modified.value = false;
        show(t('saveFileSuccess'));
      } else {
        console.error(err);
        show(t('saveFileError') + err.message);
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
    <div class="container">
      <!-- 编辑器  -->
      <div class="left">
        <textarea ref="textarea" v-model="fileText" class="left-content scroll-bar" title="text" spellcheck="false" @input="update"></textarea>
      </div>

      <div class="right scroll-bar">
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
                <td class="meta-value">{{ post.filePath }}</td>
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
                <td v-if="post.categories" class="meta-value">
                  <span v-for="category in post.categories" :key="category" class="category">{{ category }}</span>
                </td>
                <td v-else class="meta-value empty">{{ $t('meta.empty') }}</td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.tags') }}</td>
                <td v-if="post.tags" class="meta-value">
                  <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }} </span>
                </td>
                <td v-else class="meta-value empty">{{ $t('meta.empty') }} </td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.thumbnail') }}</td>
                <td v-if="post.thumbnail" class="meta-value">
                  <img :src="post.thumbnail" />
                </td>
                <td v-else class="meta-value empty">{{ $t('meta.empty') }} </td>
              </tr>

              <tr class="meta-item">
                <td class="meta-name">{{ $t('meta.other_images') }}</td>
                <td v-if="post.other_images" class="meta-value">
                  <div v-for="other_image in post.other_images" :key="other_image"> <img :src="other_image" /> </div>
                </td>
                <td v-else class="meta-value empty">{{ $t('meta.empty') }} </td>
              </tr>
            </table>
          </div>

          <div ref="markdown" class="markdown" v-html="post.html"></div>
        </div>
      </div>
    </div>

    <Publish :post="post" :active="active"></Publish>
  </div>
</template>

<style lang="scss" scoped>
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
    height: 100%;
    display: flex;
    overflow: hidden;
    padding: 0;
    margin: 0;
  }

  .right {
    width: 53%;
    // flex-grow: 1;
    overflow-y: auto;
  }

  .scroll-bar::-webkit-scrollbar {
    width: 10px;
    height: 1px;
  }

  .left-content {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    border: none;
    outline: none;
    resize: none;
    background-color: rgb(255, 255, 255);
    color: rgb(77, 77, 77);
    cursor: auto;
    padding: 35px 32px 0 35px;
    margin: 0;
    box-sizing: border-box;
  }
  .content {
    padding: 37px;
  }

  .markdown {
    width: 100%;
    height: auto;
  }

  .abstract {
    margin: 15px 0 15px 0;
    padding: 0 1em;
    border-left: 0.25em solid;

    .meta-name {
      margin-right: 20px;
    }
  }

  .meta {
    width: 100%;
    overflow-x: hidden;
    margin-top: 20px;
    margin-bottom: 30px;

    table {
      width: 100%;
      border-spacing: 20px 15px;

      * {
        background: transparent;
        vertical-align: center;
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
    overflow: hidden;
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

  .meta-value.empty {
    color: red;
  }
</style>
