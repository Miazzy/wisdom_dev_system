import { defHttp } from '@/utils/http/axios';


// 根据编码获取系统参数信息
export function getParameterByCode(code: string) {
  return defHttp.get({ url: '/system/parameter/get—code?code=' + code }, { isOnlyResult: true });
}
