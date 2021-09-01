/*
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2021-09-01 17:23:17
 * @Description:
 * @FilePath: \push-markdown\src\router\index.ts
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Main from '../components/Main.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Main',
    component: Main
  }
];

// 不能用history模式，只能用hash模式，否则build就会空白
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
