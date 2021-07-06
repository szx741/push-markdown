/*
 * @Author: szx
 * @Date: 2021-07-04 17:24:11
 * @LastEditTime: 2021-07-06 21:53:57
 * @Description: language文件夹下的index.js zh, en分别为三种语言文件
 * @FilePath: \push-markdown\src\common\lib\language\index.ts
 */
import { createI18n } from 'vue-i18n';
import zh from './zh';
import en from './en';

const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'zh',
  globalInjection: true,
  locale: localStorage.getItem('language') || 'zh',
  messages: {
    zh: zh,
    en: en
  }
});

export default i18n;
