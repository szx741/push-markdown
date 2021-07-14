/*
 * @Author: szx
 * @Date: 2021-07-04 13:56:18
 * @LastEditTime: 2021-07-14 16:04:21
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
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // component: () => import(/* webpackChunkName: "about" */ '@/components/Markdown.vue')
  }
];

// 不能用history模式，只能用hash模式，否则build就会空白
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
