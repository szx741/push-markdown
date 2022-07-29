/*
 * @Author: szx
 * @Date: 2022-07-29 20:51:37
 * @LastEditTime: 2022-07-29 20:59:10
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\configuration\configurate.ts
 */
import { store } from '#preload';
import { publishConf, getPublishConf } from './publish-conf';
import { renderConf, getRenderConf } from './render-conf';
import { sites, getSites } from './sites';

export function resetConfiguration() {
  store.getStoreSettingsClear();
  publishConf.value = getPublishConf();
  renderConf.value = getRenderConf();
  sites.value = getSites();
}

//一键导出，一键导入
