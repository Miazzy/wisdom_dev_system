import { defHttp } from '/@/utils/http/axios';

export enum Api {
  CREATE_URL = '/baseset/index-storehouse/create',
  UPDATE_URL = '/baseset/index-storehouse/update',
  UPDATE_STATUS_URL = '/baseset/index-storehouse/update-status',
  DELETE_URL = '/baseset/index-storehouse/delete',
  GET_URL = '/baseset/index-storehouse/get',
  PAGE_URL = '/baseset/index-storehouse/page',
  EXPORT_EXCEL_URL = '/baseset/index-storehouse/export-excel',
  TABLE_PAGE_URL = '/baseset/index-storehouse/table-page',
  TABLE_COLUMN_PAGE_URL = '/baseset/index-storehouse/table-column-page',
}

// 添加指标库设置
export const createData = (params) =>
  defHttp.post(
    {
      url: Api.CREATE_URL,
      params,
    },
    {},
  );

// 修改指标库设置
export const updateData = (params) =>
  defHttp.put(
    {
      url: Api.UPDATE_URL,
      params,
    },
    {},
  );

export const saveData = (params) => {
  if (!params.id) {
    return createData(params);
  }
  return updateData(params);
};

// 修改指标库设置状态
export const updateStatus = (id: string, status: number) =>
  defHttp.put(
    {
      url: `${Api.UPDATE_STATUS_URL}?id=${id}&status=${status}`,
    },
    {},
  );

// 删除指标库设置
export const deleteData = (id) =>
  defHttp.delete(
    {
      url: `${Api.DELETE_URL}?id=${id}`,
    },
    {},
  );

// 获取指标库设置
export const getData = (id) =>
  defHttp.get(
    {
      url: `${Api.GET_URL}?id=${id}`,
    },
    { isOnlyResult: true },
  );

// 分页获取指标库设置
export const getPage = (params) =>
  defHttp.get(
    {
      url: Api.PAGE_URL,
      params,
    },
    { isOnlyResult: true },
  );

// 分页获取表名
export const getTablePageUrl = Api.TABLE_PAGE_URL;
export const getTablePage = (params) =>
  defHttp.get(
    {
      url: Api.TABLE_PAGE_URL,
      params,
    },
    { isOnlyResult: true },
  );

// 分页获取表列名
export const getTableColumnPageUrl = Api.TABLE_COLUMN_PAGE_URL;
export const getTableColumnPage = (params) =>
  defHttp.get(
    {
      url: Api.TABLE_COLUMN_PAGE_URL,
      params,
    },
    { isOnlyResult: true },
  );

// 导出指标设置列表
export const exportExcel = (params) =>
  defHttp.post(
    {
      url: Api.EXPORT_EXCEL_URL,
      params,
      responseType: 'blob',
    },
    { isOnlyResult: true },
  );
