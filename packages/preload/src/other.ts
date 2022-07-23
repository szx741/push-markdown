/*
 * @Author: szx
 * @Date: 2022-07-23 20:24:09
 * @LastEditTime: 2022-07-23 20:48:21
 * @Description:
 * @FilePath: \push-markdown\packages\preload\src\other.ts
 */
import http from 'http';
import md5File from 'md5-file';
import MetaWeblog from 'metaweblog-api';
import { shell } from 'electron';
export const other = {
  md5(file: any) {
    return md5File.sync(file);
  },
  async checkUrlValid(url: string) {
    return true;
  },
  metaWeblog(url: string) {
    return new MetaWeblog(url);
  },
  shell: shell
};
