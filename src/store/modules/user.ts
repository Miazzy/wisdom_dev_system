import type { UserInfo, User } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { ThemeEnum } from '/@/enums/appEnum';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import {
  ROLES_KEY,
  TOKEN_KEY,
  THEME_KEY,
  USER_INFO_KEY,
  REFRESH_TOKEN_KEY,
  MENU_LIST_KEY,
  MENU_NAME_MAP_KEY,
  CURRENT_PATH_KEY,
  APP_DARK_MODE_KEY,
  ORGAN_TREE_KEY,
  SYSTEM_MULTI_ORGANIZATION_KEY,
  HAS_MASK_KEY,
  SUN_SET_CREATE_FLAG,
} from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi, execRefreshToken } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage, SysMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { isArray } from '/@/utils/is';
import { h, nextTick } from 'vue';
import { TaskExecutor } from '/@/executor/taskExecutor';
import { OnceExecutor } from '/@/executor/onceExecutor';
import { createLocalForage } from '@/utils/cache';
import { MsgManager } from '/@/message/MsgManager';
import { darkMode } from '/@/settings/designSetting';
import { generateNameMap } from '/@/utils/route';
import { useThrottleFn } from '@vueuse/core';
import { initDictMapInfo } from '/@/utils/dict';
import { DICT_TYPE } from '@/utils/dict';
import * as FileApi from '@/api/infra/file';
import { getDownloadURL } from '@/utils/upload';
import * as ParameterApi from '@/api/system/parameter';
import { message } from '@/utils/tooltips';
import { EventManager } from '@/message/EventManager';

