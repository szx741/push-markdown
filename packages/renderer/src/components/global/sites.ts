/*
 * @Author: szx
 * @Date: 2022-07-28 21:32:05
 * @LastEditTime: 2022-07-28 22:52:27
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\components\global\sites.ts
 */
import { store } from '#preload';
import { Base64 } from 'js-base64';
import { reactive, toRaw } from 'vue';

interface Site {
  type: string;
  name: string;
  url: string;
  username: string;
  password: string;
  selected: boolean;
  articlesId: { [key: string]: number };
}

export const sites = reactive(getSites());

export function addSite() {
  sites.push(newSite());
}

export function delSite(index: number) {
  sites.splice(index, 1);
  console.log(toRaw(sites));
}

export function saveSites(sites: Site[]) {
  const res = sites.map((site) => ({
    ...site,
    password: Base64.encode(site?.password || '')
  }));
  store.storeSettingsSet('sites', res);
}

function getSites(): Site[] {
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
