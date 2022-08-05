/*
 * @Author: szx
 * @Date: 2022-07-23 19:13:22
 * @LastEditTime: 2022-08-05 00:01:12
 * @Description:
 * @FilePath: \push-markdown\packages\preload\src\nodePath.ts
 */
import path from 'path';
export const nodePath = {
  pathBasename: path.basename,
  pathJoin: path.join,
  pathIsAbsolute: path.isAbsolute,
  pathDirname: path.dirname,
  pathExtname: path.extname,
  pathResolve: path.resolve
};
