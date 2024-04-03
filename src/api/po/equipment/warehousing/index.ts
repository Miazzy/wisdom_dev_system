import { defHttp } from '@/utils/http/axios';

// 查询设备入库单列表
export function getEquipmentWarehousingPage(params) {
  return defHttp.get({ url: '/po/equipment-warehousing/page', params }, { isOnlyResult: true });
}

// 查询设备入库单详情
export function getEquipmentWarehousing(id: number) {
  return defHttp.get({ url: '/po/equipment-warehousing/get?id=' + id }, { isOnlyResult: true });
}

// 新增设备入库单
export function createEquipmentWarehousing(data) {
  return defHttp.post({ url: '/po/equipment-warehousing/create', data });
}

// 修改设备入库单
export function updateEquipmentWarehousing(data) {
  return defHttp.put({ url: '/po/equipment-warehousing/update', data });
}

// 删除设备入库单
export function deleteEquipmentWarehousing(id: number) {
  return defHttp.delete({ url: '/po/equipment-warehousing/delete?id=' + id });
}

// 导出设备入库单 Excel
export function exportEquipmentWarehousing(params) {
  return defHttp.download(
    { url: '/po/equipment-warehousing/export-excel', params },
    { isReturnNativeResponse: true },
  );
}

// 获得流程默认信息
export function getDefaultValues() {
  return defHttp.get({ url: '/po/equipment-warehousing/getDefaultValues' }, { isOnlyResult: true });
}
