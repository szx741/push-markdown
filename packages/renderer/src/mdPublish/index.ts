/*
 * @Author: szx
 * @Date: 2021-07-11 18:03:08
 * @LastEditTime: 2022-07-30 15:35:56
 * @Description:文章发布工具。根据type调用不同的实现。目前支持MetaWeblog。
 * @FilePath: \push-markdown\packages\renderer\src\mdPublish\index.ts
 */
'use strict';
/*
 * @Author: szx
 * @Date: 2021-08-27 17:11:08
 * @LastEditTime: 2022-07-30 15:32:56
 * @Description: 基于MetaWeblog接口的博客发布器，支持WordPress等博客
 * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.newPost
 * http://xmlrpc.scripting.com/metaWeblogApi.html
 * https://github.com/uhavemyword/metaweblog-api
 * @FilePath: \push-markdown\packages\renderer\src\mdPublish\MetaPublisher.ts
 */
'use strict';

import MetaWeblog from 'metaweblog-api';

import { FileCache, PostCache } from './PublishCache';
import { nodePath, nodeFs, other, ipc } from '#preload';
import { Post } from '../mdRenderer/markdown-text-to-html';
import { promiseConcurrencyLimit } from '../logic/utils';
import { show } from '../logic/statusBar';

export enum PublishMode {
  Manual = 'manual',
  Auto = 'auto',
  Create = 'create'
}
export enum PublishState {
  STATE_RENDER = 'render',
  STATE_READ_POST = 'read',
  STATE_UPLOAD_MEDIA = 'upload',
  STATE_PUBLISH_POST = 'publish',
  STATE_EDIT_POST = 'edit',
  STATE_COMPLETE = 'complete'
}

export interface PublishParams {
  post: Post;
  blogID: number;
  stateHandler: (state: PublishState) => void;
  publishMode: PublishMode;
  mediaMode: 'force' | 'cache';
  getNetPic: boolean;
  notCheck: boolean;
  editHandler: any;
}

const MEDIA_MIME_TYPES: any = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jpe: 'image/jpeg',
  gif: 'image/gif',
  png: 'image/png',
  bmp: 'image/bmp',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  ico: 'image/x-icon',
  webp: 'image/webp'
};

/**
 * 基于MetaWeblog接口的博客发布器
 */
export class MetaPublisher {
  metaWeblog: MetaWeblog;
  blogId: string;
  username: string;
  password: string;
  postCache: PostCache;
  mediaCache: FileCache;
  siteUrl: string;
  constructor(siteUrl: string, username: string, password: string) {
    this.metaWeblog = other.metaWeblog(siteUrl);
    this.siteUrl = siteUrl;
    this.blogId = '';
    this.username = username;
    this.password = password;
    this.postCache = new PostCache(siteUrl, username);
    this.mediaCache = new FileCache(siteUrl, username);
  }

