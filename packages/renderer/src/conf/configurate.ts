/*
 * @Author: szx
 * @Date: 2022-07-29 20:51:37
 * @LastEditTime: 2022-08-03 17:48:18
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\conf\configurate.ts
 */

import { other, store } from '#preload';
import { publishConf, getPublishConf } from './publish-conf';
import { sites, getSites } from './sites';
import { detail, getDetail } from './detail';
import { getFilenamify } from '../utils/tools';

export function resetConfiguration() {
  store.storeSettingsClear();
  publishConf.value = getPublishConf();
  sites.value = getSites();
  detail.value = getDetail();
}

export function openSettings() {
  store.openInEditor();
}

export const settingsPath = store.getSettingsPath();

interface importJSON {
  ID: string;
  Slug: string;
  'Images Filename': string;
  'Image URL': string;
}

export function readClipboard(whichSite: number) {
  const text = other.readFromClipboard(),
    site = sites.value[whichSite],
    key = getFilenamify(site.url, site.username),
    jsons: importJSON[] = JSON.parse(text),
    jsonPost: any = {},
    jsonMedia: any = {};

  jsons.forEach((json) => {
    jsonPost[decodeURI(json.Slug)] = json.ID;
    const imageUrlArr = json['Image URL'].split('||'),
      imageNameArr = json['Images Filename'].split('||');
    imageNameArr.forEach((name, index) => {
      if (name !== '') jsonMedia[name] = imageUrlArr[index];
    });
  });
  let res = store.storeSettingsGet(key);
  if (!res) res = { post: {}, media: {} };
  res.post = { ...res?.post, ...jsonPost };
  res.media = { ...res?.media, ...jsonMedia };
  store.storeSettingsSet(key, res);
}
