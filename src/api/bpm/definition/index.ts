import { defHttp } from '/@/utils/http/axios';

// 表单API
export enum BpmDefinitionApi {
  DefinitionBpmnXML = '/bpm/process-definition/get-bpmn-xml',
  DefinitionPage = '/bpm/process-definition/page',
  DefinitionList = '/bpm/process-definition/list',
}

export const getProcessDefinitionBpmnXML = async (id: number) => {
  const requestParams = { url: BpmDefinitionApi.DefinitionBpmnXML, params: { id } };
  return defHttp.get<any>(requestParams, {});
};

export const getProcessDefinitionPage = async (params) => {
  const requestParams = { url: BpmDefinitionApi.DefinitionPage, params };
  return defHttp.get<any>(requestParams, {});
};

export const getProcessDefinitionList = async (params) => {
  const requestParams = { url: BpmDefinitionApi.DefinitionList, params };
  return defHttp.get<any>(requestParams, {});
};
