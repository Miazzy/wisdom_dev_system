import { defHttp } from '/@/utils/http/axios';

export enum Api {
  CREATE_PERIOD_URL = '/oa/attend-monthly-scheduling/period/create',
  UPDATE_PERIOD_URL = '/oa/attend-monthly-scheduling/period/update',
  GET_PERIOD_URL = '/oa/attend-monthly-scheduling/period/get',
  LIST_PERIOD_URL = '/oa/attend-monthly-scheduling/period/list',

  CREATE_URL = '/oa/attend-monthly-scheduling/create',
  UPDATE_URL = '/oa/attend-monthly-scheduling/update',
  DELETE_URL = '/oa/attend-monthly-scheduling/delete',
  EXPORT_EXCEL_URL = '/oa/attend-monthly-scheduling/export-excel',
  GET_URL = '/oa/attend-monthly-scheduling/get',
  PAGE_URL = '/oa/attend-monthly-scheduling/page',

  EXPORT_DETAIL_EXCEL_URL = '/oa/attend-monthly-scheduling/detail/export-excel',
  LIST_DETAIL_URL = '/oa/attend-monthly-scheduling/detail/list',

  LIST_HOLIDAY_URL = '/oa/attend-monthly-scheduling/getHolidayList',
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
    return createPeriodData(params);
  }
  return updatePeriodData(params);
};

// 获取月排班规则
export const getPeriodData = (id) =>
  defHttp.get(
    {
      url: Api.GET_PERIOD_URL + '?id=' + id,
    },
    {},
  );

// 获取月排班规则
export const getPeriodList = () =>
  defHttp.get(
    {
      url: Api.LIST_PERIOD_URL,
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
    { isOnlyResult: true },
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
export const getDetailList = (schedulingId) =>
  defHttp.get(
    {
      url: `${Api.LIST_DETAIL_URL}?schedulingId=${schedulingId}`,
    },
    {},
  );

// 获取节假日
export const getHolidayList = (year) =>
  defHttp.get(
    {
      url: `${Api.LIST_HOLIDAY_URL}?year=${year}`,
    },
    { isOnlyResult: true },
  );
