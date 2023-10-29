import { assign, forEach } from 'min-dash';
import { useRender } from '@/components/Table';

const bpmProcessInstanceResult = [
  {
    dictType: 'bpm_process_instance_result',
    value: '1',
    label: '处理中',
    colorType: 'primary',
    cssClass: '',
  },
  {
    dictType: 'bpm_process_instance_result',
    value: '2',
    label: '通过',
    colorType: 'success',
    cssClass: '',
  },
  {
    dictType: 'bpm_process_instance_result',
    value: '3',
    label: '不通过',
    colorType: 'danger',
    cssClass: '',
  },
  {
    dictType: 'bpm_process_instance_result',
    value: '4',
    label: '已取消',
    colorType: 'info',
    cssClass: '',
  },
  {
    dictType: 'bpm_process_instance_result',
    value: '5',
    label: '已终止',
    colorType: 'info',
    cssClass: '',
  },
  {
    dictType: 'bpm_process_instance_result',
    value: '6',
    label: '退回/驳回',
    colorType: 'info',
    cssClass: '',
  },
];

const bpmModelCategory = [
  {
    dictType: 'bpm_model_category',
    value: '1',
    label: '默认',
    colorType: 'primary',
    cssClass: '',
  },
  {
    dictType: 'bpm_model_category',
    value: '2',
    label: 'OA',
    colorType: 'success',
    cssClass: '',
  },
];

const bpmProcessInstanceStatus = [
  {
    dictType: 'bpm_process_instance_status',
    value: '1',
    label: '进行中',
    colorType: 'primary',
    cssClass: '',
  },
  {
    dictType: 'bpm_process_instance_status',
    value: '2',
    label: '已完成',
    colorType: 'success',
    cssClass: '',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '流程名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '所属流程',
    field: 'processDefinitionId',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '流程分类',
    field: 'category',
    component: 'Select',
    componentProps: {
      options: bpmModelCategory,
    },
    colProps: { span: 8 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'Select',
    componentProps: {
      options: bpmProcessInstanceStatus,
    },
    colProps: { span: 8 },
  },
  {
    label: '结果',
    field: 'result',
    component: 'Select',
    componentProps: {
      options: bpmProcessInstanceResult,
    },
    colProps: { span: 8 },
  },
  {
    label: '提交时间',
    field: 'createTime',
    component: 'RangePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'x',
    },
    colProps: { span: 8 },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '流程编号',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '流程名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '流程分类',
    dataIndex: 'category',
    width: 200,
    customRender: ({ text }) => {
      return getTypeObj('bpmModelCategory', text)['label'];
      //return useRender.renderDict(text, DICT_TYPE.BPM_OA_LEAVE_TYPE);
    },
  },
  {
    title: '当前审批任务',
    dataIndex: 'tasks',
    width: 100,
    customRender: ({ record }) => {
      const tasks = record.tasks;
      if (tasks != null && tasks.length > 0) {
        return tasks[0].name;
      }
      return '';
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      return getTypeObj('bpmProcessInstanceStatus', text)['label'];
      // return useRender.renderDict(text, 'bpmProcessInstanceStatus');
    },
  },
  {
    title: '结果',
    dataIndex: 'result',
    width: 100,
    customRender: ({ text }) => {
      return getTypeObj('bpmProcessInstanceResult', text)['label'];
      // return useRender.renderDict(text, 'bpmProcessInstanceResult');
    },
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 200,
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: 200,
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
];

export function getTypeObj(dictType: string, type: any) {
  const obj = {};
  if (dictType == 'bpmModelCategory') {
    forEach(bpmModelCategory, function (def) {
      if (def.value === type.toString()) {
        assign(obj, def);
      }
    });
  } else if (dictType == 'bpmProcessInstanceStatus') {
    forEach(bpmProcessInstanceStatus, function (def) {
      if (def.value === type.toString()) {
        assign(obj, def);
      }
    });
  } else if (dictType == 'bpmProcessInstanceResult') {
    forEach(bpmProcessInstanceResult, function (def) {
      if (def.value === type.toString()) {
        assign(obj, def);
      }
    });
  }
  return obj;
}
