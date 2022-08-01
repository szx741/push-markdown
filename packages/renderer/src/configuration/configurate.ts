/*
 * @Author: szx
 * @Date: 2022-07-29 20:51:37
 * @LastEditTime: 2022-08-01 16:33:36
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\configuration\configurate.ts
 */
import { store } from '#preload';
import { publishConf, getPublishConf } from './publish-conf';
import { sites, getSites } from './sites';

export function resetConfiguration() {
  store.getStoreSettingsClear();
  publishConf.value = getPublishConf();
  sites.value = getSites();
}

//一键导出，一键导入
