/*
 * @Author: szx
 * @Date: 2022-07-29 20:06:15
 * @LastEditTime: 2022-07-29 21:11:33
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\configuration\render-conf.ts
 */
import { store } from '#preload';
import { ref } from 'vue';

export enum RenderMode {
  Preview = 'preview',
  Publish = 'publish',
  Forbidden = 'forbidden'
}

export interface RenderConf {
  mathjax: RenderMode;
  mermaid: RenderMode;
}

export const renderConf = ref(getRenderConf());

export function saveRenderConf(config: RenderConf) {
  return store.storeSettingsSet('render', config);
}

export function getRenderConf() {
  const defaultValue: RenderConf = {
    mathjax: RenderMode.Preview,
    mermaid: RenderMode.Preview
  };
  const config: RenderConf = store.storeSettingsGet('render', defaultValue);
  return config;
}
