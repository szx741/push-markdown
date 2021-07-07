/*
 * @Author: szx
 * @Date: 2021-07-07 16:45:28
 * @LastEditTime: 2021-07-07 17:22:38
 * @Description:
 * @FilePath: \push-markdown\src\logic\statusBar.ts
 */
/**
 * 状态栏信息显示
 *
 * Created by jzj on 2018/12/16.
 */
'use strict';

let _text: any = undefined;
let _callback: any = undefined;
let _timeout: any = undefined;

function set(text: any) {
  _text = text;
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
