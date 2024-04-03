import { defHttp } from '@/utils/http/axios';

// 查询设备出库明细列表
export function getEquipmentOutboundDtlPage(params) {
  return defHttp.get({ url: '/po/equipment-outbound-dtl/page', params }, { isOnlyResult: true });
}

// 查询设备出库明细详情
export function getEquipmentOutboundDtl(id: string) {
  return defHttp.get({ url: '/po/equipment-outbound-dtl/get?id=' + id }, { isOnlyResult: true });
}

// 新增设备出库明细
export function createEquipmentOutboundDtl(data) {
  return defHttp.post({ url: '/po/equipment-outbound-dtl/create', data });
}

// 修改设备出库明细
export function updateEquipmentOutboundDtl(data) {
  return defHttp.put({ url: '/po/equipment-outbound-dtl/update', data });
}

// 删除设备出库明细
export function deleteEquipmentOutboundDtl(id: string) {
  return defHttp.delete({ url: '/po/equipment-outbound-dtl/delete?id=' + id });
}

// 导出设备出库明细 Excel
export function exportEquipmentOutboundDtl(params) {
  return defHttp.download(
    { url: '/po/equipment-outbound-dtl/export-excel', params },
    { isReturnNativeResponse: true },
  );
}
