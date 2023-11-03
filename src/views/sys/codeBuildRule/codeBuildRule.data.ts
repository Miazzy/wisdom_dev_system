import { BasicColumn, FormSchema, useRender } from '@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '编码',
    dataIndex: 'code',
    width: 160,
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 160,
  },
  {
    title: '规则',
    dataIndex: 'rule',
    width: 160,
  },
  {
    title: '当前值',
    dataIndex: 'currentValue',
    width: 160,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 8 },
  },
];
