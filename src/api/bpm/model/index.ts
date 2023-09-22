// import request from '@/config/axios'

export type ProcessDefinitionVO = {
  id: string
  version: number
  deploymentTIme: string
  suspensionState: number
}

// √
export type ModelVO = {
  id: number
  formName: string
  key: string
  name: string
  description: string
  category: string
  formType: number
  formId: number
  formCustomCreatePath: string
  formCustomViewPath: string
  processDefinition: ProcessDefinitionVO
  status: number
  remark: string
  createTime: string
  bpmnXml: string
}

// export const getModelPage = async (params) => {
//   return await request.get({ url: '/bpm/model/page', params })
// }

// √
export const getModel = async (id: number) => {
  // TODO url: '/bpm/model/get?id=' + id
}

// √
export const updateModel = async (data: ModelVO) => {
  // TODO url: '/bpm/model/update'
}

// 任务状态修改
// export const updateModelState = async (id: number, state: number) => {
//   const data = {
//     id: id,
//     state: state
//   }
//   return await request.put({ url: '/bpm/model/update-state', data: data })
// }

// √
export const createModel = async (data: ModelVO) => {
  // TODO url: '/bpm/model/create'
}

// export const deleteModel = async (id: number) => {
//   return await request.delete({ url: '/bpm/model/delete?id=' + id })
// }

// export const deployModel = async (id: number) => {
//   return await request.post({ url: '/bpm/model/deploy?id=' + id })
// }
