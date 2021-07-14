/*
 * @Author: szx
 * @Date: 2021-07-11 19:46:07
 * @LastEditTime: 2021-07-13 21:37:49
 * @Description:
 * @FilePath: \push-markdown\src\logic\publisher\BasePublisher.ts
 */
/**
 * 博客发布基类，可以有多种实现
 *
 * Created by jzj on 2018/12/24.
 */
'use strict';

import { Promise as _Promise } from 'bluebird';
import request from 'request';
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
  ico: 'image/x-icon'
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

export function readFileBase64(file: string) {
  try {
    return window.api.fsReadFileSync(file, { encoding: 'base64' });
  } catch (err) {
    console.log(err);
  }
}

export function checkUrlValid(url: any) {
  return (
    url &&
    new Promise((resolve, reject) => {
      request.head(url, function (error: any, response: any, body: any) {
        resolve(!error && response && response.statusCode === 200);
      });
    })
  );
}

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
  async publish(post: any, stateHandler: any, publishMode: any, mediaMode: any, editHandler: any) {
    const _stateHandler = stateHandler;
    stateHandler = (state: any) => {
      _stateHandler && _stateHandler(state);
    };

    stateHandler(publisher.STATE_RENDER);

    // render post in publish mode
    post = await renderer.render(post.src, post.file, false);

    stateHandler(publisher.STATE_READ_POST);

    let oldPost = null;
    switch (publishMode) {
      case 'auto':
        oldPost = await this.getOldPost(post);
        break;

      case 'manual':
        if (editHandler) {
          const _oldPost = await this.getOldPost(post);
          if (await editHandler(_oldPost)) {
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

    await _Promise.map(
      Array.from(div.getElementsByTagName('img')),
      async (img) => {
        const src = img.getAttribute('src');
        console.log(src);

        if (src && src.startsWith('atom://')) {
          const file = decodeURI(src.substr('atom://'.length));
          if (window.api.fsExistsSync(file)) {
            console.log('存在');
            const url: any = await this.uploadMedia(file, mediaMode);
            if (url) {
              img.setAttribute('src', url);
            } else {
              console.error('media process failure', file);
            }
          } else {
            console.error('media not exists', file);
          }
        }
      },
      { concurrency: 5 }
    );
    post.html = div.innerHTML;

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
  getOldPost(post: any): any {}

  /**
   * create new post & cache post info if necessary
   * @param post
   */
  newPost(post: any): any {}

  /**
   * edit post
   * @param oldPost
   * @param post
   */
  editPost(oldPost: any, post: any): any {}

  /**
   * upload media or reuse from cache
   * @param file
   * @param mediaMode
   * @return Promise<string> url
   */
  uploadMedia(file: any, mediaMode: any): any {}
}
