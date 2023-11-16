import { defHttp } from '@/utils/http/axios';

// 查询设备物资元器件列表
export function getEquipmentComponentPage(params) {
  return defHttp.get({ url: '/po/equipment-component/page', params }, { isOnlyResult: true });
}

// 查询设备物资元器件详情
export function getEquipmentComponent(id: number) {
  return defHttp.get({ url: '/po/equipment-component/get?id=' + id }, { isOnlyResult: true });
}

// 新增设备物资元器件
export function createEquipmentComponent(data) {
  return defHttp.post({ url: '/po/equipment-component/create', data });
}

// 修改设备物资元器件
export function updateEquipmentComponent(data) {
  return defHttp.put({ url: '/po/equipment-component/update', data });
}

// 删除设备物资元器件
export function deleteEquipmentComponent(id: number) {
  return defHttp.delete({ url: '/po/equipment-component/delete?id=' + id });
}

// 导出设备物资元器件 Excel
export function exportEquipmentComponent(params) {
  return defHttp.download(
    { url: '/po/equipment-component/export-excel', params },
    '设备物资元器件.xls',
  );
}
