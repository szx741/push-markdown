/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2021-07-07 17:15:35
 * @Description:
 * @FilePath: \push-markdown\src\logic\config.ts
 */
/**
 * user settings
 *
 * Created by jzj on 2018/12/23.
 */
'use strict';

const Base64 = require('js-base64').Base64;

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
  const sites = window.api.storeGet('sites', defaultSites);
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
  return window.api.storeSet('sites', sites);
}

export function getPublishMode(defaultValue = 'manual') {
  return window.api.storeGet('publish.mode', defaultValue);
}

export function savePublishMode(publishMode: any) {
  return window.api.storeSet('publish.mode', publishMode);
}

export function getRenderConfig() {
  let defaultValue = {
    abstract: 'empty',
    highlight: 'preview',
    mathjax: 'preview',
    mermaid: 'preview'
  };
  let config = window.api.storeGet('render', {});
  return {
    ...defaultValue,
    ...config
  };
}

export function saveRenderConfig(render: any) {
  return window.api.storeSet('render', render);
}
