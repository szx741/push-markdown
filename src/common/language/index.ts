// language文件夹下的index.js
// zh, en, id 分别为三种语言文件
import { createI18n } from 'vue-i18n';
import zh from './zh';
import en from './en';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem('language') || 'zh',
  messages: {
    'zh': zh,
    'en': en
  }
});

export default i18n;
