export type InfoType = 'success' | 'info' | 'warning' | 'danger';

export enum DICT_TYPE {
  // ========== BPM 模块 ==========
  BPM_MODEL_CATEGORY = 'bpm_model_category',
  BPM_MODEL_FORM_TYPE = 'bpm_model_form_type',
  BPM_TASK_ASSIGN_RULE_TYPE = 'bpm_task_assign_rule_type',
  BPM_PROCESS_INSTANCE_STATUS = 'bpm_process_instance_status',
  BPM_PROCESS_INSTANCE_RESULT = 'bpm_process_instance_result',
  BPM_TASK_ASSIGN_SCRIPT = 'bpm_task_assign_script',
  BPM_OA_LEAVE_TYPE = 'bpm_oa_leave_type',
}

export interface DictDataType {
  dictType: string;
  label: string;
  value: string | number | boolean;
  colorType: InfoType | '';
  cssClass: string;
}

// 获取流程分类数据字典
export const getDictTypeWflow = () => {
  const type = JSON.parse(
    `[{"value":1,"label":"默认","colorType":"primary","cssClass":""},{"value":2,"label":"OA","colorType":"success","cssClass":""}]`,
  );
  return type;
};

// 获取表单类型数据字典
export const getBpmModelFormType = () => {
  const type = JSON.parse(
    `[{"dictType": "bpm_model_form_type","value": "10","label": "流程表单","colorType": "","cssClass": ""},{"dictType": "bpm_model_form_type","value": "20","label": "业务表单","colorType": "","cssClass": ""}]`,
  );
  return type;
};

//
export const getIntDictOptions = () => {
  return null;
};
