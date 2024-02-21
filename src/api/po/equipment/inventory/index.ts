import { defHttp } from '@/utils/http/axios';

// 查询库存盘点单列表
export function getEquipmentInventoryPage(params) {
  return defHttp.get({ url: '/po/equipment-inventory/page', params }, { isOnlyResult: true });
}

// 查询库存盘点单详情
export function getEquipmentInventory(id: number) {
  return defHttp.get({ url: '/po/equipment-inventory/get?id=' + id }, { isOnlyResult: true });
}

// 新增库存盘点单
export function createEquipmentInventory(data) {
  return defHttp.post({ url: '/po/equipment-inventory/create', data });
}

// 修改库存盘点单
export function updateEquipmentInventory(data) {
  return defHttp.put({ url: '/po/equipment-inventory/update', data });
}

// 删除库存盘点单
export function deleteEquipmentInventory(id: number) {
  return defHttp.delete({ url: '/po/equipment-inventory/delete?id=' + id });
}

// 获得出库入库审批中流程
export function getWarehousingAndOutboundProcessExists() {
  return defHttp.get(
    { url: '/po/equipment-inventory/getWarehousingAndOutboundProcessExists' },
    { isOnlyResult: true },
  );
}

// 获得盘点审批中流程
export function getInventoryProcessExists() {
  return defHttp.get(
    { url: '/po/equipment-inventory/getInventoryProcessExists' },
    { isOnlyResult: true },
  );
}

// 导出库存盘点单 Excel
export function exportEquipmentInventory(params) {
  return defHttp.download(
    { url: '/po/equipment-inventory/export-excel', params },
    '库存盘点单.xls',
  );
}

// 获得流程默认信息
export function getDefaultValues() {
  return defHttp.get({ url: '/po/equipment-inventory/getDefaultValues' }, { isOnlyResult: true });
}
