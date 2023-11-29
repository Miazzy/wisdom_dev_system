import { defHttp } from '@/utils/http/axios';

// 查询设备入库明细列表
export function getEquipmentWarehousingDtlPage(params) {
  return defHttp.get({ url: '/po/equipment-warehousing-dtl/page', params }, { isOnlyResult: true });
}

// 查询设备入库明细详情
export function getEquipmentWarehousingDtl(id: string) {
  return defHttp.get({ url: '/po/equipment-warehousing-dtl/get?id=' + id }, { isOnlyResult: true });
}

// 新增设备入库明细
export function createEquipmentWarehousingDtl(data) {
  return defHttp.post({ url: '/po/equipment-warehousing-dtl/create', data });
}

// 修改设备入库明细
export function updateEquipmentWarehousingDtl(data) {
  return defHttp.put({ url: '/po/equipment-warehousing-dtl/update', data });
}

// 删除设备入库明细
export function deleteEquipmentWarehousingDtl(id: string) {
  return defHttp.delete({ url: '/po/equipment-warehousing-dtl/delete?id=' + id });
}

// 导出设备入库明细 Excel
export function exportEquipmentWarehousingDtl(params) {
  return defHttp.download(
    { url: '/po/equipment-warehousing-dtl/export-excel', params },
    '设备入库明细.xls',
  );
}

// 查询设备入库明细结存列表
export function getWarehousingBalancePage(params) {
  return defHttp.get(
    { url: '/po/equipment-warehousing-dtl/warehousing-balance-page', params },
    { isOnlyResult: true },
  );
}
