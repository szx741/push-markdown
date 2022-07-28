/*
 * @Author: szx
 * @Date: 2022-07-28 20:05:52
 * @LastEditTime: 2022-07-28 21:09:43
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\store\sitesConfig.ts
 */
import { getSites } from '../logic/config';
import { StoreOptions } from 'vuex';

interface Site {
  type: string;
  name: string;
  url: string;
  username: string;
  password: string;
}
interface State {
  sites: Site[];
}

export function newSite(): Site {
  return {
    type: 'MetaWeblog',
    name: 'Sample Site Config',
    url: 'http://www.example.com/xmlrpc.php',
    username: 'username',
    password: ''
  };
}
export const moduleSites: StoreOptions<State> = {
  state: {
    sites: getSites()
  },
  mutations: {
    addSite(state) {
      state.sites.push(newSite());
    },
    delSite(state, index: number) {
      state.sites.splice(index, 1);
    }
  }
};
