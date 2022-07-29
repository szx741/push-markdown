/*
 * @Author: szx
 * @Date: 2021-07-11 18:03:08
 * @LastEditTime: 2022-07-29 19:21:13
 * @Description:文章发布工具。根据type调用不同的实现。目前支持MetaWeblog。
 * @FilePath: \push-markdown\packages\renderer\src\logic\publisher\index.ts
 */
'use strict';

import { MetaWeblogPublisher } from './MetaWeblogPublisher';
import { Post } from '../../mdRenderer/index';

export const publishState = {
  STATE_RENDER: 'render',
  STATE_READ_POST: 'read',
  STATE_UPLOAD_MEDIA: 'upload',
  STATE_PUBLISH_POST: 'publish',
  STATE_EDIT_POST: 'edit',
  STATE_COMPLETE: 'complete'
};
export const STATE_RENDER = 'render';
export const STATE_READ_POST = 'read';
export const STATE_UPLOAD_MEDIA = 'upload';
export const STATE_PUBLISH_POST = 'publish';
export const STATE_EDIT_POST = 'edit';
export const STATE_COMPLETE = 'complete';
export interface PublishParams {
  post: Post;
  blogID: number;
  stateHandler: any;
  publishMode: any;
  mediaMode: any;
  getNetPic: boolean;
  notCheck: boolean;
  editHandler: any;
}
export class Publisher {
  publisher: MetaWeblogPublisher;
  constructor(url: any, username: any, password: any, type: any) {
    switch (type) {
      case 'MetaWeblog':
      default:
        this.publisher = new MetaWeblogPublisher(url, username, password);
        break;
    }
  }

  // async publish(post: any, blogID: number, stateHandler: any, publishMode: any, mediaMode: any, getNetPic: boolean, notCheck: boolean, editHandler: any) {

  async publish({ post, blogID, stateHandler, publishMode, mediaMode, getNetPic, notCheck, editHandler }: PublishParams) {
    return this.publisher.publish(post, blogID, stateHandler, publishMode, mediaMode, getNetPic, notCheck, editHandler);
  }
}
