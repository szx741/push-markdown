/*
 * @Author: szx
 * @Date: 2022-07-23 13:23:48
 * @LastEditTime: 2022-08-03 21:36:58
 * @Description:
 * @FilePath: \push-markdown\.nano-staged.mjs
 */
import {resolve, sep} from 'path';

export default {
  '*.{js,ts,vue}': 'eslint --cache --fix',

  /**
   * Run typechecking if any type-sensitive files was staged
   * @param {string[]} filenames
   * @return {string[]}
   */
  'packages/**/{*.ts,*.vue,tsconfig.json}': ({filenames}) => {
    const pathToPackages = resolve(process.cwd(), 'packages') + sep;
    return Array.from(
      filenames.reduce((set, filename) => {
        const pack = filename.replace(pathToPackages, '').split(sep)[0];
        set.add(`pnpm run typecheck:${pack} --if-present`);
        return set;
      }, new Set),
    );
  },
};
