import { defHttp } from '/@/utils/http/axios';

enum Api {
  page = '/bpm/model/page',
}

export const getPage = (params: ParamsType) =>
  defHttp.get<any>({
    url: Api.page,
    params,
  });

// 获取流程表格列表数据
export const getTableDataWflow = (queryParams) => {
  return getPage(queryParams);
};

export type ParamsType = {
  pageNo: number;
  pageSize: number;
  key: undefined | string;
  name: undefined | string;
  category: undefined | string;
};
