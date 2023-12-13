import { defHttp } from '@/utils/http/axios';

// 安全运行天数,安全检查(次),安全培训(次),安全隐患(个),安全工器具(个),安全责任书签订率(%)
export function topInfo(params) {
  return defHttp.post({ url: '/da/safety/topInfo', params }, { isOnlyResult: true });
}

// 安全检查
export function safetyCheckStat(params) {
  return defHttp.post({ url: '/da/safety/safetyCheckStat', params }, { isOnlyResult: true });
}

// 安全培训
export function trainingStat(params) {
  return defHttp.post({ url: '/da/safety/trainingStat', params }, { isOnlyResult: true });
}

// 安全隐患
export function hiddenStat(params) {
  return defHttp.post({ url: '/da/safety/hiddenStat', params }, { isOnlyResult: true });
}

// 安全工器具
export function safeToolsStat(params) {
  return defHttp.post({ url: '/da/safety/safeToolsStat', params }, { isOnlyResult: true });
}

// 安全责任书
export function safeRespStat(params) {
  return defHttp.post({ url: '/da/safety/safeRespStat', params }, { isOnlyResult: true });
}

// 安全标准化
export function emergencyStat(params) {
  return defHttp.post({ url: '/da/safety/emergencyStat', params }, { isOnlyResult: true });
}
