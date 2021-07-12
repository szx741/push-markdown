/*
 * @Author: szx
 * @Date: 2021-07-11 18:03:08
 * @LastEditTime: 2021-07-12 20:34:51
 * @Description:
 * @FilePath: \push-markdown\src\logic\publisher\PublishCache.ts
 */
/**
 * 文章、图片发布缓存，避免文章、图片重复发布
 *
 * Created by jzj on 2018/12/24.
 */
'use strict';

// import _filenamify from 'filenamify';
// const filenamify = (s: any) => window.api.filenamify(s, { replacement: '-' });
// const filenamify = window.api.filenamify;
const filenamify = (str: any) => {
  return str;
};
/**
 * 缓存基类
 */
class Cache {
  store: any;
  constructor(type: any, url: any, user: any) {
    console.log(['cache', type, url, user].join('-'));
    // this.store = window.api.newStore(['cache', type, url, user].join('-'));
    // this.store = new window.api.Store({ name: ['cache', type, filenamify(url), filenamify(user)].join('-') });
    console.log('cache path = ', window.api.storeCachePath);
  }

  async put(object: any, data: any) {
    if (object && data) {
      const key = await this.key(object);
      if (key) {
        // this.store.set(key, data);
        console.log('put:', key);
        window.api.storeCacheSet(key, data);
        return true;
      }
    }
    return false;
  }

  async get(object: any) {
    if (object) {
      const key = await this.key(object);
      console.log(key);
      if (key) {
        return window.api.storeCacheGet(key, null);
      }
    }
    return null;
  }

  async key(object: any) {
    return null;
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

  async key(post: any): Promise<any> {
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

  async key(file: any): Promise<any> {
    console.log(window.api.md5(file));
    return window.api.md5(file);
  }
}
