/*
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2022-07-28 21:41:54
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
import i18n from './common/i18n';
import outputErrorLog from '/@/logic/errorLog';
import './common/assets/style.scss';
const app = createApp(App);

app.config.errorHandler = outputErrorLog;
app.use(i18n);
app.mount('#app');
