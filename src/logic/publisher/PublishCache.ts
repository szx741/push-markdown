/*
 * @Author: szx
 * @Date: 2021-07-11 18:03:08
 * @LastEditTime: 2022-01-13 23:53:53
 * @Description: 文章、图片发布缓存，避免文章、图片重复发布
 * @FilePath: \push-markdown\src\logic\publisher\PublishCache.ts
 */

'use strict';

import filenamifyUrl from 'filenamify-url';

/**
 * 缓存基类
 */
class Cache {
  storeName!: string;
  constructor(type: any, url: any, user: any) {
    this.storeName = ['cache', type, filenamifyUrl(url), filenamifyUrl(user)].join('-').toString();

    console.log('this.store.path:', window.api.newStore({ name: this.storeName }));
  }

  async put(object: any, data: any) {
    if (object && data) {
      const key = this.key(object);
      if (key) {
        // console.log('put:', key);
        window.api.storeSet(this.storeName, key, data);
        return true;
      }
    }
    return false;
  }

  async get(object: any) {
    if (object) {
      const key = this.key(object);
      // console.log(key);
      if (key) {
        console.log(this.storeName, key, window.api.storeGet(this.storeName, key));
        return window.api.storeGet(this.storeName, key);
      }
    }
    return null;
  }

  key(object: any) {
    return object || null;
  }
}

/**
 * 文章缓存，避免文章重复创建（已有文章直接编辑）。根据post.url区分。
 */
export class PostCache extends Cache {
  constructor(url: any, user: any) {
    super('post', url, user);
  }

  async put(post: any, data: any) {
    return super.put(post, data);
  }

  async get(post: any) {
    return super.get(post);
  }

  key(post: any) {
    return (post && post.url) || null;
  }
}

/**
 * 图片缓存，避免重复上传。根据文件哈希值区分。
 */
export class FileCache extends Cache {
  constructor(url: any, user: any) {
    super('media', url, user);
  }

  async put(file: any, data: any) {
    return super.put(file, data);
  }

  async get(file: any) {
    return super.get(file);
  }

  key(file: any) {
    return window.api.md5(file);
  }
}
