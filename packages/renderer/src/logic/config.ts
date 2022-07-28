/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2022-07-28 11:31:12
 * @Description: user settings
 * @FilePath: \push-markdown\packages\renderer\src\logic\config.ts
 */
'use strict';

import filenamifyUrl from 'filenamify-url';
import { Base64 } from 'js-base64';
import { store } from '#preload';

export interface SiteConfig {
  type: string;
  name: string;
  url: string;
  username: string;
  password: string;
}
export interface RenderConfig {
  abstract: string;
  highlight: string;
  mathjax: string;
  mermaid: string;
}
export function clear() {
  store.getStoreSettingsClear();
}

export function newSite(): SiteConfig {
  return {
    type: 'MetaWeblog',
    name: 'Sample Site Config',
    url: 'http://www.example.com/xmlrpc.php',
    username: 'username',
    password: ''
  };
}

const defaultSites = [newSite()];

/**
 * 获得网站的配置信息，密码需要用Base64解码
 * @returns SiteConfig[]
 */
export function getSites(): SiteConfig[] {
  const sites: SiteConfig[] = store.storeSettingsGet('sites', defaultSites);
  sites.forEach((site) => {
    site.password = site.password && Base64.decode(site.password);
  });
  return sites;
}

/**
 * 保存网站配置信息，密码以Base64的方式保存
 * @param sites
 */
export function saveSites(sites: SiteConfig[]) {
  sites.forEach((site) => {
    site.password = site.password && Base64.encode(site.password);
  });
  store.storeSettingsSet('sites', sites);
}

export function saveNotCheck(notcheck: boolean) {
  return store.storeSettingsSet('notcheck', notcheck);
}

export function getNotCheck(defaultValue = true) {
  return store.storeSettingsGet('notcheck', defaultValue);
}

export function getRenderConfig() {
  const defaultValue: RenderConfig = {
    abstract: 'article',
    highlight: 'preview',
    mathjax: 'publish',
    mermaid: 'preview'
  };
  const config: RenderConfig = store.storeSettingsGet('render', {});
  return {
    ...defaultValue,
    ...config
  };
}
export function saveRenderConfig(render: any) {
  console.log(render);
  return store.storeSettingsSet('render', JSON.parse(JSON.stringify(render)));
}

export function saveAbstractNumber(abstractNum: any) {
  return store.storeSettingsSet('abstractnumber', abstractNum);
}

export function getAbstractNumber(): number {
  return store.storeSettingsGet('abstractnumber', 120);
}

export function getArticleID(url: string, siteUrl: string, username: string) {
  const storeName = ['cache', 'post', filenamifyUrl(siteUrl), filenamifyUrl(username)].join('-').toString();
  return store.storeGet(storeName, url);
}
