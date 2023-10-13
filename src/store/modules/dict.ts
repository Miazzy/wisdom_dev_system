import { defineStore } from 'pinia';
import type { DictState } from '@/types/store';
import { store } from '@/store';
import { DICT_KEY, DICTKEY_KEY } from '@/enums/cacheEnum';
import { createLocalStorage } from '@/utils/cache';
import { getDictDataMap } from '/@/api/system/dict/data';

const ls = createLocalStorage();

export const useDictStore = defineStore({
  id: 'app-dict',
  state: (): DictState => ({
    dictMap: new Map<string, any>(),
    isSetDict: false,
    dictKey: [],
  }),
  getters: {
    getDictMap(state): Recordable {
      const dictMap = ls.get(DICT_KEY);
      if (dictMap) state.dictMap = dictMap;
      return state.dictMap;
    },
    getIsSetDict(state): boolean {
      return state.isSetDict;
    },
    getDictKey(state): string[] {
      const dictKeyCache = ls.get(DICTKEY_KEY);
      const keyFlag =
        state.dictKey == null || typeof state.dictKey == 'undefined' || state.dictKey.length == 0;
      if (keyFlag || dictKeyCache) {
        state.dictKey = dictKeyCache;
      }
      return state.dictKey;
    },
  },
  actions: {
    async setDictKey(key: string) {
      if (!this.dictKey) {
        this.dictKey = [] as string[];
      }
      this.dictKey.push(key);
      ls.set(DICTKEY_KEY, this.dictKey, 60 * 60 * 24 * 7);
    },
    async setDictMap(dictMap: Map<string, any>) {
      if (dictMap) {
        this.dictMap = dictMap;
        this.isSetDict = true;
        ls.set(DICT_KEY, dictMap, 60 * 60 * 24 * 7);
      }
    },
    async fetchBackendData(typeList: string = '', props) {
      // 获取type内容
      const typeContent = typeList != '' ? typeList : props.type;
      // 调用后端接口获取数据的逻辑，返回数据数组
      const response = await getDictDataMap({ dictTypeList: typeContent });
      // 返回查询结果
      if (Reflect.has(response, 'result') && Reflect.has(response.result, props.type)) {
        return response.result[props.type];
      }
      return [];
    },
  },
});

// Need to be used outside the setup
export function useDictStoreWithOut() {
  return useDictStore(store);
}
