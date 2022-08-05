/*
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2022-08-05 10:44:01
 * @Description:
 * @FilePath: \push-markdown\packages\renderer\src\index.ts
 */
/*
 * @                       .::::.
 * @                     .::::::::.
 * @                    :::::::::::
 * @                 ..:::::::::::'
 * @              '::::::::::::'
 * @                .::::::::::
 * @           '::::::::::::::..
 * @                ..::::::::::::.
 * @              ``::::::::::::::::
 * @               ::::``:::::::::'        .:::.
 * @              ::::'   ':::::'       .::::::::.
 * @            .::::'      ::::     .:::::::'::::.
 * @           .:::'       :::::  .:::::::::' ':::::.
 * @          .::'        :::::.:::::::::'      ':::::.
 * @         .::'         ::::::::::::::'         ``::::.
 * @     ...:::           ::::::::::::'              ``::.
 * @    ````':.          ':::::::::'                  ::::..
 * @                       '.:::::'                    ':'````..
 */
import { createApp } from 'vue';
import App from './App.vue';
// import i18n from './common/locale';
// import outputErrorLog from './utils/errorLog';
// import './common/assets/style.scss';
// import './common/assets/highlight-github.css';
// import './common/assets/highlight-github-dark.css';
// import './common/assets/github-markdown.css';
const app = createApp(App);

// app.config.errorHandler = outputErrorLog;
// app.use(i18n);
app.mount('#app');