  async publish({ post, blogID, stateHandler, publishMode, mediaMode, getNetPic, notCheck, editHandler }: PublishParams): Promise<boolean> {
    // 显示正在Render
    stateHandler(PublishState.STATE_RENDER);
    const map = new Map<string, string>();
    let oldPost = null;
    switch (publishMode) {
      // 自动模式
      case PublishMode.Auto:
        oldPost = await this.getOldPost(post, 0);
        break;

      // 手动模式
      case PublishMode.Manual:
        const _oldPost = await this.getOldPost(post, blogID);
        // 如果旧文章有，并且获取网络图片选上了，那么图片链接就换到网络图片
        if (_oldPost && getNetPic == true) {
          this.getNetworkImage(_oldPost, map);
          console.log('获取到的所有图片', map);
        }
        if (editHandler(_oldPost)) {
          oldPost = _oldPost;
        }
        break;

      case PublishMode.Create:
        break;
    }

    if (oldPost) {
      stateHandler(PublishState.STATE_EDIT_POST);
      await this.editPost(oldPost, post);
    } else {
      stateHandler(PublishState.STATE_PUBLISH_POST);
      await this.newPost(post);
    }

    // 显示正在处理上传的图片
    stateHandler(PublishState.STATE_UPLOAD_MEDIA);

    const div = document.createElement('div');
    div.innerHTML = post.html;

    // 一次并行传五张图，不能一次性全部发过去，可能会受到服务器的限制
    const handleImage = async (img: HTMLImageElement) => {
      const src = img.getAttribute('src');
      if (src) {
        if (src.startsWith('atom://')) {
          const file = decodeURI(src.substr('atom://'.length));
          if (nodeFs.fsExistsSync(file)) {
            let url;
            if (getNetPic && map.size > 0) {
              url = await this.changeLocalMedia(file, map);
            } else {
              url = await this.uploadMedia(file, mediaMode, notCheck);
            }
            if (url) {
              img.setAttribute('src', url);
              img.parentElement?.setAttribute('href', url);
            } else {
              console.error('media process failure', file);
            }
          } else {
            console.error('错误，本地不存在这张图片！', file);
          }
        } else {
          const pImg = img.parentElement;
          pImg?.setAttribute('href', src);
          pImg?.setAttribute('align', 'center');
          pImg?.classList.add('fancybox-wrapper', 'lazyload-container-unload');
          pImg?.setAttribute('data-fancybox', 'post-images');
        }
      }
    };
    promiseConcurrencyLimit(5, Array.from(div.getElementsByTagName('img')), handleImage);

    stateHandler(PublishState.STATE_COMPLETE);
    return true;
  }

  async getOldPost(post: Post, blogID: number) {
    // 1、手动更新指定文章的ID，必须大于0
    if (blogID > 0) {
      console.log('手动更新指定文章ID');
      const oldPost = await this.metaWeblog.getPost(blogID.toString(), this.username, this.password).catch(() => null);
      if (oldPost && oldPost.postid == blogID.toString()) {
        return this.toPost(oldPost);
      }
    }
    // 2、否则，从本地缓存查找之前的ID
    const oldPostId = await this.postCache.get(post);
    console.log('getOldPost', oldPostId);
    if (oldPostId) {
      // console.log('metaweblog old post id', oldPostId);
      const oldPost = await this.metaWeblog.getPost(oldPostId, this.username, this.password).catch(() => null);
      // console.log('metaweblog old post', oldPost);
      // noinspection EqualityComparisonWithCoercionJS
      if (oldPost && oldPost.postid == oldPostId) {
        return this.toPost(oldPost);
      }
      console.log('本地与网络不一致');
      console.log('本地缓存的postID', oldPostId);
      console.log('网络获取的文章', oldPost);
    }
    // 3、如果在本地缓存也找不到的话，说明第一次用这个软件，那么就从博客获取所有的文章匹配相同的标题
    if (blogID == 0) {
      const arr = await this.metaWeblog.getRecentPosts('', this.username, this.password, 1000);
      for (const a of arr) {
        if (a.title == post.title && a.postid) {
          console.log('本地可能没有缓存，因此去查找wordpress上的所有博客，匹配到相同的标题即为同一篇');
          const oldPost = await this.metaWeblog.getPost(a.postid, this.username, this.password).catch(() => null);
          return this.toPost(oldPost);
        }
      }
    }
    return null;
  }

  async newPost(post: any) {
    const _post = this.toMetaWeblogPost(post);
    const id = await this.metaWeblog.newPost(this.blogId, this.username, this.password, _post, true);
    console.log('newpost this.blogId:', id);

    await this.postCache.put(post, id);
    return id;
  }

  async editPost(oldPost: any, post: any) {
    const _post = this.toMetaWeblogPost(post);
    const id = oldPost.id;
    await this.metaWeblog.editPost(id.toString(), this.username, this.password, _post, true); // return true
    await this.postCache.put(post, id);
    return id;
  }

