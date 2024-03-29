import { defHttp } from '/@/utils/http/axios';

export interface DeptVO {
  id?: number;
  name: string;
  parentId: number;
  status: number;
  sort: number;
  leaderUserId: number;
  phone: string;
  email: string;
  createTime: Date;
}

// 表单API
export enum DeptApi {
  GetSimpleDeptList = '/system/org/list-all-simple',
  GetDeptPage = '/system/dept/list',
  GetDept = '/system/dept/get?id=',
  CreateDept = '/system/dept/create',
  UpdateDept = '/system/dept/update',
  DeleteDept = '/system/dept/delete?id=',
}

// 查询部门（精简)列表
export const getSimpleDeptList = async (): Promise<DeptVO[]> => {
  const params = {
    orgKindId: 'dpt',
  };
  const requestParams = { url: DeptApi.GetSimpleDeptList, params };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};

// 查询部门列表
export const getDeptPage = async (params: any) => {
  const requestParams = { url: DeptApi.GetDeptPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询部门详情
export const getDept = async (id: number) => {
  const requestParams = { url: DeptApi.GetDept + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增部门
export const createDept = async (data: DeptVO) => {
  const requestParams = { url: DeptApi.CreateDept, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改部门
export const updateDept = async (data: DeptVO) => {
  const requestParams = { url: DeptApi.UpdateDept, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除部门
export const deleteDept = async (id: number) => {
  const requestParams = { url: DeptApi.DeleteDept + id };
  return defHttp.delete<any>(requestParams, {});
};
