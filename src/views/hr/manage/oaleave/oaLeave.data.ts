import { assign, forEach } from 'min-dash';
import type { DescItem } from '@/components/Description';
import type { BasicColumn, FormSchema } from '@/components/Table';
import { useRender } from '@/components/Table';

const oaLeaveTypeOptions = [
  {
    dictType: 'bpm_oa_leave_type',
    value: '1',
    label: '病假',
    colorType: 'primary',
    cssClass: '',
  },
  {
    dictType: 'bpm_oa_leave_type',
    value: '2',
    label: '事假',
    colorType: 'info',
    cssClass: '',
  },
  {
    dictType: 'bpm_oa_leave_type',
    value: '3',
    label: '婚假',
    colorType: 'warning',
    cssClass: '',
  },
];

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
];

export const columns: BasicColumn[] = [
  {
    title: '申请编号',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      return getInstanceResult(text)['label'];
      //return useRender.renderDict(text, DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT);
    },
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    width: 120,
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: 120,
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
  {
    title: '请假类型',
    dataIndex: 'type',
    width: 150,
    customRender: ({ text }) => {
      return getTypeObj(text)['label'];
      //return useRender.renderDict(text, DICT_TYPE.BPM_OA_LEAVE_TYPE);
    },
  },
  {
    title: '原因',
    dataIndex: 'reason',
    width: 180,
  },
  {
    title: '申请时间',
    dataIndex: 'fillinDate',
    width: 120,
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '请假类型',
    field: 'type',
    component: 'Select',
    componentProps: {
      // options: getDictOptions(DICT_TYPE.BPM_OA_LEAVE_TYPE),
      options: oaLeaveTypeOptions,
    },
    colProps: { span: 8 },
  },
  {
    label: '申请时间',
    field: 'createTime',
    component: 'RangePicker',
    colProps: { span: 8 },
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'x',
    },
  },
  {
    label: '结果',
    field: 'result',
    component: 'Select',
    componentProps: {
      options: bpmProcessInstanceResult,
      //options: getDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT),
    },
    colProps: { span: 8 },
  },
  {
    label: '原因',
    field: 'reason',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    label: '请假类型',
    field: 'type',
    required: true,
    component: 'Select',
    componentProps: {
      // options: getDictOptions(DICT_TYPE.BPM_OA_LEAVE_TYPE),
      options: oaLeaveTypeOptions,
    },
  },
  {
    label: '开始时间',
    field: 'startTime',
    required: true,
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'x',
    },
  },
  {
    label: '结束时间',
    field: 'endTime',
    required: true,
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'x',
    },
  },
  {
    label: '原因',
    field: 'reason',
    required: true,
    component: 'Input',
  },
];

export const descSchema: DescItem[] = [
  {
    label: '请假类型',
    field: 'merchantOrderId',
    render: (curVal) => {
      return useRender.renderTag(curVal);
    },
  },
  {
    label: '开始时间',
    field: 'startTime',
    render: (curVal) => {
      return useRender.renderDate(curVal, 'YYYY-MM-DD');
    },
  },
  {
    label: '结束时间',
    field: 'endTime',
    render: (curVal) => {
      return useRender.renderDate(curVal, 'YYYY-MM-DD');
    },
  },
  {
    label: '原因',
    field: 'reason',
  },
];

export function getInstanceResult(value: any) {
  const obj = {};
  forEach(bpmProcessInstanceResult, function (def) {
    if (def.value === value.toString()) {
      assign(obj, def);
    }
  });
  return obj;
}

export function getTypeObj(type: any) {
  const obj = {};
  forEach(oaLeaveTypeOptions, function (def) {
    if (def.value === type.toString()) {
      assign(obj, def);
    }
  });
  return obj;
}

export function getTypeOption(type: any) {
  const obj = {};
  forEach(oaLeaveTypeOptions, function (def) {
    if (def.label === type.toString()) {
      assign(obj, def);
    }
  });
  return obj;
}
