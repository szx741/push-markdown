<!-- 发布窗口 -->
<script setup lang="ts">
  import { computed, onUnmounted, Ref, ref, toRaw, toRef, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { ipc } from '#preload';
  import { sites, Site, publishers } from '../conf/sites';
  import { detail, saveDetail } from '../conf/detail';
  import { openSampleFile, promiseConcurrencyLimit } from '../utils/tools';
  import { show } from '../utils/statusBar';
  import { Post } from '../mdRenderer/markdown-text-to-html';
  import { PublishParams, PublishMode, PublishState } from '../mdPublish';

  interface EditItem {
    site: Site;
    post: any;
    callback: (edit: boolean) => void;
  }

  const props = defineProps<{
      post: Post;
      active: boolean;
    }>(),
    active = toRef(props, 'active'), // 当前选中的界面
    post = toRef(props, 'post'),
    publishMode = ref(PublishMode.Create),
    showPublish = ref(false),
    editList: Ref<EditItem[]> = ref([]),
    publishing = ref(false),
    confirm = ref(false),
    articleIDs: Ref<string[]> = ref([]),
    inputID = ref(0),
    { t } = useI18n();

  watch(detail, (value) => saveDetail(toRaw(value)), { deep: true });
  const siteToString = (site: any) => `${site.name} [${site.username}] [${site.url}]`;
  const selectedSites = computed(() => sites.value.map((site, index) => (site.selected ? index : undefined)).filter((v) => v !== undefined));
  const menuPublishListen = () => {
    // 如果是当前界面并且有文本数据
    if (active.value && post.value) {
      // 展现Publish的面板
      showPublish.value = true;
      // 如果没有设置URL，就会弹出窗口提醒
      if (!post.value.url) confirm.value = true;
      else {
        // 根据 markdown发布的url和id来判断发布的模式是自动还是创建新的文章模式
        for (let i = 0; i < publishers.length; i++) {
          const res = publishers[i].postCache.get(post.value.url);
          if (res) {
            articleIDs.value[i] = res.post_id;
            publishMode.value = PublishMode.Auto;
          } else {
            articleIDs.value[i] = '-1';
          }
        }
      }
    }
  };
  const destory = ipc.receive('menu.publish', menuPublishListen);

  onUnmounted(() => {
    if (destory) destory();
  });

  function select(site: Site) {
    site.selected = !site.selected;
  }

  const fn = async (index: number) => {
    const site = sites.value[index],
      publisher = publishers[index],
      publishParams: PublishParams = {
        post: toRaw(post.value),
        inputID: inputID.value.toString(),
        oldPostID: articleIDs.value[index],
        stateHandler,
        publishMode: publishMode.value,
        detail: detail.value,
        editHandler: (post_1: any) => editHandler(site, post_1)
      };

    try {
      const res = await publisher.publish(publishParams);
      if (res) {
        new Notification(t('publishSuccess'), { body: siteToString(site) });
      }
    } catch (e: any) {
      new Notification(t('publishError'), { body: siteToString(site) + '\n' + e.message });
      console.error(e);
    }
  };

  async function publish() {
    publishing.value = true;
    await promiseConcurrencyLimit(3, selectedSites.value, fn);
    publishing.value = false;
    closePublish();
  }

  function stateHandler(state: any) {
    switch (state) {
      case PublishState.STATE_READ_POST:
        show(t('publish.status.read'));
        break;
      case PublishState.STATE_UPLOAD_MEDIA:
        show(t('publish.status.upload'));
        break;
      case PublishState.STATE_PUBLISH_POST:
        show(t('publish.status.publish'));
        break;
      case PublishState.STATE_EDIT_POST:
        show(t('publish.status.edit'));
        break;
      case PublishState.STATE_COMPLETE:
        show(t('publish.status.complete'));
        break;
    }
  }

  function editHandler(site: Site, post: any) {
    if (site && post) {
      return new Promise((resolve) => {
        const item: EditItem = {
          site,
          post,
          callback: (edit: boolean) => {
            const index: number = editList.value.indexOf(item);
            editList.value.splice(index, 1);
            resolve(edit);
          }
        };
        editList.value.push(item);
      });
    } else {
      return false;
    }
  }
  function showSettings() {
    ipc.send('menu.settings', '');
  }

  function closePublish() {
    showPublish.value = false;
  }

  function confirmNeutral() {
    openSampleFile();
    closePublish();
  }

  function confirmYes() {
    confirm.value = false;
  }
</script>

<template>
  <div v-if="showPublish" class="publish-wrapper">
    <div class="overlay"></div>

    <div class="dialog publish-container">
      <div class="dialog-title">
        <h4>{{ $t('publish.title') }}</h4>
        <svg viewBox="0 0 1024 1024" @click="closePublish">
          <path
            d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z"
          ></path>
        </svg>
        <div class="close-svg"></div>
      </div>

      <div class="dialog-body">
        <div class="publish-sites">
          <div class="publish-site-text">
            <span>{{ $t('publish.selectSites') }}</span>
            <a class="publish-site-edit" href="#" @click="showSettings()">{{ $t('publish.settings') }}</a>
          </div>
          <div class="sites">
            <div v-for="(site, index) in sites" :key="site.url" class="site" @click="select(site)">
              <!-- <div v-for="(site, index) in sites" :key="index" class="site"> -->
              <input v-model="site.selected" title="select" type="checkbox" />
              <div class="site-info">
                <div class="site-name">
                  <h4>{{ site.name }}</h4>
                </div>
                <div class="site-detail">
                  <span>
                    <small>{{ site.username }} </small>
                  </span>
                  <span>
                    <small>{{ site.url }}</small>
                  </span>
                </div>
              </div>
              <div>
                <span> {{ $t('publish.articleID') }}: </span>
                {{ articleIDs[index] }}
              </div>
            </div>
          </div>
        </div>

        <div class="publish-mode">
          <div class="publish-mode-select">
            <label style="margin-right: 10px" for="publish-mode-select">{{ $t('publish.publishMode') }} </label>
            <select id="publish-mode-select" v-model="publishMode">
              <option value="manual">{{ $t('publish.publishModeManual') }}</option>
              <option value="create">{{ $t('publish.publishModeCreate') }}</option>
              <option value="auto">{{ $t('publish.publishModeAuto') }}</option>
            </select>
            <div v-if="publishMode == PublishMode.Manual">
              <label class="publish-mode-label">{{ $t('publish.enterArticleID') }}</label>
              <input v-model="inputID" class="publish-article-id" type="number" placeholder="ID" />
              <label class="publish-mode-label">{{ $t('publish.forcedImageUpdate') }}</label>
              <input v-model="detail.forcedUpdate" type="checkbox" />
            </div>
            <div v-else-if="publishMode == PublishMode.Auto">
              <label class="publish-mode-label">{{ $t('publish.notCheckingRemoteImages') }}</label>
              <input v-model="detail.notCheck" type="checkbox" />
            </div>
          </div>

          <div v-if="publishMode == 'manual'" class="publish-modeXXX-hint">{{ $t('publish.publishModeManualHint') }} </div>
          <div v-if="publishMode == 'auto'" class="publish-modeXXX-hint">{{ $t('publish.publishModeAutoHint') }} </div>
          <div v-if="publishMode == 'create'" class="publish-modeXXX-hint">{{ $t('publish.publishModeCreateHint') }} </div>

          <div class="publish-mode-hint" v-html="$t('publish.publishModeHint')"> </div>
        </div>

        <div class="buttons">
          <button :disabled="publishing" @click="publish">
            {{ publishing ? $t('publish.publishing') : $t('publish.publish') }}
          </button>
        </div>
      </div>
    </div>

    <template v-if="editList.length > 0">
      <div v-for="(edit, index) in editList" :key="index" class="dialog publish-edit">
        <div v-if="edit" class="dialog-title">
          <h4>{{ $t('publish.publishModeConfirm') }}</h4>
        </div>
        <div class="dialog-body">
          <div v-if="edit.site" class="site-detail">
            <span>{{ edit.site.name }}</span>
            <span>{{ edit.site.username }}</span>
            <span>{{ edit.site.url }}</span>
          </div>
          <div>{{ $t('publish.publishModeOldPost') }}</div>
          <div v-if="edit.post" class="post-preview">
            <h1 class="post-preview-title">{{ edit.post.title }}</h1>
            <div class="post-preview-content" v-html="edit.post.description"></div>
          </div>
          <div class="buttons">
            <button @click="() => edit.callback(true)">{{ $t('publish.publishModeEditPost') }}</button>
            <button @click="() => edit.callback(false)">{{ $t('publish.publishModeCreatePost') }}</button>
          </div>
        </div>
      </div>
    </template>

    // 如果当前markdown没有url标签，那么发布的时候就会弹出是否继续或者回退的界面
    <div v-if="confirm" class="dialog publish-confirm">
      <div class="dialog-title">
        <h4>{{ t('publish.confirmUrlTitle') }}</h4>
      </div>
      <div class="dialog-body">
        <div class="publish-confirm-message weighted">{{ t('publish.confirmUrlMessage') }}</div>
        <div class="buttons">
          <button @click="closePublish">{{ t('publish.confirmUrlCancel') }}</button>
          <button @click="confirmNeutral">{{ t('publish.confirmUrlOpenSample') }}</button>
          <button @click="confirmYes">{{ t('publish.confirmUrlContinue') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .publish-wrapper {
    width: 100%;
    height: 100%;
  }
  .dialog {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;

    width: 70%;
    height: 500px;
    min-width: 480px;
    min-height: 360px;

    background-color: white;

    display: flex;
    flex-direction: column;
  }

  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(128, 128, 128, 0.4);
  }

  .post-preview {
    width: 100%;
    height: 0;
    flex-grow: 1;

    overflow-y: scroll;
    border: 1px solid #dddddd;
    padding: 15px;
    box-sizing: border-box;
  }

  .buttons {
    text-align: center;

    > :not(:first-child) {
      margin-left: 10px;
    }
  }

  .publish-mode {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .publish-mode-select {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
    align-content: space-around;
  }
  .publish-mode-label {
    margin-left: 20px;
    margin-right: 5px;
  }

  .publish-article-id {
    width: 45px;
    height: 19px;
  }

  .publish-modeXXX-hint {
    font-size: 0.9em;
    margin: 5px 0;
  }

  .publish-mode-hint {
    color: #666;
    font-size: 0.9em;
  }

  .dialog-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 35px;

    border-bottom: 1px solid #dddddd;

    h4 {
      margin: 0;
      padding: 0;
      display: inline-block;
      flex-grow: 1;
      text-align: center;
    }

    svg {
      margin-right: 8px;
      height: 22px;
      // background-color: transparent;

      &:hover {
        background-color: #aaa;
      }
    }
  }

  .dialog-body {
    padding: 20px;
    height: 0;
    flex-grow: 1;

    display: flex;
    flex-direction: column;

    > *:not(:first-child) {
      margin-top: 15px;
    }
  }

  .publish-sites {
    height: 0;
    flex-grow: 1;
    width: 100%;

    display: flex;
    flex-direction: column;
  }

  .publish-site-edit {
    float: right;
  }

  .sites {
    height: 0;
    flex-grow: 1;
    margin-top: 10px;

    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    &::-webkit-scrollbar {
      display: none;
    }
    > *:not(:first-child) {
      margin-top: 15px;
    }
  }

  .site {
    padding: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    > input {
      margin-right: 20px;
    }
  }

  .site-info {
    width: 0;
    flex-grow: 1;
  }

  .site-detail {
    width: 100%;
    margin-top: 5px;
    overflow-x: hidden;
    white-space: nowrap;

    &::-webkit-scrollbar {
      display: none;
    }

    > *:not(:first-child) {
      margin-left: 15px;
    }
  }

  .weighted {
    height: 0;
    flex-grow: 1;
  }
</style>
