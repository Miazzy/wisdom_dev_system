import { defHttp } from '@/utils/http/axios';

// 天气
export function getWeather(params) {
  return defHttp.get(
    { url: '/system/weather/get', params: { rectangle: '104.06,30.65', ...params } },
    { isTransformResponse: false },
  );
}

//获取有效数据字典
export const getDictDataMap = (params: any) => {
  const requestParams = { url: '/system/dict-data/getDictList', params };
  return defHttp.get<any>(requestParams, {});
};
