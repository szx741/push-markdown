/*
 * @Author: szx
 * @Date: 2022-07-23 13:19:05
 * @LastEditTime: 2022-07-23 17:41:09
 * @Description: 更新electron
 * @FilePath: \push-markdown\scripts\update-electron-vendors.js
 */
const { writeFileSync } = require('fs');
const path = require('path');

const electronRelease = process.versions;

const node = electronRelease.node.split('.')[0];
const chrome = electronRelease.v8.split('.').splice(0, 2).join('');

const browserslistrcPath = path.resolve(process.cwd(), '.browserslistrc');

writeFileSync('./.electron-vendors.cache.json', JSON.stringify({ chrome, node }));

writeFileSync(browserslistrcPath, `Chrome ${chrome}`, 'utf8');
