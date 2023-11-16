import { defHttp } from '@/utils/http/axios';

// 查询设备物资技术参数列表
export function getEquipmentParameterPage(params) {
  return defHttp.get({ url: '/po/equipment-parameter/page', params }, { isOnlyResult: true });
}

// 查询设备物资技术参数详情
export function getEquipmentParameter(id: number) {
  return defHttp.get({ url: '/po/equipment-parameter/get?id=' + id }, { isOnlyResult: true });
}

// 新增设备物资技术参数
export function createEquipmentParameter(data) {
  return defHttp.post({ url: '/po/equipment-parameter/create', data });
}

// 修改设备物资技术参数
export function updateEquipmentParameter(data) {
  return defHttp.put({ url: '/po/equipment-parameter/update', data });
}

// 删除设备物资技术参数
export function deleteEquipmentParameter(id: number) {
  return defHttp.delete({ url: '/po/equipment-parameter/delete?id=' + id });
}

// 导出设备物资技术参数 Excel
export function exportEquipmentParameter(params) {
  return defHttp.download(
    { url: '/po/equipment-parameter/export-excel', params },
    '设备物资技术参数.xls',
  );
}
