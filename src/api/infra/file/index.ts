import { defHttp } from '/@/utils/http/axios';

// 表单API
export enum FileApi {
  GetBizId = '/infra/file/getBizId',
  Upload = '/infra/file/upload',
  GetFiles = '/infra/file/getFiles',
  DeleteFile = '/infra/file/delete',
}

export const getBizId = async (params) => {
  const requestParams = { url: FileApi.GetBizId, params };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};

export const uploadFile = async (params) => {
  const requestParams = {
    url: FileApi.Upload,
    params,
    headers: { 'Content-Type': 'multipart/form-data' },
  };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
};

export const getFiles = async (params) => {
  const requestParams = { url: FileApi.GetFiles, params };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};

export const deleteFile = async (id: number) => {
  const requestParams = { url: FileApi.DeleteFile + '?id=' + id };
  return defHttp.delete<any>(requestParams, { isOnlyResult: true });
};

export const attachmentPreview = (url) => {
  const pictureTypes = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico', '.jfif', '.webp'];
  const arrays = pictureTypes.filter((item) => url.indexOf(item) > 0);

  let previewdomain = 'http://122.9.154.245'; //测试环境域名
  let downloaddomain = arrays.length == 0 ? 'http://192.168.0.200' : 'http://139.9.148.32'; //测试环境下载域名
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    previewdomain = 'http://10.8.111.167'; //开发环境域名
    downloaddomain = 'http://10.8.111.203'; //下载域名
  }
  previewdomain = previewdomain + ':8012'; //预览域名
  downloaddomain = downloaddomain + ':48080'; //下载域名
  return (
    previewdomain +
    '/onlinePreview?url=' +
    encodeURIComponent(btoa(encodeURI(downloaddomain + url)))
  );
};
