import { defHttp } from '/@/utils/http/axios';
import { BasicColumn, FormSchema } from '@/components/Table';
import { formatDate } from '/@/utils/dateUtil';

enum Api {
  page = '/bpm/model/page',
}

export const getPage = (params: ParamsType) => {
  return defHttp.get<any>({
    url: Api.page,
    params,
  });
};

// 获取流程表格列表数据
export const getTableDataWflow = (queryParams) => {
  return getPage(queryParams);
};

export type ParamsType = {
  pageNo: number;
  pageSize: number;
  key: undefined | string;
  name: undefined | string;
  category: undefined | string;
};

const categorys = [
  { value: '1', label: '默认' },
  { value: '2', label: 'OA' },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: `key`,
    label: `流程标识`,
    component: 'Input',
    componentProps: { placeholder: '请输入流程标识' },
    colProps: { span: 6 },
  },
  {
    field: `name`,
    label: `流程名称`,
    component: 'Input',
    componentProps: { placeholder: '请输入流程名称' },
    colProps: { span: 6 },
  },
  {
    field: `category`,
    label: `流程分类`,
    component: 'Select',
    componentProps: {
      options: categorys,
    },
    colProps: { span: 6 },
  },
];

export const columns: BasicColumn[] = [
  { title: '流程标识', dataIndex: 'key', width: 200 },
  { title: '流程名称', dataIndex: 'name', width: 150 },
  {
    title: '流程分类',
    dataIndex: 'category',
    width: 80,
  },
  { title: '表单信息', dataIndex: 'formCustomCreatePath', width: 260 },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 100,
    customRender: ({ record }) => {
      return formatDate(record.createTime, 'YYYY-MM-DD');
    },
  },
  {
    title: '最新部署的流程定义',
    dataIndex: '',
    children: [
      {
        title: '流程版本',
        dataIndex: 'version',
        width: 80,
      },
      {
        title: '激活状态',
        dataIndex: 'suspensionState',
        width: 80,
      },
      {
        title: '部署时间',
        dataIndex: 'deploymentTime',
        width: 100,
        customRender: ({ record }) => {
          if (record.processDefinition) {
            return formatDate(record.processDefinition.deploymentTime, 'YYYY-MM-DD');
          }
          return '';
        },
      },
    ],
  },
];
