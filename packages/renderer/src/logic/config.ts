/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2022-07-23 21:20:08
 * @Description: user settings
 * @FilePath: \push-markdown\packages\renderer\src\logic\config.ts
 */
'use strict';

import filenamifyUrl from 'filenamify-url';
import { Base64 } from 'js-base64';
import { store } from '#preload';
export function clear() {
  store.getStoreSettingsClear();
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
  const sites = store.storeSettingsGet('sites', defaultSites);
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
  return store.storeSettingsSet('sites', sites);
}

export function saveNotCheck(notcheck: boolean) {
  return store.storeSettingsSet('notcheck', notcheck);
}

export function getNotCheck(defaultValue = true) {
  return store.storeSettingsGet('notcheck', defaultValue);
}

export function getRenderConfig() {
  const defaultValue = {
    abstract: 'article',
    highlight: 'preview',
    mathjax: 'publish',
    mermaid: 'preview'
  };
  const config = store.storeSettingsGet('render', {});
  return {
    ...defaultValue,
    ...config
  };
}
export function saveRenderConfig(render: any) {
  return store.storeSettingsSet('render', JSON.parse(JSON.stringify(render)));
}

export function saveAbstractNumber(abstractNum: any) {
  return store.storeSettingsSet('abstractnumber', abstractNum);
}

export function getAbstractNumber() {
  return store.storeSettingsGet('abstractnumber', 120);
}

export function getArticleID(url: string, siteUrl: string, username: string) {
  const storeName = ['cache', 'post', filenamifyUrl(siteUrl), filenamifyUrl(username)].join('-').toString();
  return store.storeGet(storeName, url);
}
