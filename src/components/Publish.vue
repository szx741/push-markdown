<!-- 发布窗口 -->

<template>
  <div class="publish-wrapper" v-if="showPublish">
    <div class="overlay"></div>

    <div class="dialog publish-container">
      <div class="dialog-title">
        <h4>{{ $t('publish.title') }}</h4>
        <img @click="closePublish" src="../common/assets/close.png" />
      </div>

      <div class="dialog-body">
        <div class="publish-sites">
          <div class="publish-site-text">
            <span>{{ $t('publish.selectSites') }}</span>
            <a class="publish-site-edit" href="#" @click="showSettings()">{{ $t('publish.settings') }}</a>
          </div>
          <div class="sites">
            <div v-for="site in sites" :key="site" class="site" @click="() => select(site)">
              <input title="select" type="checkbox" v-model="site.selected" />
              <div class="site-info">
                <div class="site-name"
                  ><h4>{{ site.name }}</h4></div
                >
                <div class="site-detail">
                  <span
                    ><small>{{ site.username }}</small></span
                  >
                  <span
                    ><small>{{ site.url }}</small></span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="publish-mode">
          <label for="publish-mode-select">{{ $t('publish.publishMode') }}</label>
          <select id="publish-mode-select" v-model="publishMode">
            <option value="manual">{{ $t('publish.publishModeManual') }}</option>
            <option value="create">{{ $t('publish.publishModeCreate') }}</option>
            <option value="auto">{{ $t('publish.publishModeAuto') }}</option>
          </select>
          <div class="publish-mode-hint">{{ $t('publish.publishModeHint') }}</div>
        </div>

        <div class="buttons">
          <button @click="publish" :disabled="publishing">
            {{ publishing ? $t('publish.publishing') : $t('publish.publish') }}
          </button>
        </div>
      </div>
    </div>

    <template v-if="editList && editList.length > 0">
      <div class="dialog publish-edit" v-for="edit in editList" :key="edit">
        <div class="dialog-title" v-if="edit">
          <h4>{{ $t('publish.publishModeConfirm') }}</h4>
        </div>
        <div class="dialog-body">
          <div class="site-detail" v-if="edit.site">
            <span>{{ edit.site.name }}</span>
            <span>{{ edit.site.username }}</span>
            <span>{{ edit.site.url }}</span>
          </div>
          <div>{{ $t('publish.publishModeOldPost') }}</div>
          <div class="post-preview markdown-body" v-if="edit.post">
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

    <div class="dialog publish-confirm" v-if="confirm && confirm.title">
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

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';

  import * as publisher from '../logic/publisher';
  import { Publisher } from '../logic/publisher';
  import { openSampleFile } from '../logic/utils';
  import * as statusBar from '../logic/statusBar';
  import { windowsStore } from 'process';

  import Promise from 'bluebird';
  import * as config from '../logic/config';
  import i18n from '@/common/lib/language';

  interface data {
    publishMode: string;
    showPublish: boolean;
    sites: any;
    editList: any;
    publishing: any;
    confirm: any;
  }
  function siteToString(site: any) {
    return `${site.name} [${site.username}] [${site.url}]`;
  }
  export default defineComponent({
    name: 'Publish',
    props: ['post', 'active'],
    data(): data {
      return {
        publishMode: 'manual',
        showPublish: false,
        sites: [],
        editList: [],
        publishing: false,
        confirm: {
          title: '',
          message: '',
          yes: {},
          no: {},
          neutral: {}
        }
      };
    },
    watch: {
      publishMode() {
        console.log('publishMode', this.publishMode);
      }
    },
    mounted() {
      // 收到发布信息，然后读取之前的设置
      window.api.receive('menu.publish', () => {
        if (this.active && this.post) {
          this.sites = config.getSites();
          this.publishMode = config.getPublishMode('manual');
          // 展现Publish的面板
          this.showPublish = true;
          // 如果没有设置URL，就会弹出窗口提醒
          if (!this.post.url) {
            this.confirm = {
              title: i18n.global.t('publish.confirmUrlTitle'),
              message: i18n.global.t('publish.confirmUrlMessage'),
              yes: {
                message: i18n.global.t('publish.confirmUrlContinue'),
                callback: (): any => {
                  this.confirm = {
                    title: '',
                    message: '',
                    yes: {},
                    no: {},
                    neutral: {}
                  };
                }
              },
              neutral: {
                message: i18n.global.t('publish.confirmUrlOpenSample'),
                callback: (): any => {
                  openSampleFile();
                  this.showPublish = false;
                }
              },
              no: {
                message: i18n.global.t('publish.confirmUrlCancel'),
                callback: () => {
                  this.showPublish = false;
                }
              }
            };
          }
        }
      });
    },
    methods: {
      select(site: any) {
        ref(!site.selected);
        // this.$set(site, 'selected', !Boolean(site.selected));
      },
      async publish() {
        this.publishing = true;
        // save sites selection
        config.saveSites(this.sites);
        // save publish mode
        config.savePublishMode(this.publishMode);
        // publish
        const selectedSites = this.sites.filter((site: any) => site.selected);
        let success = 0;
        await Promise.map(
          selectedSites,
          (site: any) => {
            console.log('site.url:', site.url);
            return new Publisher(site.url, site.username, site.password, site.type)
              .publish(
                this.post,
                (state: any) => {
                  switch (state) {
                    case publisher.STATE_RENDER:
                      statusBar.show(i18n.global.t('publish.status.render'));
                      break;
                    case publisher.STATE_READ_POST:
                      statusBar.show(i18n.global.t('publish.status.read'));
                      break;
                    case publisher.STATE_UPLOAD_MEDIA:
                      statusBar.show(i18n.global.t('publish.status.upload'));
                      break;
                    case publisher.STATE_PUBLISH_POST:
                      statusBar.show(i18n.global.t('publish.status.publish'));
                      break;
                    case publisher.STATE_EDIT_POST:
                      statusBar.show(i18n.global.t('publish.status.edit'));
                      break;
                    case publisher.STATE_COMPLETE:
                      statusBar.show(i18n.global.t('publish.status.complete'));
                      break;
                  }
                },
                this.publishMode,
                'cache',
                (post: any) => this.editHandler(site, post)
              )
              .then((published) => {
                if (published) {
                  success++;
                  new Notification(i18n.global.t('publishSuccess'), { body: siteToString(site) });
                }
              })
              .catch((e) => {
                new Notification(i18n.global.t('publishError'), { body: siteToString(site) + '\n' + e.message });
                console.error(e);
              });
          },
          { concurrency: 3 }
        );
        this.publishing = false;
        // all success
        if (success >= selectedSites.length) {
          this.closePublish();
        }
      },
      editHandler(site: any, post: any) {
        if (site && post) {
          return new Promise((resolve: any, reject: any) => {
            const item: any = {
              site,
              post,
              callback: (edit: any): any => {
                // edit: boolean
                // remove item from editList and then resolve
                const index: any = this.editList.indexOf(item);
                this.editList.splice(index, 1);
                resolve(edit);
              }
            };
            this.editList.push(item);
          });
        } else {
          return false;
        }
      },
      showSettings() {
        // console.log('show settings')
        window.api.send('menu.settings');
      },
      closePublish() {
        this.showPublish = false;
      }
    }
  });
</script>

<style lang="scss" scoped>
  .dialog {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    width: 70%;
    height: 70%;
    min-width: 480px;
    min-height: 360px;

    background-color: white;

    display: flex;
    flex-direction: column;
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

  .publish-container {
  }

  .publish-mode-hint {
    color: #666;
    font-size: 0.9em;
    margin-top: 5px;
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

    overflow-y: scroll;
    padding: 10px;
    border: 1px solid #ccc;
    box-sizing: border-box;

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
    overflow-x: scroll;
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
