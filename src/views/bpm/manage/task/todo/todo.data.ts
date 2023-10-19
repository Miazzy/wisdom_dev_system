import { useRender } from '@/components/Table';

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
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
  {
    title: '状态',
    dataIndex: 'suspensionState',
    width: 100,
    customRender: ({ text }) => {
      if (text === 1) {
        return '激活';
      } else if (text === 2) {
        return '挂起';
      }
      return '';
    },
  },
];
