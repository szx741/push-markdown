/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2022-01-14 13:01:07
 * @Description: user settings
 * @FilePath: \push-markdown\src\logic\config.ts
 */
'use strict';

import filenamifyUrl from 'filenamify-url';
import * as Base64 from 'js-base64/base64';

export function clear() {
  window.api.getStoreSettingsClear();
}

export function newSite() {
  return {
    type: 'MetaWeblog',
    name: 'Sample Site Config',
    url: 'http://www.example.com/xmlrpc.php',
    username: 'username',
    password: ''
  };
}

const defaultSites = [newSite()];

export function getSites() {
  const sites = window.api.storeSettingsGet('sites', defaultSites);
  return (
    sites &&
    sites.map((site: any) => {
      return {
        ...site,
        password: site.password && Base64.decode(site.password)
      };
    })
  );
}

export function saveSites(sites: any) {
  // encode
  sites =
    sites &&
    sites.map((site: any) => {
      return {
        ...site,
        password: site.password && Base64.encode(site.password)
      };
    });
  return window.api.storeSettingsSet('sites', sites);
}

// 给个获取的默认值，就是手动，但如果有值的话就会用那个值
export function getPublishMode(defaultValue = 'manual') {
  return window.api.storeSettingsGet('publish.mode', defaultValue);
}

export function savePublishMode(publishMode: any) {
  return window.api.storeSettingsSet('publish.mode', publishMode);
}

export function saveNotCheck(notcheck: boolean) {
  return window.api.storeSettingsSet('notcheck', notcheck);
}

export function getNotCheck(defaultValue = true) {
  return window.api.storeSettingsGet('notcheck', defaultValue);
}

export function getRenderConfig() {
  const defaultValue = {
    abstract: 'article',
    highlight: 'preview',
    mathjax: 'publish',
    mermaid: 'preview'
  };
  const config = window.api.storeSettingsGet('render', {});
  return {
    ...defaultValue,
    ...config
  };
}

export function saveRenderConfig(render: any) {
  return window.api.storeSettingsSet('render', JSON.parse(JSON.stringify(render)));
}

export function getArticleID(url: string, siteUrl: string, username: string) {
  console.log(url, username, siteUrl, '???')
  const storeName = ['cache', 'post', filenamifyUrl(siteUrl), filenamifyUrl(username)].join('-').toString();
  return window.api.storeGet(storeName, url);
}
