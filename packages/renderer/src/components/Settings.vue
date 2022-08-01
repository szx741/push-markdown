<!-- 设置页面 -->
<script setup lang="ts">
  import { toRaw, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import debounce from 'lodash-es/debounce';

  import * as statusBar from '../logic/statusBar';
  import { resetConfiguration } from '../configuration/configurate';
  import { notifyConfigChanged } from '../mdRenderer';
  import { sites, addSite, delSite, saveSites } from '../configuration/sites';
  import { publishConf, savePublishConf, AbstractMode } from '../configuration/publish-conf';

  const { t } = useI18n();

  watch(
    sites,
    debounce((value) => {
      saveSites(toRaw(value));
      statusBar.show(t('setting.saveSettings'));
    }, 1000),
    { deep: true }
  );
  watch(
    publishConf,
    debounce((value) => {
      savePublishConf(toRaw(value));
      statusBar.show(t('setting.saveSettings'));
    }, 1000),
    { deep: true }
  );

  function resetSettings() {
    if (window.confirm(t('setting.resetConfirm'))) {
      resetConfiguration();
    }
  }
</script>

<template>
  <div class="container">
    <div class="settings">
      <h2>{{ $t('settings') }}</h2>

      <h3>{{ $t('setting.siteSettings') }}</h3>

      <blockquote class="small" v-html="$t('setting.siteSettingsNote')"></blockquote>

      <template v-if="sites">
        <div v-for="(site, i) in sites" :key="i" class="site">
          <div>
            <label for="name">{{ $t('setting.name') }}</label>
            <input id="name" v-model="site.name" type="text" />
          </div>

          <div>
            <label for="url">{{ $t('setting.url') }}</label>
            <input id="url" v-model="site.url" type="url" />
          </div>

          <div>
            <label for="username">{{ $t('setting.username') }}</label>
            <input id="username" v-model="site.username" type="text" />
          </div>

          <div>
            <label for="password">{{ $t('setting.password') }}</label>
            <input id="password" v-model="site.password" type="password" />
          </div>

          <svg class="delete" viewBox="0 0 1024 1024" @click="delSite(i)">
            <path
              d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z"
            ></path>
          </svg>
        </div>
      </template>

      <p class="buttons">
        <button @click="addSite">{{ $t('setting.addSite') }}</button>
      </p>

      <h3>{{ $t('setting.renderSettings') }}</h3>

      <div class="abstract-select">
        <label for="abstract">{{ $t('setting.abstract.name') }}</label>
        <select id="abstract" v-model="publishConf.abstractMode">
          <option :value="AbstractMode.Empty">{{ $t('setting.abstract.options.empty') }}</option>
          <option :value="AbstractMode.Article">{{ $t('setting.abstract.options.article') }}</option>
          <option :value="AbstractMode.Title">{{ $t('setting.abstract.options.title') }}</option>
        </select>
        <div v-if="publishConf.abstractMode === AbstractMode.Article" class="abstract-article">
          <label>{{ $t('setting.abstract.abstractNum') }}</label>
          <input v-model="publishConf.abstractNum" class="abstract-article-input" type="number" />
        </div>
      </div>

      <blockquote class="small">{{ $t('setting.abstract.notes') }}</blockquote>

      <p>
        <label for="highlight">{{ $t('setting.renderFeature.highlight') }}</label>
        <select id="highlight" v-model="publishConf.highlight">
          <option :value="true">{{ $t('setting.renderFeature.options.yes') }}</option>
          <option :value="false">{{ $t('setting.renderFeature.options.no') }}</option>
        </select>
      </p>

      <p>
        <label for="math">{{ $t('setting.renderFeature.mathjax') }}</label>
        <select id="math" v-model="publishConf.mathjax">
          <option :value="true">{{ $t('setting.renderFeature.options.yes') }}</option>
          <option :value="false">{{ $t('setting.renderFeature.options.no') }}</option>
        </select>
      </p>

      <blockquote class="small" v-html="$t('setting.renderFeature.notes')"></blockquote>

      <h3>{{ $t('setting.otherSettings') }}</h3>

      <p class="buttons">
        <button @click="resetSettings">{{ $t('setting.reset') }}</button>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;

    &::-webkit-scrollbar {
      width: 7px;
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
  .abstract-select {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    height: 30px;
  }

  .abstract-article {
    margin-left: 30px;
  }

  .abstract-article-input {
    margin-left: 5px;
    width: 40px;
  }

  .settings {
    padding: 60px 20px;
    width: 600px;
    margin: auto;
    max-width: 100%;
  }

  .site {
    position: relative;
    padding: 15px 40px 15px 20px;
    margin-bottom: 20px;
    font-size: 85%;

    > div + div {
      margin-top: 8px;
    }

    div {
      display: flex;
      flex-direction: row;
    }

    label {
      display: inline-block;
      width: 80px;
      padding: 3px 0;
    }

    input {
      flex-grow: 1;
      width: 0;
      outline: none;
      border: 1px solid;
      padding: 2px 5px;
    }
  }

  select {
    margin-left: 5px;
    outline: none;
  }

  .render {
    > *:not(:first-child) {
      margin-top: 15px;
    }
  }

  .delete {
    background-color: transparent;
    padding: 5px;
    height: 20px;
    width: auto;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }

  small,
  .small {
    font-size: 85%;
  }

  .buttons {
    text-align: center;
  }
</style>
