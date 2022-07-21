/*
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2022-07-21 22:59:33
 * @Description:
 * @FilePath: \push-markdown\src\router\index.ts
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import MainComponent from '../components/MainComponent.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Main',
    component: MainComponent
  }
];

// 不能用history模式，只能用hash模式，否则build就会空白
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
