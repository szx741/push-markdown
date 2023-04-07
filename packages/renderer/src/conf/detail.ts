/*
 * @Author: szx
 * @Date: 2022-08-02 23:08:59
 * @LastEditTime: 2023-04-06 18:45:55
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\conf\detail.ts
 */

import { store } from '#preload';
import { ref } from 'vue';

export interface Detail {
  notCheck: boolean;
  forcedUpdate: boolean;
}

export const detail = ref(getDetail());

export function saveDetail(config: Detail) {
  return store.storeSettingsSet('detail', config);
}

export function getDetail() {
  const config: Detail = store.storeSettingsGet('detail');
  return config;
}
