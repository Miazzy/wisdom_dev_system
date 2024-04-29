import { defHttp } from '@/utils/http/axios';

// 查询设备物资台账列表
export function getEquipmentPage(params) {
  return defHttp.get({ url: '/po/equipment/page', params }, { isOnlyResult: true });
}

// 查询设备物资台账详情
export function getEquipment(id: string) {
  return defHttp.get({ url: '/po/equipment/get?id=' + id }, { isOnlyResult: true });
}

// 查询设备物资台账详情
export function getEquipmentList(ids: Array<string>) {
  return defHttp.get({ url: '/po/equipment/list?ids=' + ids }, { isOnlyResult: true });
}

// 获取设备物资台账编码
export function getEquipmentCode() {
  return defHttp.get({ url: '/po/equipment/get-code' }, { isOnlyResult: true });
}

// 新增设备物资台账
export function createEquipment(data) {
  return defHttp.post({ url: '/po/equipment/create', data });
}

// 修改设备物资台账
export function updateEquipment(data) {
  return defHttp.put({ url: '/po/equipment/update', data });
}

// 修改设备物资台账状态
export function updateEquipmentStatus(ids: Array<string>, status: number) {
  return defHttp.put({ url: '/po/equipment/update-status?ids=' + ids + '&status=' + status });
}

// 删除设备物资台账
export function deleteEquipment(id: number) {
  return defHttp.delete({ url: '/po/equipment/delete?id=' + id });
}

// 导出设备物资台账 Excel
export function exportEquipment(params) {
  return defHttp.download(
    { url: '/po/equipment/export-excel', params },
    { isReturnNativeResponse: true },
  );
}

// 根据物料ID查询是否存在物资
export function getExistEquipment(materialId) {
  return defHttp.get(
    { url: '/po/equipment/list?materialId=' + materialId },
    { isOnlyResult: true },
  );
}

// 获得设备物资拆分列表
export function getEquipmentSplit(params) {
  return defHttp.get({ url: '/po/equipment/getEquipmentSplit?id=' + params.id }, { isOnlyResult: true });
}

// 创建设备物资拆分 
export function createEquipmentSplit(data) {
  return defHttp.post({ url: '/po/equipment/createEquipmentSplit', data });
}