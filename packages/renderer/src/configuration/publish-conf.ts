/*
 * @Author: szx
 * @Date: 2022-07-29 20:22:24
 * @LastEditTime: 2022-08-01 17:42:25
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\configuration\publish-conf.ts
 */
import { store } from '#preload';
import { ref } from 'vue';

export enum AbstractMode {
  Title = 'title',
  Article = 'article',
  Empty = 'empty'
}

export interface PublishConf {
  abstractMode: AbstractMode;
  mathjax: boolean;
  highlight: boolean;
  abstractNum: number;
}

export const publishConf = ref(getPublishConf());

export function savePublishConf(config: PublishConf) {
  return store.storeSettingsSet('publish', config);
}

export function getPublishConf() {
  const defaultValue: PublishConf = {
    abstractMode: AbstractMode.Article,
    mathjax: true,
    abstractNum: 120,
    highlight: false
  };
  const config: PublishConf = store.storeSettingsGet('publish', defaultValue);
  console.log(config);
  return config;
}
