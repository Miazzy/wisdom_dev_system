import { defHttp } from '/@/utils/http/axios';

export interface MenuVO {
  id: number;
  name: string;
  permission: string;
  type: number;
  sort: number;
  parentId: number;
  path: string;
  icon: string;
  component: string;
  componentName?: string;
  status: number;
  visible: boolean;
  keepAlive: boolean;
  alwaysShow?: boolean;
  createTime: Date;
}

// 表单API
export enum SimpleMenusAPI {
  GetSimpleMenusList = '/system/menu/list-all-simple',
  GetMenuList = '/system/menu/list',
  GetMenu = '/system/menu/get?id=',
  CreateMenu = '/system/menu/create',
  UpdateMenu = '/system/menu/update',
  DeleteMenu = '/system/menu/delete?id=',
}

// 查询菜单（精简）列表
export const getSimpleMenusList = () => {
  const requestParams = { url: SimpleMenusAPI.GetSimpleMenusList };
  return defHttp.get<any>(requestParams, {});
};

// 查询菜单列表
export const getMenuList = (params) => {
  const requestParams = { url: SimpleMenusAPI.GetMenuList, params };
  return defHttp.get<any>(requestParams, {});
};

// 获取菜单详情
export const getMenu = (id: number) => {
  const requestParams = { url: SimpleMenusAPI.GetMenu + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增菜单
export const createMenu = (data: MenuVO) => {
  const requestParams = { url: SimpleMenusAPI.CreateMenu, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改菜单
export const updateMenu = (data: MenuVO) => {
  const requestParams = { url: SimpleMenusAPI.UpdateMenu, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除菜单
export const deleteMenu = (id: number) => {
  const requestParams = { url: SimpleMenusAPI.DeleteMenu + id };
  return defHttp.delete<any>(requestParams, {});
};
