/*
 * @Author: szx
 * @Date: 2021-11-16 20:46:49
 * @LastEditTime: 2021-11-16 20:53:17
 * @Description:
 * @FilePath: \push-markdown\src\logic\showFile.ts
 */
'use strict';

export function getShowFile(): boolean {
  return window.api.storeShowFileGet('show-file', true);
}

export function saveShowFile(showfile: boolean) {
  return window.api.storeShowFileSet('show-file', showfile);
}
