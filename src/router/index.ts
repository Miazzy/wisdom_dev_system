import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';
import { unref } from 'vue';
import { createRouter, createWebHashHistory, useRouter } from 'vue-router';
import { basicRoutes } from './routes';

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = [];

const getRouteNames = (array: any[]) =>
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name);
    getRouteNames(item.children || []);
  });
getRouteNames(basicRoutes);

// app router
// 创建一个可以被 Vue 应用程序使用的路由实例
export const router = createRouter({
  // 创建一个 hash 历史记录。
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  // 应该添加到路由的初始路由列表。
  routes: basicRoutes as unknown as RouteRecordRaw[],
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

// config router
// 配置路由器
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export class Memory {
  private static instance: Memory;
  public keyMap: Map<string, any> | null;
  public url: string;
  public path: string;
  public params: any;
  public query: any;

  constructor() {
    this.url = '';
    this.path = '';
    this.params = {};
    this.query = {};
    this.keyMap = new Map<string, any>();
  }

  static getInstance() {
    if (!Memory.instance) {
      const instance = new Memory();
      Memory.instance = instance;
    }
    return Memory.instance;
  }

  getParams() {
    return this.getQuery();
  }

  getQuery() {
    const router = useRouter();
    const { currentRoute } = router;
    if (window.location.hash == '#/frame') {
      const query = JSON.parse(JSON.stringify(this.params));
      return query;
    } else {
      const query = unref(currentRoute).query;
      return query;
    }
  }
}
