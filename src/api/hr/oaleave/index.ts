import { defHttp } from '@/utils/http/axios';

// 查询OA 请假申请列表
export function getOaLeavePage(params) {
  return defHttp.get({ url: '/baseset/oa-leave/page', params }, { isOnlyResult: true });
}

// 查询OA 请假申请详情
export function getOaLeave(id: string) {
  return defHttp.get({ url: '/baseset/oa-leave/get?id=' + id }, { isOnlyResult: true });
}

// 新增OA 请假申请
export function createOaLeave(data) {
  return defHttp.post({ url: '/baseset/oa-leave/create', data });
}

// 修改OA 请假申请
export function updateOaLeave(data) {
  return defHttp.put({ url: '/baseset/oa-leave/update', data });
}

// 删除OA 请假申请
export function deleteOaLeave(id: string) {
  return defHttp.delete({ url: '/baseset/oa-leave/delete?id=' + id });
}

// 导出OA 请假申请 Excel
export function exportOaLeave(params) {
  return defHttp.download({ url: '/baseset/oa-leave/export-excel', params }, 'OA 请假申请.xls');
}
