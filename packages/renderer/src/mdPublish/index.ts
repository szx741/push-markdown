/*
 * @Author: szx
 * @Date: 2021-07-11 18:03:08
 * @LastEditTime: 2022-08-06 19:13:06
 * @Description:文章发布工具。根据type调用不同的实现。目前支持MetaWeblog。
 * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.newPost
 * http://xmlrpc.scripting.com/metaWeblogApi.html
 * https://github.com/uhavemyword/metaweblog-api
 * @FilePath: \push-markdown\packages\renderer\src\mdPublish\index.ts
 */
'use strict';

import MetaWeblog from 'metaweblog-api';

import { nodePath, nodeFs, blogApi, other } from '#preload';
import { Cache } from './PublishCache';
import { Post } from '../mdRenderer/markdown-text-to-html';
import { promiseConcurrencyLimit } from '../utils/tools';
import { show } from '../utils/statusBar';
import { publishConf } from '../conf/publish-conf';
import { Detail } from '../conf/detail';

export enum PublishMode {
  Manual = 'manual',
  Auto = 'auto',
  Create = 'create'
}
export enum PublishState {
  STATE_READ_POST = 'read',
  STATE_UPLOAD_MEDIA = 'upload',
  STATE_PUBLISH_POST = 'publish',
  STATE_EDIT_POST = 'edit',
  STATE_COMPLETE = 'complete'
}

export interface PublishParams {
  post: Post;
  inputID: string;
  oldPostID: string;
  stateHandler: (state: PublishState) => void;
  publishMode: PublishMode;
  detail: Detail;
  editHandler: (post: MetaWeblog.Post) => false | Promise<unknown>;
}

/**
 * 基于MetaWeblog接口的博客发布器
 */
export class MetaPublisher {
  metaWeblog: MetaWeblog;
  username: string;
  password: string;
  siteUrl: string;
  postCache: Cache;
  mediaCache: Cache;
  constructor(siteUrl: string, username: string, password: string) {
    this.metaWeblog = blogApi.initBlogApi(siteUrl);
    this.siteUrl = siteUrl;
    this.username = username;
    this.password = password;
    this.postCache = new Cache('post', this.siteUrl, this.username);
    this.mediaCache = new Cache('media', this.siteUrl, this.username);
  }

