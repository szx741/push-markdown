/*
 * @Author: szx
 * @Date: 2022-07-29 20:22:24
 * @LastEditTime: 2022-07-29 21:14:22
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

enum RenderMode {
  Preview = 'preview',
  Publish = 'publish',
  Forbidden = 'forbidden'
}

export interface PublishConf {
  abstractMode: AbstractMode;
  highlight: RenderMode;
  abstractNum: number;
}

export const publishConf = ref(getPublishConf());

export function savePublishConf(config: PublishConf) {
  return store.storeSettingsSet('publish', config);
}

export function getPublishConf() {
  const defaultValue: PublishConf = {
    abstractMode: AbstractMode.Article,
    abstractNum: 120,
    highlight: RenderMode.Preview
  };
  const config: PublishConf = store.storeSettingsGet('publish', defaultValue);
  return config;
}
