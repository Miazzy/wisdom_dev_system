import { assign, forEach } from 'min-dash';
import { useRender } from '@/components/Table';
import { formatPast2 } from '@/utils/dateUtil';

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

export const searchFormSchema: FormSchema[] = [
  {
    label: '任务名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '创建时间',
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
    title: '任务编号',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '所属流程',
    dataIndex: 'processInstance.name',
    width: 200,
    customRender: ({ record }) => {
      return record.processInstance.name;
    },
  },
  {
    title: '流程发起人',
    dataIndex: 'processInstance.startUserNickname',
    width: 100,
    customRender: ({ record }) => {
      return record.processInstance.startUserNickname;
    },
  },
  {
    title: '结果',
    dataIndex: 'result',
    width: 100,
    customRender: ({ text }) => {
      return getTypeObj('bpmProcessInstanceResult', text)['label'];
      // return useRender.renderDict(text, 'bpmProcessInstanceStatus');
    },
  },
  {
    title: '审批意见',
    dataIndex: 'reason',
    width: 180,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
  {
    title: '审批时间',
    dataIndex: 'endTime',
    width: 180,
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
  {
    title: '耗时',
    dataIndex: 'durationInMillis',
    width: 180,
    customRender: ({ text }) => {
      return formatPast2(text);
    },
  },
];

export function getTypeObj(dictType: string, type: any) {
  const obj = {};
  if (dictType == 'bpmProcessInstanceResult') {
    forEach(bpmProcessInstanceResult, function (def) {
      if (def.value === type.toString()) {
        assign(obj, def);
      }
    });
  }
  return obj;
}
