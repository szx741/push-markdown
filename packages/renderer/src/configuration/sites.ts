/*
 * @Author: szx
 * @Date: 2022-07-28 21:32:05
 * @LastEditTime: 2022-07-29 20:58:27
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\configuration\sites.ts
 */
import { store } from '#preload';
import { Base64 } from 'js-base64';
import { ref } from 'vue';

export interface Site {
  type: string;
  name: string;
  url: string;
  username: string;
  password: string;
  selected: boolean;
  articlesId: { [key: string]: number };
}

export const sites = ref(getSites());

export function addSite() {
  sites.value.push(newSite());
}

export function delSite(index: number) {
  sites.value.splice(index, 1);
}

export function saveSites(sites: Site[]) {
  const res = sites.map((site) => ({
    ...site,
    password: Base64.encode(site?.password || '')
  }));
  store.storeSettingsSet('sites', res);
}

export function getSites(): Site[] {
  const sites: Site[] = store.storeSettingsGet('sites', [newSite()]);
  sites.forEach((site) => {
    site.password = site.password && Base64.decode(site.password);
  });
  console.log(sites);
  return sites;
}

function newSite(): Site {
  return {
    type: 'MetaWeblog',
    name: 'Sample Site Config',
    url: 'http://www.example.com/xmlrpc.php',
    username: 'username',
    password: '',
    selected: false,
    articlesId: {}
  };
}
