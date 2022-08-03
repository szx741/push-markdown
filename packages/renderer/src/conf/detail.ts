/*
 * @Author: szx
 * @Date: 2022-08-02 23:08:59
 * @LastEditTime: 2022-08-03 13:35:03
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\configuration\detail.ts
 */

import { store } from '#preload';
import { ref } from 'vue';

export interface Detail {
  notCheck: boolean;
  forcedUpdate: boolean;
  getNetPic: boolean;
}

export const detail = ref(getDetail());

export function saveDetail(config: Detail) {
  return store.storeSettingsSet('detail', config);
}

export function getDetail() {
  const config: Detail = store.storeSettingsGet('detail');
  return config;
}
