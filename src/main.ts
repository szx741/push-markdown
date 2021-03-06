/*
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2021-09-01 17:24:56
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
import store from './store';
import i18n from './common/lib/language/index';
import outputErrorLog from '@/logic/errorLog';
import './common/assets/style.scss';

const app = createApp(App);

app.config.errorHandler = outputErrorLog;
app.use(router);
app.use(store);
app.use(i18n);
app.mount('#app');
