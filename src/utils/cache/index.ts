import { getStorageShortName } from '/@/utils/env';
import { createStorage as create, CreateStorageParams } from './storageCache';
import { enableStorageEncryption, DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';
import localforage from 'localforage';

try {
  localforage
    .ready()
    .then(function () {})
    .catch(function (e) {
      console.info('localforage ready error:', 'No available storage method found... ', e);
    });
  localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'systemDataDb',
    storeName: 'systemDataStore',
  });
} catch (error) {
  //
}

export type Options = Partial<CreateStorageParams>;

const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    hasEncrypt: enableStorageEncryption,
    storage,
    prefixKey: getStorageShortName(),
    ...options,
  };
};

export const WebStorage = create(createOptions(sessionStorage));

export const createStorage = (storage: Storage | any = sessionStorage, options: Options = {}) => {
  return create(createOptions(storage, options));
};

export const createSessionStorage = (options: Options = {}) => {
  return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export const createLocalStorage = (options: Options = {}) => {
  return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export const createLocalForage = (options: Options = {}) => {
  return createStorage(localforage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export const setCustomCompOptions = (key, options) => {
  const ls = createLocalStorage();
  ls.set('CUSTOM_COMP_OPTIONS_' + key, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export const getCustomCompOptions = (key) => {
  const ls = createLocalStorage();
  return ls.get('CUSTOM_COMP_OPTIONS_' + key);
};

export const setRouteInfo = (key, route) => {
  const ls = createLocalStorage();
  ls.set('ROUTE_INFO_CACHE_KEY_' + key, { ...route, timeout: DEFAULT_CACHE_TIME });
};

export const getRouteInfo = (key) => {
  const ls = createLocalStorage();
  return ls.get('ROUTE_INFO_CACHE_KEY_' + key);
};

export const setComponetInfo = (key, route) => {
  const ls = createLocalStorage();
  ls.set('COMPONET_INFO_CACHE_KEY_' + key, { ...route, timeout: DEFAULT_CACHE_TIME });
};

export const getComponetInfo = (key) => {
  const ls = createLocalStorage();
  return ls.get('COMPONET_INFO_CACHE_KEY_' + key);
};

export default WebStorage;
