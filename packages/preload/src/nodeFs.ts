/*
 * @Author: szx
 * @Date: 2022-07-23 20:17:07
 * @LastEditTime: 2022-07-27 15:59:07
 * @Description:
 * @FilePath: \push-markdown\packages\preload\src\nodeFs.ts
 */
import fs from 'fs';
import path from 'path';
export const nodeFs = {
  fsReadFile: fs.readFile,
  fsReadFileSync(file: string) {
    try {
      return fs.readFileSync(file, { encoding: 'base64' });
    } catch {
      return false;
    }
  },
  bufReadFileSync(file: string) {
    try {
      const pic = fs.readFileSync(file, { encoding: 'base64' });
      // console.log(Buffer.from(pic, 'base64'));
      return Buffer.from(pic, 'base64');
    } catch {
      return false;
    }
  },
  fsWriteFile: fs.writeFile,
  fsWriteFileSync: fs.writeFileSync,
  fsExistsSync: fs.existsSync,
  fsReaddirSync: fs.readdirSync,
  fsStatSync: fs.statSync,
  fsLstatSync: fs.lstatSync,
  isFileOrDir(_path: string, file: string) {
    try {
      const stat = fs.lstatSync(path.join(_path, file));
      return stat.isDirectory();
    } catch (e) {
      return false;
    }
  },
  isDir(path: string) {
    try {
      const stat = fs.lstatSync(path);
      return stat.isDirectory();
    } catch (e) {
      // lstatSync throws an error if path doesn't exist
      return false;
    }
  },
  fsLstat: fs.lstat
};
