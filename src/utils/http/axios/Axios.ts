import type {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import type { RequestOptions, Result, UploadFileParams } from '/#/axios';
import type { CreateAxiosOptions } from './axiosTransform';
import axios from 'axios';
import qs from 'qs';
import { AxiosCanceler } from './axiosCancel';
import { isFunction } from '/@/utils/is';
import { cloneDeep } from 'lodash-es';
import { ContentTypeEnum, RequestEnum, ResultEnum } from '/@/enums/httpEnum';
import { useUserStore } from '/@/store/modules/user';
import { useDictStoreWithOut } from '@/store/modules/dict';
import { SystemAuthApi } from '/@/api/sys/user';
import { DictDataApi } from '/@/api/system/dict/data';
import { createLocalStorage } from '@/utils/cache';

const ls = createLocalStorage();
const dictStore = useDictStoreWithOut();
export * from './axiosTransform';

/**
 * @description:  axios module
 */
export class VAxios {
  // 用于存储pending的请求的数组（处理多条相同请求）
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  /**
   * @description:  Create axios instance
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config);
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * @description: Reconfigure axios
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(config);
  }

  /**
   * @description: Set general header
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  // 生成request的唯一key
  generateRequestKey(config: any): string {
    const { url = '', method = '', params = {}, data = {} } = config;
    if (Reflect.has(params, '_t') && url.includes(DictDataApi.GetDictDataMap)) {
      delete params['_t'];
    }
    return [url, method, qs.stringify(params), qs.stringify(data)].join('&');
  }

  // 将重复请求添加到pendingRequest中
  addPendingRequest(config: any): void {
    const map = dictStore.getRequestMap as Map<String, Object>;
    const key = this.generateRequestKey(config);
    if (map && !map.has(key)) {
      config.cancelToken = new axios.CancelToken((cancel) => {
        dictStore.setRequestMapEntry(key, cancel);
      });
    }
  }

  // 取消重复请求
  removePendingRequest(config): void {
    const map = dictStore.getRequestMap as Map<String, Object>;
    const key = this.generateRequestKey(config);
    if (map && map.has(key)) {
      const cancelToken = map.get(key) as Function;
      cancelToken(key); // 取消之前发送的请求
      setTimeout(() => {
        map.delete(key);
      }, 3000);
    }
  }

  /**
   * @description: Interceptor configuration 拦截器配置
   */
  private setupInterceptors() {
    // const transform = this.getTransform();
    const {
      axiosInstance,
      options: { transform },
    } = this;
    if (!transform) {
      return;
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;

    const axiosCanceler = new AxiosCanceler();

    // Request interceptor configuration processing
    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      // If cancel repeat request is turned on, then cancel repeat request is prohibited
      const { requestOptions } = this.options;
      const ignoreCancelToken = requestOptions?.ignoreCancelToken ?? true;
      !ignoreCancelToken && axiosCanceler.addPending(config);
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options);
      }
      // 处理重复请求
      try {
        this.removePendingRequest(config);
        this.addPendingRequest(config);
      } catch (e) {
        // console.log(e);
      }
      return config;
    }, undefined);

    // Request interceptor error capture
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

    // Response result interceptor processing
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && axiosCanceler.removePending(res.config);
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);

    // Response result interceptor error capture
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, (error) => {
        return responseInterceptorsCatch(axiosInstance, error);
      });
  }

  /**
   * @description:  File Upload
   */
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
    const formData = new window.FormData();
    const customFilename = params.name || 'file';

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename);
    } else {
      formData.append(customFilename, params.file);
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        formData.append(key, params.data![key]);
      });
    }

    return this.axiosInstance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA,
        ignoreCancelToken: true,
      },
    });
  }

  // support form-data
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config;
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    };
  }

  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options);
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options);
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options);
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options);
  }

  download<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET', responseType: 'blob' }, options);
  }

  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    const userStore = useUserStore();
    let conf: CreateAxiosOptions = cloneDeep(config);
    // cancelToken 如果被深拷贝，会导致最外层无法使用cancel方法来取消请求
    if (config.cancelToken) {
      conf.cancelToken = config.cancelToken;
    }
    const transform = this.getTransform();
    const { requestOptions } = this.options;
    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    // 检查查询数据字典
    if (conf.url === DictDataApi.GetDictDataMap) {
      const key = DictDataApi.GetDictDataMap + '?' + qs.stringify(config.params);
      const cache = ls.get(key);
      if (cache) {
        return new Promise((resolve) => {
          resolve(cache);
        });
      }
    }
    if (conf.url === SystemAuthApi.GetPermissionInfo) {
      const key = SystemAuthApi.GetPermissionInfo;
      const cache = ls.get(key);
      if (cache) {
        return new Promise((resolve) => {
          resolve(cache);
        });
      }
    }
    if (conf.url === SystemAuthApi.SysLogout) {
      return new Promise((resolve) => {
        const result = `{"userId":"","username":""}`;
        resolve(JSON.parse(result));
      });
    }

    const { beforeRequestHook, requestCatchHook, transformResponseHook } = transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;
    conf = this.supportFormData(conf);
    const token = userStore.getAccessToken();
    if (conf && conf.headers && conf.headers.Authorization && token) {
      conf.headers.Authorization = '#{{TOKEN}}'.replace(/#{{TOKEN}}/g, token);
    }

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformResponseHook && isFunction(transformResponseHook)) {
            try {
              const ret = transformResponseHook(res, opt);
              if (conf.url == opt.apiUrl + DictDataApi.GetDictDataMap) {
                const key = DictDataApi.GetDictDataMap + '?' + qs.stringify(config.params);
                ls.set(key, ret, 60 * 60 * 24 * 7);
              }
              if (conf.url == opt.apiUrl + SystemAuthApi.GetPermissionInfo) {
                const key = SystemAuthApi.GetPermissionInfo;
                ls.set(key, ret, 60 * 60 * 24 * 7);
              }
              resolve(ret);
            } catch (err) {
              reject(err || new Error('request error!'));
              const logoutFlag = res.data.code == ResultEnum.ACCOUNT_ERROR;
              if (logoutFlag) {
                setTimeout(() => {
                  // userStore.logout(true);
                }, 500);
              }
            }
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt));
            return;
          }
          if (axios.isAxiosError(e)) {
            // rewrite error message from axios in here
          }
          reject(e);
        });
    });
  }
}
