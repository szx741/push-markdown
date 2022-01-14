/*
 * @Author: szx
 * @Date: 2021-07-11 19:46:07
 * @LastEditTime: 2022-01-13 23:42:53
 * @Description: 博客发布基类，可以有多种实现
 * @FilePath: \push-markdown\src\logic\publisher\BasePublisher.ts
 */
'use strict';

import { Promise as _Promise } from 'bluebird';
import { JSDOM } from 'jsdom';
import * as renderer from '../renderer';
import * as publisher from './index';

/**
 * https://codex.wordpress.org/Function_Reference/get_allowed_mime_types
 */
export const MEDIA_MIME_TYPES: any = {
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

export function getMimeType(file: any) {
  let ext: string = window.api.pathExtname(file);
  ext = (ext && ext.length > 1 && ext.substr(1)) || ''; // jpg
  const type = MEDIA_MIME_TYPES[ext];
  if (!type) {
    throw new Error(`[${file}]  media ext '${ext}' not supported`);
  }
  return type;
}

// export function readFileBase64(file: string) {
//   try {
//     return window.api.fsReadFileSync(file, { encoding: 'base64' });
//   } catch (err) {
//     console.log(err);
//   }
// }

/**
 * 博客发布基类
 */
export class BasePublisher {
  /**
   * publish post
   *
   * @param post
   * @param stateHandler stateHandler will be called before the start of each stage.
   *                     arguments: publisher.STATE_XXX
   * @param publishMode 'manual' | 'create' | 'auto'
   * @param mediaMode 'create' | 'cache'
   * @param editHandler editHandler will be called when old post detected.
   *                    arguments: post.
   *                    return Promise<true>: edit old post.
   *                    return Promise<false>: create new post.
   * @return {Promise<boolean>} true: published, false: cancelled
   */
  async publish(post: any, blogID: number, stateHandler: any, publishMode: any, mediaMode: any, getNetPic: boolean, notCheck: boolean, editHandler: any) {
    const _stateHandler = stateHandler;
    stateHandler = (state: any) => {
      _stateHandler && _stateHandler(state);
    };

    stateHandler(publisher.STATE_RENDER);

    // render post in publish mode 渲染
    post = await renderer.render(post.src, post.file, false);
    stateHandler(publisher.STATE_READ_POST);
    const map = new Map<string, string>();
    let oldPost = null;
    switch (publishMode) {
      case 'auto':
        oldPost = await this.getOldPost(post, 0);
        break;

      // 手动模式
      case 'manual':
        if (editHandler) {
          // console.log('editHandler', editHandler);
          const _oldPost = await this.getOldPost(post, blogID);
          if (_oldPost && getNetPic == true) {
            this.getNetworkImage(_oldPost, map);
            console.log('获取到的所有图片', map);
          }
          if (await editHandler(_oldPost)) {
            // console.log('await editHandler(_oldPost)');
            oldPost = _oldPost;
          }
        }
        break;

      case 'create':
        break;
    }

    stateHandler(publisher.STATE_UPLOAD_MEDIA);

    const jsdom = new JSDOM();
    const div = jsdom.window.document.createElement('div');
    div.innerHTML = post.html;

    // 上传图片的逻辑代码
    await _Promise.map(
      Array.from(div.getElementsByTagName('img')),

      async (img) => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('atom://')) {
          const file = decodeURI(src.substr('atom://'.length));
          if (window.api.fsExistsSync(file)) {
            let url;
            if (getNetPic && map.size > 0) {
              url = await this.changeLocalMedia(file, map);
            } else {
              url = await this.uploadMedia(file, mediaMode, notCheck);
            }
            if (url) {
              img.setAttribute('src', url);
            } else {
              console.error('media process failure', file);
            }
          } else {
            console.error('错误，本地不存在这张图片！', file);
          }
        }
      },
      { concurrency: 5 }
    );
    post.html = div.innerHTML;
    // console.log(oldPost);
    if (oldPost) {
      stateHandler(publisher.STATE_EDIT_POST);
      await this.editPost(oldPost, post);
    } else {
      stateHandler(publisher.STATE_PUBLISH_POST);
      await this.newPost(post);
    }

    stateHandler(publisher.STATE_COMPLETE);
    return true;
  }

  /**
   * get old post by url
   * @param post post to publish
   */
  getOldPost(post: any, blogID: number): any { }

  /**
   * create new post & cache post info if necessary
   * @param post
   */
  newPost(post: any): any { }

  /**
   * edit post
   * @param oldPost
   * @param post
   */
  editPost(oldPost: any, post: any): any { }

  /**
   * upload media or reuse from cache
   * @param file
   * @param mediaMode
   * @return Promise<string> url
   */
  uploadMedia(file: any, mediaMode: any, notCheck: boolean): any { }

  getNetworkImage(_oldPost: string, map: Map<string, string>) { }

  changeLocalMedia(file: string, map: Map<string, string>) { }
}
