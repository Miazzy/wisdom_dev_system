import { defHttp } from '@/utils/http/axios';

// 查询设备入库结存列表
export function getEquipmentBalancePage(params) {
  return defHttp.get({ url: '/bi/equipment-balance/page', params });
}

// 查询设备入库明细列表
export function getEquipmentWarehousingDtlPage(params) {
  return defHttp.get({ url: '/bi/equipment-balance/getEquipmentWarehousingDtlPage', params });
}

// 查询设备出库明细列表
export function getEquipmentOutboundDtlPage(params) {
  return defHttp.get({ url: '/bi/equipment-balance/getEquipmentOutboundDtlPage', params });
}

// 导出设备入库结存 Excel
export function exportEquipmentBalance(params) {
  return defHttp.download(
    { url: '/bi/equipment-balance/export-excel', params },
    '设备入库结存.xls',
  );
}
