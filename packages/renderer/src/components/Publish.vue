<!-- 发布窗口 -->
<script setup lang="ts">
  import { computed, onMounted, Ref, ref, toRef } from 'vue';
  import Promise from 'bluebird';

  import * as publisher from '../logic/publisher';
  import { Publisher } from '../logic/publisher';
  import { openSampleFile } from '../logic/utils';
  import * as statusBar from '../logic/statusBar';

  import * as config from '../logic/config';
  import { SiteConfig } from '../logic/config';
  import { Post } from '../logic/renderer';
  import { useI18n } from 'vue-i18n';
  import { ipc } from '#preload';
  import { sites } from './global/sites';

  const props = defineProps<{
      post: Post;
      active: boolean;
    }>(),
    active = toRef(props, 'active'), // 当前选中的界面
    post = toRef(props, 'post'),
    publishMode = ref('manual'),
    showPublish = ref(false),
    editList: Ref<any> = ref([]),
    publishing = ref(false),
    confirm = ref({
      title: '',
      message: '',
      yes: {},
      no: {},
      neutral: {}
    }),
    aritcleId: Ref<number> = ref(-1),
    blogID = ref(0),
    forcedUpdate = ref(false),
    getNetPic = ref(true),
    notCheck = ref(config.getNotCheck()),
    { t } = useI18n();

  const siteToString = (site: any) => `${site.name} [${site.username}] [${site.url}]`;
  const selectedSites = computed(() => sites.filter((site) => site.selected));

  for (const site of sites) {
    if (post.value.url && site.articlesId.hasOwnProperty(post.value.url)) {
      aritcleId.value = site.articlesId[post.value.url];
      publishMode.value = 'auto';
    } else {
      publishMode.value = 'create';
    }
  }

  onMounted(() => {
    // 收到发布信息，然后读取之前的设置
    ipc.receive('menu.publish', () => {
      if (active.value && post.value) {
        // 展现Publish的面板
        showPublish.value = true;
        // 如果没有设置URL，就会弹出窗口提醒
        if (!post.value.url) {
          confirm.value = {
            title: t('publish.confirmUrlTitle'),
            message: t('publish.confirmUrlMessage'),
            yes: {
              message: t('publish.confirmUrlContinue'),
              callback: (): any => {
                confirm.value = {
                  title: '',
                  message: '',
                  yes: {},
                  no: {},
                  neutral: {}
                };
              }
            },
            neutral: {
              message: t('publish.confirmUrlOpenSample'),
              callback: (): any => {
                openSampleFile();
                showPublish.value = false;
              }
            },
            no: {
              message: t('publish.confirmUrlCancel'),
              callback: () => {
                showPublish.value = false;
              }
            }
          };
        } else {
          console.log('?????sss');
          for (const site of sites) {
            if (site.articlesId.hasOwnProperty(post.value.url)) publishMode.value = 'auto';
            else {
              site.articlesId[post.value.url] = -1;
              publishMode.value = 'create';
            }
          }
        }
      }
    });
  });

  function select(site: any) {
    ref(!site.selected);
    // this.$set(site, 'selected', !Boolean(site.selected));
  }
  async function publish() {
    publishing.value = true;
    // save sites selection
    config.saveSites(sites);
    // publish
    let success = 0;
    await Promise.map(
      selectedSites.value,
      async (site: SiteConfig) => {
        console.log('site.url:', site.url);
        try {
          const published = await new Publisher(site.url, site.username, site.password, site.type).publish(
            post.value,
            blogID.value,
            (state: any) => {
              switch (state) {
                case publisher.STATE_RENDER:
                  statusBar.show(t('publish.status.render'));
                  break;
                case publisher.STATE_READ_POST:
                  statusBar.show(t('publish.status.read'));
                  break;
                case publisher.STATE_UPLOAD_MEDIA:
                  statusBar.show(t('publish.status.upload'));
                  break;
                case publisher.STATE_PUBLISH_POST:
                  statusBar.show(t('publish.status.publish'));
                  break;
                case publisher.STATE_EDIT_POST:
                  statusBar.show(t('publish.status.edit'));
                  break;
                case publisher.STATE_COMPLETE:
                  statusBar.show(t('publish.status.complete'));
                  break;
              }
            },
            publishMode.value,
            forcedUpdate.value ? 'force' : 'cache',
            getNetPic.value,
            notCheck.value,
            (post_1: any) => editHandler(site, post_1)
          );
          if (published) {
            success++;
            new Notification(t('publishSuccess'), { body: siteToString(site) });
          }
        } catch (e: any) {
          new Notification(t('publishError'), { body: siteToString(site) + '\n' + e.message });
          console.error(e);
        }
      },
      { concurrency: 3 }
    );
    publishing.value = false;
    // all success
    if (success >= selectedSites.value.length) {
      closePublish();
    }
  }
  function editHandler(site: any, post: any) {
    if (site && post) {
      return new Promise((resolve: any) => {
        const item: any = {
          site,
          post,
          callback: (edit: any): any => {
            // edit: boolean
            // remove item from editList and then resolve
            const index: any = editList.value.indexOf(item);
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
    console.log('show settings');
    ipc.send('menu.settings', '');
  }
  function closePublish() {
    showPublish.value = false;
  }
</script>

<template>
  <div v-if="showPublish" class="publish-wrapper">
    <div class="overlay"></div>

    <div class="dialog publish-container">
      <div class="dialog-title">
        <h4>{{ $t('publish.title') }}</h4>
        <img src="../common/assets/close.png" @click="closePublish" />
      </div>

      <div class="dialog-body">
        <div class="publish-sites">
          <div class="publish-site-text">
            <span>{{ $t('publish.selectSites') }}</span>
            <a class="publish-site-edit" href="#" @click="showSettings()">{{ $t('publish.settings') }}</a>
          </div>
          <div class="sites">
            <div v-for="(site, index) in sites" :key="index" class="site" @click="() => select(site)">
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
                {{ aritcleId }}
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
            <div v-if="publishMode == 'manual'">
              <label class="publish-mode-label">{{ $t('publish.enterArticleID') }}</label>
              <input v-model="blogID" class="publish-article-id" type="number" placeholder="ID" />
              <label class="publish-mode-label">{{ $t('publish.getRemoteImages') }}</label>
              <input v-model="getNetPic" type="checkbox" :disabled="forcedUpdate" />
              <label class="publish-mode-label">{{ $t('publish.forcedImageUpdate') }}</label>
              <input v-model="forcedUpdate" type="checkbox" :disabled="getNetPic" />
            </div>
            <div v-else-if="publishMode == 'auto'">
              <label class="publish-mode-label">{{ $t('publish.notCheckingRemoteImages') }}</label>
              <input v-model="notCheck" type="checkbox" />
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

    <template v-if="editList && editList.length > 0">
      <div v-for="edit in editList" :key="edit" class="dialog publish-edit">
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
          <div v-if="edit.post" class="post-preview markdown-body">
            <h1 class="post-preview-title">{{ edit.post.title }}</h1>
            <div class="post-preview-content" v-html="edit.post.html"></div>
          </div>
          <div class="buttons">
            <button @click="() => edit.callback(true)">{{ $t('publish.publishModeEditPost') }}</button>
            <button @click="() => edit.callback(false)">{{ $t('publish.publishModeCreatePost') }}</button>
          </div>
        </div>
      </div>
    </template>

    <div v-if="confirm && confirm.title" class="dialog publish-confirm">
      <div class="dialog-title">
        <h4>{{ confirm.title }}</h4>
      </div>
      <div class="dialog-body">
        <div class="publish-confirm-message weighted">{{ confirm.message }}</div>
        <div class="buttons">
          <button v-if="confirm.no" @click="confirm.no.callback">{{ confirm.no.message }}</button>
          <button v-if="confirm.neutral" @click="confirm.neutral.callback">{{ confirm.neutral.message }}</button>
          <button v-if="confirm.yes" @click="confirm.yes.callback">{{ confirm.yes.message }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .dialog {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 15%;

    width: 70%;
    height: 70%;
    min-width: 480px;
    min-height: 360px;

    background-color: white;

    display: flex;
    flex-direction: column;
  }

  img {
    background-color: whitesmoke;
  }
  .publish-wrapper {
    width: 100%;
    height: 100%;
  }

  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(128, 128, 128, 0.7);
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

  .publish-mode-select {
    display: flex;
    align-items: center;
    height: 30px;
  }
  .publish-mode-label {
    margin-left: 20px;
  }

  .publish-article-id {
    margin-left: 10px;
    width: 60px;
  }

  .publish-modeXXX-hint {
    font-size: 0.9em;
    margin-top: 5px;
  }

  .publish-mode-hint {
    color: #666;
    font-size: 0.9em;
    // margin-top: 5px;
  }

  .dialog-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 35px;

    border-bottom: 1px solid #dddddd;

    h4 {
      display: inline-block;
      flex-grow: 1;
      text-align: center;
    }

    img {
      padding: 8px;
      height: 19px;
      width: auto;

      &:hover {
        background-color: #dddddd;
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
    background-color: #f0f0f0;
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
