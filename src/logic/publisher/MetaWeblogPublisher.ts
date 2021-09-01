/*
 * @Author: szx
 * @Date: 2021-08-27 17:11:08
 * @LastEditTime: 2021-09-01 17:28:12
 * @Description: 基于MetaWeblog接口的博客发布器，支持WordPress等博客
 * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.newPost
 * http://xmlrpc.scripting.com/metaWeblogApi.html
 * https://github.com/uhavemyword/metaweblog-api
 * @FilePath: \push-markdown\src\logic\publisher\MetaWeblogPublisher.ts
 */
'use strict';

import MetaWeblog from 'metaweblog-api';

import { FileCache, PostCache } from './PublishCache';
import { getMimeType, BasePublisher, readFileBase64 } from './BasePublisher';

/**
 * 基于MetaWeblog接口的博客发布器
 */
export class MetaWeblogPublisher extends BasePublisher {
  metaWeblog: MetaWeblog;
  blogId: string;
  username: string;
  password: string;
  postCache: PostCache;
  mediaCache: any;
  constructor(url: any, username: any, password: any) {
    super();
    this.metaWeblog = window.api.metaWeblog(url);
    this.blogId = '';
    this.username = username;
    this.password = password;
    this.postCache = new PostCache(url, username);
    this.mediaCache = new FileCache(url, username);
  }

  async getOldPost(post: any, blogID: number) {
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
      console.log('metaweblog old post id', oldPostId);
      const oldPost = await this.metaWeblog.getPost(oldPostId, this.username, this.password).catch(() => null);
      console.log('metaweblog old post', oldPost);
      // noinspection EqualityComparisonWithCoercionJS
      if (oldPost && oldPost.postid == oldPostId) {
        return this.toPost(oldPost);
      }
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
    const _post = await this.toMetaWeblogPost(post);
    const id = await this.metaWeblog.newPost(this.blogId, this.username, this.password, _post, true);
    console.log('newpost this.blogId:', id);

    await this.postCache.put(post, id);
    return id;
  }

  async editPost(oldPost: any, post: any) {
    const _post = await this.toMetaWeblogPost(post);
    const id = oldPost.id;
    await this.metaWeblog.editPost(id, this.username, this.password, _post, true); // return true
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
  async toMetaWeblogPost(post: any) {
    // await this.checkCategoryExists(post)
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

  // 上传媒体文件
  async uploadMedia(file: any, mediaMode: any) {
    // 上传模式为从cache中获取
    if (mediaMode === 'cache') {
      const url = await this.mediaCache.get(file);
      if (url && (await window.api.checkUrlValid(url))) {
        console.log(`use cached media: ${file} ==> ${url}`);
        return url;
      }
    }
    const bits = readFileBase64(file);
    const mediaObject = {
      name: window.api.pathBasename(file),
      type: getMimeType(file),
      bits: bits,
      overwrite: true
    };

    const result: any = await this.metaWeblog.newMediaObject(this.blogId, this.username, this.password, mediaObject);
    console.log('newMediaObject Result:', result);
    const { id, url, type } = result;
    await this.mediaCache.put(file, url);
    console.log(`media uploaded: ${file} ==> ${url}`);
    return url;
  }
}