interface UserState {
  userInfo: Nullable<UserInfo>;
  multiOrganization: boolean;
  token?: string;
  rtoken?: string;
  roleList: RoleEnum[];
  menuList: [];
  menuNameMap?: Map<string, string>;
  sessionTimeout?: boolean;
  currentPath?: string;
  lastUpdateTime?: number;
  lastLogoutTime?: number;
  organTree?: string;
  theme?: string;
  hasMask?: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // multiOrganization info
    multiOrganization: false,
    // sunsetCreateFlag
    sunsetCreateFlag: true,
    // token
    token: undefined,
    // refresh token
    rtoken: undefined,
    // roleList
    roleList: [],
    // menuList
    menuList: [],
    // current path
    currentPath: '',
    // menuNameMap
    menuNameMap: new Map(),
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    // Last logout time
    lastLogoutTime: 0,
    // organ tree
    organTree: '',
    // theme
    theme: '',
    // hasMask
    hasMask: 0,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    isMultiOrganization(state): boolean {
      return state.multiOrganization || getAuthCache<boolean>(SYSTEM_MULTI_ORGANIZATION_KEY);
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getSunSetCreateFlag(state): string {
      return state.sunsetCreateFlag || getAuthCache<string>(SUN_SET_CREATE_FLAG);
    },
    getHasMask(state): any {
      return state.hasMask || getAuthCache<any>(HAS_MASK_KEY);
    },
    getTheme(state): string {
      return state.theme || getAuthCache<string>(THEME_KEY);
    },
    getOrganTree(state): any {
      const tree = state?.organTree || getAuthCache<string>(ORGAN_TREE_KEY);
      return JSON.parse(tree);
    },
    getRefreshToken(state): string {
      return state.rtoken || getAuthCache<string>(REFRESH_TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getMenuList(state) {
      return state.menuList.length > 0 ? state.menuList : [];
    },
    getCurrentPath(state) {
      if (state?.currentPath === '') {
        state.currentPath = getAuthCache<string>(CURRENT_PATH_KEY);
      }
      return state.currentPath;
    },
    getMenuNameMap(state) {
      if (state?.menuNameMap?.size === 0) {
        try {
          const list = getAuthCache<[string, string][]>(MENU_NAME_MAP_KEY);
          state.menuNameMap = deserializeMap(list);
          if (!list || list?.length == 0) {
            const mlist = getAuthCache(MENU_LIST_KEY) as never[];
            state.menuNameMap = generateNameMap(mlist, null);
            setAuthCache(MENU_NAME_MAP_KEY, serializeMap(state.menuNameMap));
          }
        } catch (error) {
          //
        }
      }
      return state?.menuNameMap;
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime as number;
    },
    getLastLogoutTime(state): number {
      return state.lastLogoutTime as number;
    },
  },
  actions: {
    getAccessToken() {
      return this.token;
    },
    setLastLogoutTime(time) {
      this.lastLogoutTime = time;
    },
    setToken(info: string | undefined) {
      this.token = info ? info : '';
      setAuthCache(TOKEN_KEY, info);
    },
    setHasMask(mask) {
      this.hasMask = mask;
      setAuthCache(HAS_MASK_KEY, mask);
    },
    setSunSetCreateFlag(info: boolean) {
      this.sunsetCreateFlag = info;
      setAuthCache(SUN_SET_CREATE_FLAG, info);
    },
    setTheme(theme: string | undefined) {
      this.theme = theme ? theme : ''; // for null or undefined value
      setAuthCache(THEME_KEY, theme);
    },
    setOgranTree(info: Object) {
      this.organTree = info ? JSON.stringify(info) : ''; // for null or undefined value
      setAuthCache(ORGAN_TREE_KEY, this.organTree);
    },
    setCurrentPath(key) {
      this.currentPath = key;
      setAuthCache(CURRENT_PATH_KEY, key);
    },
    async setMenuList(list: []) {
      this.menuList = list;
      await setAuthCache(MENU_LIST_KEY, list);
    },
    setMenuNameMap(map) {
      this.menuNameMap = map;
      setAuthCache(MENU_NAME_MAP_KEY, serializeMap(map));
    },
    setRefreshToken(info: string | undefined) {
      this.rtoken = info ? info : ''; // for null or undefined value
      setAuthCache(REFRESH_TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setMultiOrganization(flag: boolean) {
      setAuthCache(SYSTEM_MULTI_ORGANIZATION_KEY, flag);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { notification } = useMessage();
        const { goHome = true, ...loginParams } = params;
        // Login接口传入登录账户参数，获取用户登录返回结果
        const data = await loginApi(loginParams);
        if (data?.code === '-1') {
          notification.error({ message: '错误提示', description: data?.msg });
          SysMessage.getInstance().error(data?.msg);
          return null;
        }
        const { accessToken, refreshToken } = data || {};
        this.setToken(accessToken as string);
        this.setRefreshToken(refreshToken as string);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      const userInfo = await this.getUserInfoAction();
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        setTimeout(async () => {
          goHome && (await router.push(userInfo?.homePath || PageEnum.BASE_HOME));
          await nextTick();
          await nextTick();
          await nextTick();
          MsgManager.getInstance().sendMsg('iframe-tabs-refresh-all', {});
        }, 1000);
      }
      return userInfo as GetUserInfoModel;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      const { roles = [], user, menus = [] } = userInfo;
      const { id, avatar, name, realName } = user as User;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setMenuList(menus as []);
      userInfo.userId = id;
      userInfo.avatar = avatar;
      userInfo.username = name;
      userInfo.realName = realName;

      // TODO 不能在登录过程中同步查询 头像 及 是否多组织结构，可以在此处发生消息或者跳转到 /frame 页面的 mounted 函数中 执行
      // if (!avatar) {
      //   try {
      //     // 此处可能存在问题 获取多组织的代码需要在登录后，/frame 页面的 mounted 函数中获取
      //     // const multiOrganization = false; // await ParameterApi.getParameterByCode(DICT_TYPE.SYSTEM_MULTI_ORGANIZATION);
      //     // this.setMultiOrganization(multiOrganization);
      //     // const resp = await FileApi.getFiles({ bizId: id });
      //     // const path = getDownloadURL(resp[0].url);
      //     // userInfo.avatar = path;
      //   } catch (error) {
      //     //
      //   }
      // }
      this.setUserInfo(userInfo as UserInfo);
      return userInfo as UserInfo;
    },
    /**
     * @description: logout
     */
    async clearUserInfo() {
      handleClearUserInfo(this as any);
    },
    /**
     * @description: logout
     */
    async logout(force: boolean = false) {
      handleLogout(this as any, force);
    },
    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout();
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}

// 序列化 Map 到数组
export function serializeMap(map: Map<string, string>): [string, string][] {
  return Array.from(map.entries());
}

// 反序列化数组到 Map
export function deserializeMap(arr: [string, string][]): Map<string, string> {
  return new Map(arr);
}

// 执行清空用户信息操作;
export const handleClearUserInfoFn = (that: any) => {
  try {
    const nowtime = new Date().getTime();
    that.getToken && doLogout();
    that.setToken(undefined);
    that.setSessionTimeout(false);
    that.setUserInfo(null);
    that.setLastLogoutTime(nowtime);
    createLocalForage().clear();
  } catch (error) {
    //
  }
};

// 执行跳转到登录页面函数
export const loginCallback = (nowtime) => {
  window.location.href = window.location.origin + '/#' + PageEnum.BASE_LOGIN + '?_t=' + nowtime;
};

// 处理退出登录操作
export const handleLogoutFn = async (that: any, force: boolean = false) => {
  const time = localStorage.getItem('LOGIN_TIMESTAMP');
  const lasttime = that.getLastLogoutTime;
  const nowtime = new Date().getTime();
  const flag = typeof time == 'undefined' || time == null || time == '';
  const timestamp = Number(time || 0);
  const diff = nowtime - timestamp;
  const difflast = nowtime - lasttime;

  // 步骤一 刚登录系统10秒内禁止退出登录操作
  if (difflast < 10000) {
    // 当 force 为 true 时，即强制退出的情况，不需要提示
    if (force == false) {
      diff > 7500 ? SysMessage.getInstance().error('您的操作太快，请稍后再尝试！') : null;
    }
    return;
  }
  if (!flag && diff < 10000) {
    // 当 force 为 true 时，即强制退出的情况，不需要提示
    if (force == false) {
      diff > 7500 ? SysMessage.getInstance().error('您的操作太快，请稍后再尝试！') : null;
    }
    return;
  }

  // 步骤二 发送退出登录请求
  let response = { code: -1, result: null, message: '' };

  try {
    response = force ? response : await doLogout();
  } catch {
    //
  }

  // 步骤三 清空线程，清空event监听，清空内存数据
  if ((response.code === 0 && response.result === true) || force) {
    // 开启退出登录锁，并提示退出登录消息
    SysMessage.logouting = true;
    MsgManager.getInstance().sendMsg('workbench-loadover', false); // 通知loadover的值为false
    message.loading('', '正在退出登录中...', 1000);

    // 清空所有Event的监听
    EventManager.getInstance().destory();

    // 清空内存数据
    setTimeout(() => {
      that.setToken(undefined);
      that.setSessionTimeout(false);
      that.setUserInfo(null);
      that.setLastLogoutTime(nowtime);
    }, 0);

    // 清空缓存数据
    setTimeout(() => {
      try {
        window.sessionStorage.clear(); // 清空sessionStorage和localStorage缓存
        const darkModeValue = window.localStorage.getItem(APP_DARK_MODE_KEY) || darkMode; // 退出登录不清本地深浅模式缓存
        const rememberInfo = window.localStorage.getItem('REMEMBER_ME_INFO') || '';
        window.localStorage.clear(); // 清空sessionStorage和localStorage缓存
        window.localStorage.setItem(APP_DARK_MODE_KEY, darkModeValue);
        window.localStorage.setItem('REMEMBER_ME_INFO', rememberInfo);
        createLocalForage().clear();
      } catch (error) {
        //
      }
    }, 100);

    // 步骤四 跳转到退出登录页面
    setTimeout(() => {
      loginCallback(nowtime);
    }, 750);

    setTimeout(() => {
      loginCallback(nowtime);
      // 关闭退出登录锁
      SysMessage.logouting = false;
    }, 1500);
  } else {
    SysMessage.getInstance().error(response?.message || '退出登录失败，请稍后尝试...');
  }
};

// 退出登录防抖操作
export const handleClearUserInfo = useThrottleFn(handleClearUserInfoFn, 3000);

// 退出登录防抖操作
export const handleLogout = useThrottleFn(handleLogoutFn, 3000);
