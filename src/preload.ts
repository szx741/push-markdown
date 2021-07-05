/*
 * @Author: szx
 * @Date: 2021-07-04 19:54:12
 * @LastEditTime: 2021-07-05 21:55:00
 * @Description:
 * @FilePath: \push-markdown\src\preload.ts
 */

import log from 'electron-log';
import fs from 'fs-extra';

window.log = log.functions;

window.writeFileSync = function (errorLogPath: string, errorLog: Object) {
  fs.writeFileSync(errorLogPath, JSON.stringify(errorLog) + '\n', { flag: 'a' });
};
