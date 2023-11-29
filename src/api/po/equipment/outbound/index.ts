import { defHttp } from '@/utils/http/axios';

// 查询设备出库单列表
export function getEquipmentOutboundPage(params) {
  return defHttp.get({ url: '/po/equipment-outbound/page', params }, { isOnlyResult: true });
}

// 查询设备出库单详情
export function getEquipmentOutbound(id: string) {
  return defHttp.get({ url: '/po/equipment-outbound/get?id=' + id }, { isOnlyResult: true });
}

// 新增设备出库单
export function createEquipmentOutbound(data) {
  return defHttp.post({ url: '/po/equipment-outbound/create', data });
}

// 修改设备出库单
export function updateEquipmentOutbound(data) {
  return defHttp.put({ url: '/po/equipment-outbound/update', data });
}

// 删除设备出库单
export function deleteEquipmentOutbound(id: string) {
  return defHttp.delete({ url: '/po/equipment-outbound/delete?id=' + id });
}

// 导出设备出库单 Excel
export function exportEquipmentOutbound(params) {
  return defHttp.download({ url: '/po/equipment-outbound/export-excel', params }, '设备出库单.xls');
}
