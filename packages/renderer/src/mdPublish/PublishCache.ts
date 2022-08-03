/*
 * @Author: szx
 * @Date: 2021-07-11 18:03:08
 * @LastEditTime: 2022-08-03 13:49:33
 * @Description: 文章、图片发布缓存，避免文章、图片重复发布
 * @FilePath: \push-markdown\packages\renderer\src\mdPublish\PublishCache.ts
 */

'use strict';

import { store } from '#preload';
import { getFilenamify } from '../utils/tools';

/**
 * 缓存基类
 */
export class Cache {
  storeKey: string;
  constructor(type: string, siteUrl: string, username: string) {
    const uid = getFilenamify(siteUrl, username);
    this.storeKey = `${uid}.${type}`;
  }

  put(object: string | undefined | null, data: string) {
    if (object && data) {
      const key = this.key(object);
      store.storeSettingsSet(key, data);
      return true;
    }
    return false;
  }

  get(object: string): string | null {
    if (object) {
      const key = this.key(object);
      return store.storeSettingsGet(key);
    }
    return null;
  }

  key(object: string) {
    return `${this.storeKey}.${object}`;
  }
}
