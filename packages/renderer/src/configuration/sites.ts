/*
 * @Author: szx
 * @Date: 2022-07-28 21:32:05
 * @LastEditTime: 2022-07-30 14:57:44
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\configuration\sites.ts
 */
import { store } from '#preload';
import { Base64 } from 'js-base64';
import { ref } from 'vue';
import { MetaPublisher, initMetaPublisher } from '../mdPublish';

export interface Site {
  name: string;
  url: string;
  username: string;
  password: string;
  selected: boolean;
  articlesId: { [key: string]: number };
}
export let publishers: MetaPublisher[] = [];
export const sites = ref(getSites());

export function addSite() {
  sites.value.push(newSite());
}

export function delSite(index: number) {
  sites.value.splice(index, 1);
}

export function saveSites(sites: Site[]) {
  publishers = [];
  const res = sites.map((site) => {
    publishers.push(initMetaPublisher(site.url, site.username, site.password));
    return { ...site, password: Base64.encode(site?.password || '') };
  });
  store.storeSettingsSet('sites', res);
}

export function getSites(): Site[] {
  const sites: Site[] = store.storeSettingsGet('sites', [newSite()]);
  sites.forEach((site) => {
    site.password = site.password && Base64.decode(site.password);
    publishers.push(initMetaPublisher(site.url, site.username, site.password));
  });
  return sites;
}

function newSite(): Site {
  return {
    name: 'Sample Site Config',
    url: 'http://www.example.com/xmlrpc.php',
    username: 'username',
    password: '',
    selected: false,
    articlesId: {}
  };
}
