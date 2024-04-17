import { defHttp } from '/@/utils/http/axios';

export interface PostVO {
  id?: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  remark: string;
  createTime?: Date;
}

// 表单API
export enum PostApi {
  GetPostPage = '/system/post/page',
  GetSimplePostList = '/system/post/list-all-simple',
  GetPost = '/system/post/get?id=',
  CreatePost = '/system/post/create',
  UpdatePost = '/system/post/update',
  DeletePost = '/system/post/delete?id=',
  ExportPost = '/system/post/export',
}

// 查询岗位列表
export const getPostPage = async (params: any) => {
  const requestParams = { url: PostApi.GetPostPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 获取岗位精简信息列表
export const getSimplePostList = async (): Promise<PostVO[]> => {
  const params = {
    orgKindId: 'pos',
  };
  const requestParams = { url: PostApi.GetSimplePostList, params };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};

// 查询岗位详情
export const getPost = async (id: number) => {
  const requestParams = { url: PostApi.GetPost + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增岗位
export const createPost = async (data: PostVO) => {
  const requestParams = { url: PostApi.CreatePost, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改岗位
export const updatePost = async (data: PostVO) => {
  const requestParams = { url: PostApi.UpdatePost, data };
  return defHttp.post<any>(requestParams, {});
};

// 删除岗位
export const deletePost = async (id: number) => {
  const requestParams = { url: PostApi.DeletePost + id };
  return defHttp.post<any>(requestParams, {});
};

// 导出岗位
export const exportPost = async (params) => {
  const requestParams = { url: PostApi.ExportPost, params };
  return defHttp.post<any>(requestParams, {});
};
