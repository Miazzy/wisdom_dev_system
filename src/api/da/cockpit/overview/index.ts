import { defHttp } from '@/utils/http/axios';

// 发电统计
export function powerStatByGen(params) {
  return defHttp.post({ url: '/da/home-page/powerStat/gen', params }, { isOnlyResult: true });
}

// 计划统计
export function powerStatByPlan(params) {
  return defHttp.post({ url: '/da/home-page/powerStat/plan', params }, { isOnlyResult: true });
}

// 今日发电量(万kWh)，累计上网电量(万kWh)
export function powerStatByDay(params) {
  return defHttp.post({ url: '/da/home-page/powerStat/day', params }, { isOnlyResult: true });
}

// 电站分布
export function provinceStat(params) {
  return defHttp.post({ url: '/da/home-page/provinceStat', params }, { isOnlyResult: true });
}

// 运维人员
export function operationPerson(params) {
  return defHttp.post({ url: '/da/home-page/operationPerson', params }, { isOnlyResult: true });
}

// 运维统计
export function workOrder(params) {
  return defHttp.post({ url: '/da/home-page/workOrder', params }, { isOnlyResult: true });
}
export function inspection(params) {
  return defHttp.post({ url: '/da/home-page/inspection', params }, { isOnlyResult: true });
}
export function twoTicket(params) {
  return defHttp.post({ url: '/da/home-page/twoTicket', params }, { isOnlyResult: true });
}

// 安全运行
export function safeResp(params) {
  return defHttp.post({ url: '/da/home-page/safeResp', params }, { isOnlyResult: true });
}
export function safeCheck(params) {
  return defHttp.post({ url: '/da/home-page/safeCheck', params }, { isOnlyResult: true });
}
export function safeTools(params) {
  return defHttp.post({ url: '/da/home-page/safeTools', params }, { isOnlyResult: true });
}
// 其他信息
export function otherInfo(params) {
  return defHttp.post({ url: '/da/home-page/otherInfo', params }, { isOnlyResult: true });
}