  async publish({ post, inputID, oldPostID, stateHandler, publishMode, detail, editHandler }: PublishParams): Promise<boolean> {
    // 显示正在Render
    const mapImage = new Map<string, string>();
    let postID = oldPostID;
    if (publishMode === PublishMode.Manual) {
      if (parseInt(inputID) > 0) postID = inputID;
      stateHandler(PublishState.STATE_READ_POST);
      const oldPost = await blogApi.getPost(this.metaWeblog, postID, this.username, this.password);
      if (oldPost && (await editHandler(oldPost))) {
        // 如果旧文章有，并且获取网络图片选上了，那么图片链接就换到网络图片
        if (detail.getNetPic == true) this.getNetworkImage(oldPost, mapImage);
      }
    }

    // 显示正在处理上传的图片
    stateHandler(PublishState.STATE_UPLOAD_MEDIA);

    const div = document.createElement('div');
    if (publishConf.value.highlight) div.innerHTML = post.html;
    else div.innerHTML = post.upload;

    // 一次并行传五张图，不能一次性全部发过去，可能会受到服务器的限制
    const handleImage = async (img: HTMLImageElement) => {
      const src = img.getAttribute('src');
      if (src) {
        if (src.startsWith('atom://')) {
          const filePath = decodeURI(src.substring(7));
          const imgName = nodePath.pathBasename(filePath);
          if (nodeFs.fsExistsSync(filePath)) {
            let url;
            if (detail.getNetPic && mapImage.size > 0) {
              url = this.changeLocalMedia(imgName, mapImage);
            } else {
              url = await this.uploadMedia(filePath, imgName, detail.forcedUpdate, detail.notCheck, publishMode);
            }
            if (url) {
              img.setAttribute('src', url);
              img.parentElement?.setAttribute('href', url);
            } else {
              console.error('图片上传处理失败：', filePath);
            }
          } else {
            console.error('错误，本地不存在这张图片！', filePath);
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
    await promiseConcurrencyLimit(5, Array.from(div.getElementsByTagName('img')), handleImage);
    // 处理完图片，把文章里面的img都换成网络链接
    post.upload = div.innerHTML;
    if (postID !== '-1') {
      stateHandler(PublishState.STATE_EDIT_POST);
      await this.editPost(postID, post, oldPostID);
    } else {
      stateHandler(PublishState.STATE_PUBLISH_POST);
      await this.newPost(post);
    }
    stateHandler(PublishState.STATE_COMPLETE);
    return true;
  }

  async newPost(post: Post) {
    const _post = toMetaWeblogPost(post);
    const id = await blogApi.newPost(this.metaWeblog, this.username, this.password, _post);
    console.log('newpost this.postId:', id);
    this.postCache.put(post.url, id.toString());
    return id;
  }

  async editPost(postId: string, post: Post, oldPostID: string) {
    const _post = toMetaWeblogPost(post);
    await blogApi.editPost(this.metaWeblog, postId, this.username, this.password, _post);
    if (postId != oldPostID) this.postCache.put(post.url, postId);
  }

  // 获取远程图片
  getNetworkImage(_oldPost: any, mapImage: Map<string, string>) {
    const reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
    let tem;
    const url = new URL(this.siteUrl);
    while ((tem = reg.exec(_oldPost.html))) {
      if (tem[2].indexOf(url.hostname) != -1) {
        const imgName = tem[2].substring(tem[2].lastIndexOf('/') + 1);
        mapImage.set(imgName, tem[2]);
      }
    }
  }

  changeLocalMedia(imgName: string, mapImage: Map<string, string>) {
    const imageUrl = mapImage.get(imgName);
    if (imageUrl) {
      mapImage.delete(imgName);
      this.mediaCache.put(imgName, imageUrl);
      console.log(`本地图片${imgName}，映射到远程图片的${imageUrl}`);
    }
    return imageUrl;
  }

  // 上传媒体文件
  async uploadMedia(filePath: string, imgName: string, forcedUpdate: boolean, notCheck: boolean, publishMode: PublishMode) {
    // 上传模式为从cache中获取
    if (publishMode === PublishMode.Auto || (publishMode === PublishMode.Manual && !forcedUpdate)) {
      const imgUrl = this.mediaCache.get(imgName);
      if (imgUrl) {
        if (notCheck) {
          console.log(`${imgName} 本地有缓存记录，不检查网络图片，直接返回`);
          return imgUrl;
        }
        if (await other.checkUrlValid(imgUrl)) {
          console.log(`${imgName}  本地有缓存记录，且网络检测成功，将使用网络已有的图片`);
          return imgUrl;
        } else {
          console.log(`${imgName}  本地有缓存记录，之前上传的url是：', imgUrl, '，但是网络图片检测失败，将采取强制更新图片的措施`);
        }
      } else {
        console.log(`${imgName} 无本地缓存记录，将更新图片（强制替换博客的同名图片）`);
      }
    }
    try {
      const result = await blogApi.newMediaObject(this.metaWeblog, this.username, this.password, imgName, filePath);
      const resUrl: string = result.url;
      if (resUrl) {
        this.mediaCache.put(imgName, resUrl);
        show(`图片${imgName}上传成功，地址：${resUrl}`);
        return resUrl;
      }
      return;
    } catch (err) {
      console.error('图片上传失败，错误：', err);
      return;
    }
  }
}

function toMetaWeblogPost(post: Post) {
  return {
    title: post.title,
    description: post.upload,
    post_type: 'post',
    dateCreated: post.date,
    categories: post.categories,
    mt_keywords: post.tags?.toString(),
    mt_excerpt: post.abstract,
    wp_slug: post.url,
    post_status: 'publish'
  };
}

export const initMetaPublisher = (siteUrl: string, username: string, password: string) => {
  return new MetaPublisher(siteUrl, username, password);
};
