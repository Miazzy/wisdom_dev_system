import { defHttp } from '@/utils/http/axios';

// 查询单据编号规则列表
export function getCodeBuildRulePage(params) {
  return defHttp.get({ url: '/system/code-build-rule/page', params }, { isOnlyResult: true });
}

// 查询单据编号规则详情
export function getCodeBuildRule(id: number) {
  return defHttp.get({ url: '/system/code-build-rule/get?id=' + id }, { isOnlyResult: true });
}

// 新增单据编号规则
export function createCodeBuildRule(data) {
  return defHttp.post({ url: '/system/code-build-rule/create', data });
}

// 修改单据编号规则
export function updateCodeBuildRule(data) {
  return defHttp.put({ url: '/system/code-build-rule/update', data });
}

// 删除单据编号规则
export function deleteCodeBuildRule(id: number) {
  return defHttp.delete({ url: '/system/code-build-rule/delete?id=' + id });
}

// 导出单据编号规则 Excel
export function exportCodeBuildRule(params) {
  return defHttp.download(
    { url: '/system/code-build-rule/export-excel', params },
    '单据编号规则.xls',
  );
}
