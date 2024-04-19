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
} from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi, execRefreshToken } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage, SysMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { isArray } from '/@/utils/is';
import { initDictMapInfo } from '/@/utils/dict';
import { h, nextTick } from 'vue';
import { TaskExecutor } from '/@/executor/taskExecutor';
import { OnceExecutor } from '/@/executor/onceExecutor';
import { DICT_TYPE } from '@/utils/dict';
import { createLocalForage } from '@/utils/cache';
import { MsgManager } from '/@/message/MsgManager';
import { darkMode } from '/@/settings/designSetting';
import { generateNameMap } from '/@/utils/route';
import * as FileApi from '@/api/infra/file';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  rtoken?: string;
  roleList: RoleEnum[];
  menuList: [];
  menuNameMap?: Map<string, string>;
  sessionTimeout?: boolean;
  currentPath?: string;
  lastUpdateTime: number;
  organTree?: string;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
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
    // organ tree
    organTree: '',
    // theme
    theme: '',
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
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
      return state.lastUpdateTime;
    },
  },
  actions: {
    getAccessToken() {
      return this.token;
    },
    setToken(info: string | undefined) {
      this.token = info ? info : '';
      setAuthCache(TOKEN_KEY, info);
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
        const { goHome = true, ...loginParams } = params;
        const task = TaskExecutor.getInstance();
        const once = OnceExecutor.getInstance();
        // Login接口传入登录账户参数，获取用户登录返回结果
        const data = await loginApi(loginParams);
        const { accessToken, refreshToken } = data || {};
        this.setToken(accessToken as string);
        this.setRefreshToken(refreshToken as string);
        // 推入任务
        task.pushOnceTask(async () => {
          // const response = await execRefreshToken(this.getRefreshToken as string);
          // const { accessToken } = response || {};
          // this.setToken(accessToken as string);
        });
        // DICT_LOADING 登录时加载已知的数据字典 加载数据字典集合
        once.pushOnceTask(async () => {
          // const list = [
          //   DICT_TYPE.BPM_MODEL_CATEGORY,
          //   DICT_TYPE.SYSTEM_USER_SEX,
          //   DICT_TYPE.INFRA_CONFIG_TYPE,
          //   DICT_TYPE.CERTIFICATE,
          // ];
          // initDictMapInfo(list as []);
        });
        task.start();
        once.start();
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
      if (!avatar) {
        try {
          const resp = await FileApi.getFiles({ bizId: id, type: 'avatar' });
          const path = FileApi.attachmentDownloadUrl(resp[0].url);
          userInfo.avatar = path;
        } catch (error) {
          //
        }
      }
      this.setUserInfo(userInfo as UserInfo);
      return userInfo as UserInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      const time = localStorage.getItem('LOGIN_TIMESTAMP');
      const nowtime = new Date().getTime();
      const flag = typeof time == 'undefined' || time == null || time == '';
      const timestamp = Number(time);
      const diff = nowtime - timestamp;
      if (!flag) {
        if (diff < 10 * 1000) {
          diff > 5000 ? SysMessage.getInstance().error('您的操作太快，请稍后再尝试！') : null;
          return;
        }
      }
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          // console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      // 通知loadover的值为false
      MsgManager.getInstance().sendMsg('workbench-loadover', false);
      MsgManager.getInstance().sendMsg('logouting', true);
      setTimeout(() => {
        try {
          window.sessionStorage.clear(); // 清空sessionStorage和localStorage缓存
          // 退出登录不清本地深浅模式缓存
          const darkMode = window.localStorage.getItem(APP_DARK_MODE_KEY) || darkMode;
          const rememberInfo = window.localStorage.getItem('REMEMBER_ME_INFO') || '';
          window.localStorage.clear(); // 清空sessionStorage和localStorage缓存
          window.localStorage.setItem(APP_DARK_MODE_KEY, darkMode);
          window.localStorage.setItem('REMEMBER_ME_INFO', rememberInfo);
        } catch (error) {
          //
        }
        try {
          const ls = createLocalForage();
          ls.clear();
        } catch (error) {
          //
        }
      }, 1000);
      setTimeout(() => {
        goLogin && router.push(PageEnum.BASE_LOGIN);
      }, 300);
      setTimeout(() => {
        MsgManager.getInstance().sendMsg('logouting', false);
      }, 3000);
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
          await this.logout(true);
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
