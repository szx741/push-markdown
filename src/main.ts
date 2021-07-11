/*
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2021-07-11 12:39:20
 * @Description:
 * @FilePath: \push-markdown\src\main.ts
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
import router from './router';
import i18n from './common/lib/language/index';
import outputErrorLog from '@/util/errorLog';
import './common/assets/style.scss';

const app = createApp(App);

app.config.errorHandler = outputErrorLog;
app.use(router);
app.use(i18n);
app.mount('#app');
