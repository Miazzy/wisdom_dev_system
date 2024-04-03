import { defHttp } from '@/utils/http/axios';

// 查询库存盘点明细列表
export function getEquipmentInventoryDtlPage(params) {
  return defHttp.get({ url: '/po/equipment-inventory-dtl/page', params }, { isOnlyResult: true });
}

// 查询库存盘点明细详情
export function getEquipmentInventoryDtl(id: number) {
  return defHttp.get({ url: '/po/equipment-inventory-dtl/get?id=' + id }, { isOnlyResult: true });
}

// 新增库存盘点明细
export function createEquipmentInventoryDtl(data) {
  return defHttp.post({ url: '/po/equipment-inventory-dtl/create', data });
}

// 修改库存盘点明细
export function updateEquipmentInventoryDtl(data) {
  return defHttp.put({ url: '/po/equipment-inventory-dtl/update', data });
}

// 删除库存盘点明细
export function deleteEquipmentInventoryDtl(id: number) {
  return defHttp.delete({ url: '/po/equipment-inventory-dtl/delete?id=' + id });
}

// 导出库存盘点明细 Excel
export function exportEquipmentInventoryDtl(params) {
  return defHttp.download(
    { url: '/po/equipment-inventory-dtl/export-excel', params },
    { isReturnNativeResponse: true },
  );
}
