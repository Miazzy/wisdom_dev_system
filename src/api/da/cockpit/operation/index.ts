import { defHttp } from '@/utils/http/axios';

// 巡检统计(次),工单统计(笔),细则统计(万元),两票统计(张),缺陷统计(个),隐患统计(项)
export function topInfo(params) {
  return defHttp.post({ url: '/da/operation/topInfo', params }, { isOnlyResult: true });
}

// 巡检统计
export function inspectionStat(params) {
  return defHttp.post({ url: '/da/operation/inspectionStat', params }, { isOnlyResult: true });
}

// 工单统计
export function workOrderStat(params) {
  return defHttp.post({ url: '/da/operation/workOrderStat', params }, { isOnlyResult: true });
}

// 细则统计
export function assessRuleStat(params) {
  return defHttp.post({ url: '/da/operation/assessRuleStat', params }, { isOnlyResult: true });
}

// 两票统计
export function twoTicketStat(params) {
  return defHttp.post({ url: '/da/operation/twoTicketStat', params }, { isOnlyResult: true });
}

// 缺陷统计
export function defectStat(params) {
  return defHttp.post({ url: '/da/operation/defectStat', params }, { isOnlyResult: true });
}

// 隐患统计
export function hiddenStat(params) {
  return defHttp.post({ url: '/da/operation/hiddenStat', params }, { isOnlyResult: true });
}
