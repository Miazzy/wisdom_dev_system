import { defineStore } from 'pinia';
import type { DictState } from '@/types/store';
import { store } from '@/store';
import { DICT_KEY, DICTKEY_KEY } from '@/enums/cacheEnum';
import { createLocalStorage } from '@/utils/cache';

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
  },
});

// Need to be used outside the setup
export function useDictStoreWithOut() {
  return useDictStore(store);
}
