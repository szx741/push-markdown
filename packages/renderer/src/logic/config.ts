/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2022-08-02 23:02:03
 * @Description: user settings
 * @FilePath: \push-markdown\packages\renderer\src\logic\config.ts
 */
'use strict';

import { store } from '#preload';

export function saveNotCheck(notcheck: boolean) {
  return store.storeSettingsSet('notcheck', notcheck);
}

export function getNotCheck(defaultValue = true) {
  return store.storeSettingsGet('notcheck', defaultValue);
}

export function getTheme(): boolean {
  return store.getTheme();
}