  // noinspection JSMethodCanBeStatic
  toPost(mateWeblogPost: any) {
    return {
      id: mateWeblogPost.postid,
      title: mateWeblogPost.title,
      html: mateWeblogPost.description
    };
  }

  // noinspection JSMethodCanBeStatic
  toMetaWeblogPost(post: any) {
    // await this.checkCategoryExists(post)
    if (post.tags) {
      post.tags = post.tags.toString();
    }
    return {
      title: post.title,
      description: post.html,
      post_type: 'post',
      dateCreated: post.date,
      categories: post.categories,
      mt_keywords: post.tags,
      mt_excerpt: post.abstract,
      wp_slug: post.url,
      post_status: 'publish'
    };
  }

  async checkCategoryExists(post: any) {
    if (post.categories && post.categories.length > 0) {
      const oldCats = await this.metaWeblog.getCategories(this.blogId, this.username, this.password);
      for (let i = 0; i < post.categories; i++) {
        const catName = post.categories[i];
        if (oldCats.findIndex((cat: any) => cat.description === catName) === -1) {
          return false;
        }
      }
    }
    return true;
  }

  // 获取远程图片
  async getNetworkImage(_oldPost: any, map: Map<string, string>) {
    const reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
    let tem;
    const url = new URL(this.siteUrl);
    while ((tem = reg.exec(_oldPost.html))) {
      if (tem[2].indexOf(url.hostname) != -1) {
        const imgName = tem[2].substring(tem[2].lastIndexOf('/') + 1);
        map.set(imgName, tem[2]);
      }
    }
  }

  async changeLocalMedia(file: string, map: Map<string, string>) {
    const imgName = file.substring(file.lastIndexOf('\\') + 1);
    const url = map.get(imgName);
    if (url) {
      map.delete(imgName);
      await this.mediaCache.put(file, url);
      console.log(`本地缓存记录${file}，更新为远程图片的url：${url}`);
    }
    return url;
  }

  // 上传媒体文件
  async uploadMedia(file: any, mediaMode: any, notCheck: boolean) {
    // 上传模式为从cache中获取
    if (mediaMode === 'cache') {
      const url = await this.mediaCache.get(file);
      if (url) {
        if (notCheck) {
          console.log('本地有缓存记录，不检查网络图片，直接返回');
          return url;
        }
        if (await other.checkUrlValid(url)) {
          console.log('本地有缓存记录，且网络检测成功，将使用网络已有的图片');
          return url;
        } else {
          console.log('本地有缓存记录，之前上传的url是：', url, '但是网络图片检测失败，将采取强制更新图片的措施');
        }
      } else {
        console.log('无本地缓存记录，将更新图片（强制）');
      }
    }
    const bits = nodeFs.fsReadFileSync(file);
    let isByte = false;
    if (this.siteUrl.indexOf('rpc.cnblogs.com') != -1) {
      isByte = true;
    }
    show(`上传图片${file}中`);
    const result = ipc.syncMsg('new-media-object', [isByte, this.blogId, this.username, this.password, nodePath.pathBasename(file), getMimeType(file), bits, this.siteUrl]);

    console.log('newMediaObject Result:', result);

    if (result[0] == true) {
      const url = result[1];
      await this.mediaCache.put(file, url);
      console.log(`media uploaded: ${file} ==> ${url}`);
      return url;
    } else {
      console.error(result[1]);
      return false;
    }
  }
}

function getMimeType(file: any) {
  let ext: string = nodePath.pathExtname(file);
  ext = (ext && ext.length > 1 && ext.substr(1)) || ''; // jpg
  const type = MEDIA_MIME_TYPES[ext];
  if (!type) {
    throw new Error(`[${file}]  media ext '${ext}' not supported`);
  }
  return type;
}

export const initMetaPublisher = (siteUrl: string, username: string, password: string) => {
  return new MetaPublisher(siteUrl, username, password);
};
