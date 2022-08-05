/*
 * @Author: szx
 * @Date: 2022-08-02 17:42:16
 * @LastEditTime: 2022-08-05 00:00:47
 * @Description:
 * @FilePath: \push-markdown\packages\preload\src\blog-api.ts
 */
import MetaWeblog from 'metaweblog-api';
import fs from 'fs';
import path from 'path';

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

export const blogApi = {
  initBlogApi(siteUrl: string) {
    return new MetaWeblog(siteUrl);
  },
  newPost(metaWeblog: MetaWeblog, username: string, password: string, post: any) {
    return metaWeblog.newPost('', username, password, post, true);
  },
  editPost(metaWeblog: MetaWeblog, postid: string, username: string, password: string, post: any) {
    return metaWeblog.editPost(postid, username, password, post, true); // return true
  },
  getPost(metaWeblog: MetaWeblog, postid: string, username: string, password: string) {
    return metaWeblog.getPost(postid, username, password);
  },
  newMediaObject(metaWeblog: MetaWeblog, username: string, password: string, imgName: string, filePath: string): any {
    const bits = Buffer.from(fs.readFileSync(filePath));
    const mediaObject: any = {
      name: imgName,
      type: getMimeType(filePath),
      bits,
      overwrite: true
    };
    return metaWeblog.newMediaObject('', username, password, mediaObject);
  }
};

function getMimeType(filePath: string) {
  let ext = path.extname(filePath);
  ext = (ext && ext.length > 1 && ext.substring(1)) || ''; // jpg
  const type = MEDIA_MIME_TYPES[ext];
  if (!type) throw new Error(`${ext} 此媒体后缀不支持`);
  return type;
}

