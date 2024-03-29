/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2022-07-30 16:05:48
 * @Description: 状态栏信息显示
 * @FilePath: \push-markdown\packages\renderer\src\logic\statusBar.ts
 */
'use strict';

let _callback: any = undefined;
let _timeout: any = undefined;

function set(text: any) {
  _callback && _callback(text);
}

export function show(text: any, duration = 2000) {
  if (_timeout) {
    clearTimeout(_timeout);
    _timeout = undefined;
  }
  set(text);
  if (duration > 0) {
    _timeout = setTimeout(() => {
      _timeout = undefined;
      set(undefined);
    }, duration);
  }
}

export function setCallback(callback: any) {
  _callback = callback;
}
