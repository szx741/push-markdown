/*
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2022-07-23 22:15:03
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
import App from '/@/App.vue';
import router from './router';
import store from '/@/store';
import i18n from '/@/common/language';
import outputErrorLog from '/@/logic/errorLog';
import './common/assets/style.scss';

const app = createApp(App);

// app.config.errorHandler = outputErrorLog;
app.use(router);
app.use(store);
app.use(i18n);
app.mount('#app');
