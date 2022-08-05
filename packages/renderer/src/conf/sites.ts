/*
 * @Author: szx
 * @Date: 2022-07-28 21:32:05
 * @LastEditTime: 2022-08-04 21:47:23
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\conf\sites.ts
 */
import { store } from '#preload';
import { ref } from 'vue';
import { MetaPublisher, initMetaPublisher } from '../mdPublish';

export interface Site {
  name: string;
  url: string;
  username: string;
  password: string;
  selected: boolean;
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
  sites.forEach((site) => {
    publishers.push(initMetaPublisher(site.url, site.username, site.password));
  });
  store.storeSettingsSet('sites', sites);
}

export function getSites(): Site[] {
  const sites: Site[] = store.storeSettingsGet('sites');
  sites.forEach((site) => {
    publishers.push(initMetaPublisher(site.url, site.username, site.password));
  });
  return sites;
}

function newSite(): Site {
  return {
    name: 'Sample Site Config',
    url: 'https://www.example.com/xmlrpc.php',
    username: 'username',
    password: '',
    selected: false
  };
}
