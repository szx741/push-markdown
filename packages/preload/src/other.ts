/*
 * @Author: szx
 * @Date: 2022-07-23 20:24:09
 * @LastEditTime: 2022-08-02 21:18:45
 * @Description:
 * @FilePath: \push-markdown\packages\preload\src\other.ts
 */
import { shell, clipboard } from 'electron';
import http from 'http';
import { parse, URL } from 'url';

// https://github.com/sindresorhus/is-url-superb/blob/main/index.js
function isUrl(str: string) {
  const trimmedStr = str.trim();
  if (trimmedStr.includes(' ')) return false;
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function urlExists(url: string) {
  return new Promise((resolve) => {
    if (!isUrl(url)) {
      resolve(false);
    }

    const options = {
      method: 'HEAD',
      host: parse(url).host,
      path: parse(url).pathname,
      port: 80
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === undefined) {
        resolve(false);
      } else {
        resolve(res.statusCode < 400 || res.statusCode >= 500);
      }
    });
    req.end();
  });
}
export const other = {
  async checkUrlValid(url: string) {
    return await urlExists(url);
  },
  shell: shell,
  readFromClipboard() {
    return clipboard.readText();
  },
  versions: process.versions
};
