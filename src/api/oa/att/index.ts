import { defHttp } from '/@/utils/http/axios';

export enum Api {
  CREATE_PERIOD_URL = '/po/oa/attend-monthly-scheduling/period/create',
  UPDATE_PERIOD_URL = '/po/oa/attend-monthly-scheduling/period/update',
  GET_PERIOD_URL = '/po/oa/attend-monthly-scheduling/period/get',

  CREATE_URL = '/po/oa/attend-monthly-scheduling/create',
  UPDATE_URL = '/po/oa/attend-monthly-scheduling/update',
  DELETE_URL = '/po/oa/attend-monthly-scheduling/delete',
  EXPORT_EXCEL_URL = '/po/oa/attend-monthly-scheduling/export-excel',
  GET_URL = '/po/oa/attend-monthly-scheduling/get',
  PAGE_URL = '/po/oa/attend-monthly-scheduling/page',

  EXPORT_DETAIL_EXCEL_URL = '/po/oa/attend-monthly-scheduling/detail/export-excel',
  LIST_DETAIL_URL = '/po/oa/attend-monthly-scheduling/detail/list',
}
// 添加月排班规则
export const createPeriodData = (params) =>
  defHttp.post(
    {
      url: Api.CREATE_PERIOD_URL,
      params,
    },
    {},
  );

// 修改月排班规则
export const updatePeriodData = (params) =>
  defHttp.put(
    {
      url: Api.UPDATE_PERIOD_URL,
      params,
    },
    {},
  );

export const savePeriodData = (params) => {
  if (!params.id) {
    return createData(params);
  }
  return updateData(params);
};

// 获取月排班
export const getPeriodData = (id) =>
  defHttp.get(
    {
      url: Api.GET_PERIOD_URL + '?id=' + id,
    },
    {},
  );

// 添加月排班
export const createData = (params) =>
  defHttp.post(
    {
      url: Api.CREATE_URL,
      params,
    },
    {},
  );

// 修改月排班
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

// 删除月排班
export const deleteData = (id) =>
  defHttp.delete(
    {
      url: Api.DELETE_URL + '?id=' + id,
    },
    {},
  );

// 导出月排班
export const exportExcel = (params) =>
  defHttp.download(
    {
      url: Api.EXPORT_EXCEL_URL,
      params,
    },
    { isReturnNativeResponse: true },
  );

// 获取月排班
export const getData = (id) =>
  defHttp.get(
    {
      url: Api.GET_URL + '?id=' + id,
    },
    {},
  );

// 分页获取月排班列表
export const getPage = (params) =>
  defHttp.get(
    {
      url: Api.PAGE_URL,
      params,
    },
    {},
  );

// 导出月排班明细
export const exportDetailExcel = (params) =>
  defHttp.download(
    {
      url: Api.EXPORT_DETAIL_EXCEL_URL,
      params,
    },
    { isReturnNativeResponse: true },
  );

// 获取月排班明细列表
export const getDetailList = (params) =>
  defHttp.get(
    {
      url: Api.LIST_DETAIL_URL,
      params,
    },
    {},
  );
