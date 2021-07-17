/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2021-07-14 14:34:24
 * @Description:
 * @FilePath: \push-markdown\src\logic\config.ts
 */
/**
 * user settings
 *
 * Created by jzj on 2018/12/23.
 */
'use strict';

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
  // console.log('sites:', sites);
  // decode
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

export function getRenderConfig() {
  const defaultValue = {
    abstract: 'article',
    highlight: 'preview',
    mathjax: 'preview',
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