/*
 * @Author: szx
 * @Date: 2022-07-29 20:51:37
 * @LastEditTime: 2022-08-02 23:05:01
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\configuration\configurate.ts
 */
import { store } from '#preload';
import { publishConf, getPublishConf } from './publish-conf';
import { sites, getSites } from './sites';

export function resetConfiguration() {
  store.storeSettingsClear();
  publishConf.value = getPublishConf();
  sites.value = getSites();
}

export function openSettings() {
  store.openInEditor();
}

export const settingsPath = store.getSettingsPath();
