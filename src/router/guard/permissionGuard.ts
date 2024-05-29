import type { Router, RouteRecordRaw } from 'vue-router';
import { usePermissionStoreWithOut } from '/@/store/modules/permission';
import { PageEnum } from '/@/enums/pageEnum';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { RootRoute } from '/@/router/routes';
import { ScreenRouteList } from '@/constant/constant';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const ROOT_PATH = RootRoute.path;

// 白名单路由，需要直接打开的路由地址，需要在此配置白名单路由地址
const whitePathList: string[] = [LOGIN_PATH, ...ScreenRouteList];

export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  const permissionStore = usePermissionStoreWithOut();
  router.beforeEach(async (to, from, next) => {
    if (
      from.path === ROOT_PATH &&
      to.path === PageEnum.BASE_HOME &&
      userStore.getUserInfo.homePath &&
      userStore.getUserInfo.homePath !== PageEnum.BASE_HOME
    ) {
      next(userStore.getUserInfo.homePath);
      return;
    }

    const token = userStore.getToken;

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as string)) {
      if (to.path === LOGIN_PATH && token) {
        const isSessionTimeout = userStore.getSessionTimeout;
        try {
          await userStore.afterLoginAction();
          if (!isSessionTimeout) {
            const redirect = to.query?.redirect as string;
            if (redirect) {
              next(redirect);
            } else {
              next();
            }
            return;
          }
        } catch {
          //
        }
      }
      next();
      return;
    }
    // token or user does not exist
    if (!token) {
      // You can access without permission. You need to set the routing meta.ignoreAuth to true
      if (to.meta.ignoreAuth) {
        next();
        return;
      }

      // redirect login page
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    // Jump to the 404 page after processing the login
    if (
      from.path === LOGIN_PATH &&
      to.name === PAGE_NOT_FOUND_ROUTE.name &&
      to.fullPath !== (userStore.getUserInfo.homePath || PageEnum.BASE_HOME)
    ) {
      next(userStore.getUserInfo.homePath || PageEnum.BASE_HOME);
      return;
    }

    // get userinfo while last fetch time is empty
    if (userStore.getLastUpdateTime === 0) {
      try {
        await userStore.getUserInfoAction();
      } catch (err) {
        next();
        return;
      }
    }

    if (permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    const routes = await permissionStore.buildRoutesAction();

    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });

    router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);

    permissionStore.setDynamicAddedRoute(true);

    const routeList = router.getRoutes();
    const findRoute = routeList.find((item) => item.path == to.fullPath);
    const routeName = findRoute?.name;
    const rlist = [];
    if (to.name != routeName && rlist.includes(to.fullPath)) {
      next({ path: to.fullPath, replace: true, query: {}, name: routeName });
    } else if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
      next({ path: to.fullPath, replace: true, query: to.query });
    } else {
      const redirectPath = (from.query.redirect || to.path) as string;
      const redirect = decodeURIComponent(redirectPath);
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
      next(nextData);
    }
  });
}
