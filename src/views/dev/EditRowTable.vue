<template>
  <div class="p-4">
    <BasicTable @register="registerTable" @edit-change="onEditChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record)" />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '/@/components/Table';
  import { DICT_TYPE } from '@/utils/dict';
  import { cloneDeep } from 'lodash-es';
  import type { TreeSelectProps } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { setCustomCompOptions } from '@/utils/cache';

  const treeData = ref([]);
  const currentEditNodeRef = ref();
  const searchBoxColumns = [
    { title: '类型', dataIndex: 'typeName', key: 'typeName', fixed: 'left', minWidth: 100 },
    { title: '年份', dataIndex: 'year', key: 'year', fixed: 'left', minWidth: 100 },
    { title: '月份', dataIndex: 'month', key: 'month', fixed: 'left', minWidth: 100 },
    { title: '期间', dataIndex: 'date', key: 'date', minWidth: 150 },
  ];
  const searchBoxData = [
    { typeName: '财务部类型', year: '2020', month: '01', date: '2020-01' },
    { typeName: '财务部类型', year: '2020', month: '02', date: '2020-02' },
    { typeName: '市场部类型', year: '2020', month: '03', date: '2020-03' },
    { typeName: '财务部类型', year: '2020', month: '04', date: '2020-04' },
    { typeName: '市场部类型', year: '2020', month: '05', date: '2020-05' },
    { typeName: '财务部类型', year: '2020', month: '06', date: '2020-06' },
    { typeName: '市场部类型', year: '2020', month: '07', date: '2020-07' },
    { typeName: '华南部类型', year: '2020', month: '08', date: '2020-08' },
    { typeName: '西北部类型', year: '2020', month: '09', date: '2020-09' },
    { typeName: '华东部类型', year: '2020', month: '10', date: '2020-10' },
    { typeName: '商务部类型', year: '2020', month: '11', date: '2020-11' },
    { typeName: '研发部类型', year: '2020', month: '12', date: '2020-12' },
    { typeName: '财务部类型', year: '2021', month: '01', date: '2021-01' },
    { typeName: '研发部类型', year: '2021', month: '02', date: '2021-02' },
    { typeName: '财务部类型', year: '2021', month: '03', date: '2021-03' },
    { typeName: '市场部类型', year: '2021', month: '04', date: '2021-04' },
  ];
  const searchBoxColumns1 = [
    { title: '名称', dataIndex: 'name', key: 'name', fixed: 'left', minWidth: 100 },
    { title: '公司名称', dataIndex: 'orgName', key: 'orgName', fixed: 'left', minWidth: 100 },
    { title: '时期', dataIndex: 'period', key: 'period', fixed: 'left', minWidth: 100 },
    { title: '电站名称', dataIndex: 'shortName', key: 'shortName', fixed: 'left', minWidth: 100 },
  ];
  const searchBoxData1 = [
    { name: '名称0', orgName: '公司名称0', period: '时期0', shortName: '电站名称0' },
    { name: '名称1', orgName: '公司名称1', period: '时期1', shortName: '电站名称1' },
    { name: '名称2', orgName: '公司名称2', period: '时期2', shortName: '电站名称2' },
  ];

  const columns: BasicColumn[] = [
    {
      title: '输入框',
      dataIndex: 'name-group',
      editRow: true,
      children: [
        {
          title: '输入框',
          dataIndex: 'name',
          editRow: true,
          editComponent: 'DictSelectBox',
          editComponentProps: {
            type: DICT_TYPE.CERTIFICATE,
            callback: (value, node, options) => {
              currentEditNodeRef.value; // currentEditNodeRef 此变量的定义要放在前面
            },
          },
          width: 150,
        },
        {
          title: '默认输入状态',
          dataIndex: 'name1',
          editRow: true,
          editComponent: 'SearchBox',
          editComponentProps: {
            opkey: 'SearchBox123',
            twidth: '600px',
            api: `/baseset/powerstation/page?name={name}&pageNo={current}&pageSize={pageSize}`,
            multiple: false,
            callback: (options) => {
              currentEditNodeRef.value; // currentEditNodeRef 此变量的定义要放在前面
            },
          },
          width: 150,
        },
        {
          title: '输入框校验',
          dataIndex: 'name2',
          editRow: true,
          align: 'left',
          editComponent: 'TreeSelectBox',
          editComponentProps: {
            opkey: 'TreeSelectBox123',
            twidth: 500,
            callback: (value, node) => {
              currentEditNodeRef.value; // currentEditNodeRef 此变量的定义要放在前面
            },
          },
          width: 150,
        },
        {
          title: '输入框校验',
          dataIndex: 'name3',
          editRow: true,
          align: 'left',
          editComponent: 'TreeBox',
          editComponentProps: {
            opkey: 'TreeBox123',
            twidth: '500px',
            callback: (node, event) => {
              currentEditNodeRef.value; // currentEditNodeRef 此变量的定义要放在前面
            },
          },
          width: 150,
        },
        {
          title: '输入框校验',
          dataIndex: 'name4',
          editRow: true,
          align: 'left',
          editComponent: 'SelectBox',
          editComponentProps: {
            data: [
              { vvv: '01', label: 'Lucy01' },
              { vvv: '02', label: 'Lucy02' },
            ],
            twidth: '500px',
            tfields: { label: 'label', value: 'vvv' },
            callback: (value, options) => {
              currentEditNodeRef.value; // currentEditNodeRef 此变量的定义要放在前面
            },
          },
          width: 150,
        },
        {
          title: '输入框校验',
          dataIndex: 'name5',
          editRow: true,
          editComponent: 'CascaderBox',
          editComponentProps: {
            data: [
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                  {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                    children: [
                      {
                        value: 'xihu',
                        label: 'West Lake',
                      },
                    ],
                  },
                ],
              },
              {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [
                  {
                    value: 'nanjing',
                    label: 'Nanjing',
                    children: [
                      {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                      },
                    ],
                  },
                ],
              },
            ],
            twidth: '500px',
            tfields: { label: 'label', value: 'value', children: 'children' },
            callback: (value, options) => {
              currentEditNodeRef.value; // currentEditNodeRef 此变量的定义要放在前面
            },
          },
          width: 150,
        },
      ],
    },
  ];

  const searchFormSchema: any = {
    labelWidth: 100,
    actionColOptions: {
      span: 24,
    },
    autoAdvancedLine: 4,
    showAdvancedButton: true,
    baseColProps: {
      span: 6,
    },
    schemas: [
      {
        field: `SelectBox`,
        label: `SelectBox`,
        component: 'SelectBox',
        componentProps: {
          data: [
            { vvv: '01', label: 'Lucy01' },
            { vvv: '02', label: 'Lucy02' },
          ],
          twidth: '100%',
          tfields: { label: 'label', value: 'vvv' },
        },
      },
      {
        field: `SelectBoxM`,
        label: `SelectBoxMultiple`,
        component: 'SelectBox',
        defaultValue: [],
        componentProps: {
          data: [
            { vvv: '01', label: 'Multiple01' },
            { vvv: '02', label: 'Multiple02' },
            { vvv: '03', label: 'Multiple03' },
            { vvv: '04', label: 'Multiple04' },
            { vvv: '05', label: 'Multiple05' },
            { vvv: '06', label: 'Multiple06' },
          ],
          multiple: true,
          twidth: '100%',
          tfields: { label: 'label', value: 'vvv' },
        },
      },
      {
        field: 'SearchBox0',
        label: '单选SearchBox',
        component: 'SearchBox',
        componentProps: {
          opkey: 'SearchBox123',
          twidth: '600px',
          api: `/baseset/powerstation/page?name={name}&pageNo={current}&pageSize={pageSize}`,
          multiple: false,
        },
        width: 150,
      },
      {
        field: 'SearchBox1',
        label: '多选SearchBox',
        component: 'SearchBox',
        componentProps: {
          opkey: 'SearchBox123',
          twidth: '600px',
          api: '/baseset/powerstation/page?name={name}&pageNo={current}&pageSize={pageSize}',
          multiple: true,
        },
        width: 150,
      },
      {
        field: 'SearchBox2',
        label: '本地SearchBox',
        component: 'SearchBox',
        componentProps: {
          opkey: 'SearchBox1234',
          twidth: '600px',
          multiple: false,
        },
        width: 150,
      },
      {
        field: 'SearchBox3',
        label: '本地SearchBox',
        component: 'SearchBox',
        componentProps: {
          opkey: 'SearchBox1234',
          twidth: '600px',
          multiple: true,
        },
        width: 150,
      },
      {
        field: `DictSelectBox`,
        label: `DictSelectBox`,
        component: 'DictSelectBox',
        componentProps: {
          type: DICT_TYPE.CERTIFICATE,
        },
      },
      {
        field: `DictSelectBoxM`,
        label: `DictSelectBoxM`,
        component: 'DictSelectBox',
        defaultValue: [],
        componentProps: {
          multiple: 'multiple',
          type: DICT_TYPE.CERTIFICATE,
        },
      },
      {
        field: 'TreeSelectBox',
        label: 'TreeSelectBox',
        component: 'TreeSelectBox',
        componentProps: {
          opkey: 'TreeSelectBox123',
          twidth: '500px',
        },
        width: 150,
      },
      {
        field: 'TreeBox',
        label: 'TreeBox',
        component: 'TreeBox',
        componentProps: {
          opkey: 'TreeBox123',
          twidth: '500px',
        },
        width: 150,
      },
      {
        field: 'CascaderBox',
        label: 'CascaderBox',
        component: 'CascaderBox',
        componentProps: {
          data: [
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [
                {
                  value: 'hangzhou',
                  label: 'Hangzhou',
                  children: [
                    {
                      value: 'xihu',
                      label: 'West Lake',
                    },
                  ],
                },
              ],
            },
            {
              value: 'jiangsu',
              label: 'Jiangsu',
              children: [
                {
                  value: 'nanjing',
                  label: 'Nanjing',
                  children: [
                    {
                      value: 'zhonghuamen',
                      label: 'Zhong Hua Men',
                    },
                  ],
                },
              ],
            },
          ],
          twidth: '100%',
          tfields: { label: 'label', value: 'value', children: 'children' },
        },
        width: 150,
      },
    ],
  };

  export default defineComponent({
    components: { BasicTable, TableAction },
    setup() {
      const { createMessage: msg } = useMessage();
      const currentEditKeyRef = ref('');
      const tableData = ref([]);
      tableData.value = JSON.parse(
        '[{"id":"0","beginTime":"2003-06-11 17:12:49","endTime":"2014-12-08 19:37:57","address":"湖州市","name":"锺秀兰","name1":"熊杰","name2":"谢秀英","name3":"胡涛","name4":"金霞","name5":"雷洋","name6":"金刚","name7":"常明","name8":"邹磊","radio1":"选项1","radio2":"选项1","radio3":"选项1","avatar":"http://dummyimage.com/400x400/f29b79/797af2&text=Robert","imgArr":["http://dummyimage.com/800x600/9df279/f279c1&text=Lspnfrll Skujf Sbixp Ncmvbpu Rqxs","http://dummyimage.com/800x600/79e4f2/f2dc79&text=Iyxke Dxikdmx Hmklfcuev","http://dummyimage.com/800x600/b979f2/79f295&text=Fjchacoa Whnzynkmu Gvwxtls Dsrvzip","http://dummyimage.com/800x600/f2797f/79a2f2&text=Ofpssal Hdapoynj Lbrw Cgnujolgil Vxyjqwqf"],"imgs":["http://dummyimage.com/800x600/c6f279/f279e9&text=Hycceh Vjwjtlvea Lhuskpi Bhkov Sijtv Bkddivet Qgsz","http://dummyimage.com/800x600/79f2d7/f2b479&text=Fpzo Eiedud Mbteluc Vnojpyq Tnmygk","http://dummyimage.com/800x600/9079f2/84f279&text=Ifoybd Jtbyt Tzyq"],"date":"2005-11-06","time":"10:53","no":9399405,"status":"disable"},{"id":"1","beginTime":"1984-06-25 13:32:00","endTime":"1996-12-20 20:04:03","address":"鄂尔多斯市","name":"黄超","name1":"郭涛","name2":"苏静","name3":"史杰","name4":"熊敏","name5":"谭秀兰","name6":"丁霞","name7":"潘洋","name8":"林平","radio1":"选项2","radio2":"选项2","radio3":"选项2","avatar":"http://dummyimage.com/400x400/f279a8/79cbf2&text=Dorothy","imgArr":["http://dummyimage.com/800x600/eef279/d279f2&text=Xigdkmxw Srwcbpqlle Wuowha Bvfssum Ftmx Pxfkkrv","http://dummyimage.com/800x600/79f2ae/f28b79&text=Xmpf Oglpxjv Hreofedzm Hbjt Mlirro Oyqxfwluz","http://dummyimage.com/800x600/7989f2/adf279&text=Xqmyntgx Trqmhv Mpxbzekquh Mhmpevfitg","http://dummyimage.com/800x600/f279d0/79f2f0&text=Crpef Rnimjaykm Lmvj Yktgqcxfc Oyweg"],"imgs":["http://dummyimage.com/800x600/f2cd79/a979f2&text=Ohol Feqvqfgw Phgqmbn","http://dummyimage.com/800x600/79f286/f2798f&text=Elenucj Xpha Qdfgiys Fyjxcwkfe Ourlij","http://dummyimage.com/800x600/79b2f2/d5f279&text=Ywlwln Piqjsk Lofqgeslfn Qfyh Yso Rjaorfhdo"],"date":"1972-04-25","time":"01:32","no":4140132,"status":"disable"},{"id":"2","beginTime":"1975-10-27 15:29:03","endTime":"1971-10-20 23:56:12","address":"广州市","name":"魏涛","name1":"林杰","name2":"侯霞","name3":"马秀英","name4":"萧强","name5":"康秀兰","name6":"郝桂英","name7":"许刚","name8":"赵秀英","radio1":"选项3","radio2":"选项3","radio3":"选项3","avatar":"http://dummyimage.com/400x400/eb79f2/79f2c8&text=William","imgArr":["http://dummyimage.com/800x600/f2a479/8179f2&text=Kbhktnr Pyfxb Bflbsna Azfnf Qsubjjngq Wxknowixm Hhrzn","http://dummyimage.com/800x600/94f279/f279b7&text=Pqyy Rgyouqtjys Nwtjur Tmgcjh Rvzpk Dimy","http://dummyimage.com/800x600/79daf2/f2e679&text=Jkrbtxd Vmpwi Summ Ihtumipb","http://dummyimage.com/800x600/c279f2/79f29f&text=Ohcmo Wuq Xevfqqbiy Vizkk Vcp Hmst"],"imgs":["http://dummyimage.com/800x600/f27c79/7999f2&text=Ecsjua Ocyira Feshmc Vmwbcq Zqbjpu Ivwhaatf","http://dummyimage.com/800x600/bcf279/f279e0&text=Cgwhkjykx Ebs Dovrx Vhpwkxwys","http://dummyimage.com/800x600/79f2e1/f2bd79&text=Qvqwslowe Yydl Qspl Esbirwcv Akzdn Jein Qgkyjyjev"],"date":"2011-10-10","time":"00:47","no":2562536,"status":"enable"},{"id":"3","beginTime":"2017-07-05 23:17:12","endTime":"1993-03-30 00:05:08","address":"重庆市","name":"刘芳","name1":"常勇","name2":"林刚","name3":"赵桂英","name4":"常丽","name5":"贾秀兰","name6":"汤磊","name7":"金秀兰","name8":"吕洋","radio1":"选项4","radio2":"选项4","radio3":"选项4","avatar":"http://dummyimage.com/400x400/9a79f2/7bf279&text=Brian","imgArr":["http://dummyimage.com/800x600/f2799e/79c1f2&text=Dfpkinmtw Urrq Aqwynmebm Qqjkncq Vihpmxijp","http://dummyimage.com/800x600/e5f279/db79f2&text=Iuzjbniu Jif Mvauwmzgd"],"imgs":["http://dummyimage.com/800x600/79f2b8/f29579&text=Xqixeedqu Pgnwhy Qgjmzuos Ypiwktrsu Kytyynhqsr Gosqgklay Mfqnducr","http://dummyimage.com/800x600/7980f2/a3f279&text=Pifgvj Usrjtq Ukojd Yvcuwd Pekay Chup","http://dummyimage.com/800x600/f279c7/79eaf2&text=Flwqxgusk Hiwliu Sqipgusir Clfk"],"date":"2023-01-26","time":"02:31","no":871498,"status":"disable"}]',
      );

      const [registerTable] = useTable({
        title: '可编辑行示例',
        titleHelpMessage: [
          '本例中修改[数字输入框]这一列时，同一行的[远程下拉]列的当前编辑数据也会同步发生改变',
        ],
        columns: columns,
        formConfig: searchFormSchema,
        useSearchForm: true,
        showIndexColumn: false,
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        actionColumn: {
          width: 160,
          title: 'Action',
          dataIndex: 'action',
        },
        dataSource: tableData,
      });

      function handleEdit(record: EditRecordRow) {
        try {
          if (Reflect.has(currentEditKeyRef, 'value')) {
            currentEditKeyRef.value = record.key;
            currentEditNodeRef.value = record;
            record.onEdit?.(true);
          }
        } catch (error) {
          //
        }
      }

      function handleCancel(record: EditRecordRow) {
        try {
          if (Reflect.has(currentEditKeyRef, 'value')) {
            currentEditKeyRef.value = '';
            record.onEdit?.(false, false);
          }
        } catch (error) {
          //
        }
      }

      async function handleSave(record: EditRecordRow) {
        msg.loading({ content: '正在保存...', duration: 0, key: 'saving' });
        const valid = await record.onValid?.();
        if (valid) {
          try {
            const data = cloneDeep(record.editValueRefs);
            console.log(data);
            // 保存之后提交编辑状态
            const pass = await record.onEdit?.(false, true);
            if (pass) {
              currentEditKeyRef.value = '';
            }
            msg.success({ content: '数据已保存', key: 'saving' });
          } catch (error) {
            msg.error({ content: '保存失败', key: 'saving' });
          }
        } else {
          msg.error({ content: '请填写正确的数据', key: 'saving' });
        }
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        if (!record.editable) {
          return [
            {
              label: '编辑',
              disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
              onClick: handleEdit.bind(null, record),
            },
          ];
        }
        return [
          {
            label: '保存',
            onClick: handleSave.bind(null, record),
          },
          {
            label: '取消',
            popConfirm: {
              title: '是否取消编辑',
              confirm: handleCancel.bind(null, record),
            },
          },
        ];
      }

      function onEditChange({ column, value, record }) {
        // 本例
        if (column.dataIndex === 'id') {
          record.editValueRefs.name4.value = `${value}`;
        }
        console.log(column, value, record);
      }

      // 查询左侧电站树数据
      function queryDeptTreeList() {
        const result = JSON.parse(
          `{"code":0,"result":[{"orgId":"AABAB68C2D0440ADA0A52AE93B9508A0","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFJLTYYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/AABAB68C2D0440ADA0A52AE93B9508A0.dpt","name":"吉林通榆","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"AABAB68C2D0440ADA0A52AE93B9508A0","nodeName":"吉林通榆","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"BC583036CFFA4EB3AE4ECCC21E57F682","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFJSRDYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/BC583036CFFA4EB3AE4ECCC21E57F682.dpt","name":"江苏如东","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"station","stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"BC583036CFFA4EB3AE4ECCC21E57F682","nodeName":"江苏如东","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"jzsnbq","categoryName":null,"typeName":"jzsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"7e14c133613b443590005078554bb797x","nodeName":"gfq-cateGory","nodeType":"category","typeSort":null,"categorySort":1,"typeCode":"gfq","children":[{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"zcsnbq","categoryName":"gfq","typeName":"zcsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"0d76f0a575a94fa599f63d8eb1a4283f","nodeName":"zcsnbq-type","nodeType":"type","typeSort":1,"categorySort":null,"typeCode":"zcsnbq","children":[]},{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"jzsnbq","categoryName":"gfq","typeName":"jzsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"7e14c133613b443590005078554bb797a","nodeName":"jzsnbq-type-child","nodeType":"type","typeSort":2,"categorySort":null,"typeCode":"jzsnbq","children":[]}]}]},{"orgId":"HZ93a0a35fd71b32015fd849228c100a","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFSDZBYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a35fd71b32015fd849228c100a.dpt","name":"山东高青","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a35fd71b32015fd849228c100a","nodeName":"山东高青","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"HZ93a0a36120d1490161260327b63ea4","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"SDPD","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a36120d1490161260327b63ea4.dpt","name":"山东平度","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a36120d1490161260327b63ea4","nodeName":"山东平度","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"HZ93a0a367e001980167e84d6e2962a4","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"tjdgyyz","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a367e001980167e84d6e2962a4.dpt","name":"天津大港","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a367e001980167e84d6e2962a4","nodeName":"天津大港","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]}],"message":""}`,
        );
        const list = result.result as never[];
        treeData.value = list;
      }

      queryDeptTreeList();
      const options = {
        columns: searchBoxColumns1,
        pagination: true, // false 关闭分页   true 开启分页
        tfields: { key: 'name' },
        vfield: 'name',
      };
      const localSearchBoxOptions = {
        columns: searchBoxColumns1,
        data: searchBoxData1,
        pagination: false, // false 关闭分页   true 开启分页
        tfields: { key: 'name' },
        vfield: 'name',
      };
      const treeOptions = {
        data: treeData.value,
        tfields: { key: 'nodeId', title: 'nodeName' },
      };
      const treeSelectOptions = {
        data: treeData.value,
        tfields: { value: 'nodeId', label: 'nodeName', children: 'children' },
      };
      setCustomCompOptions('SearchBox123', options);
      setCustomCompOptions('SearchBox1234', localSearchBoxOptions);
      setCustomCompOptions('TreeBox123', treeOptions);
      setCustomCompOptions('TreeSelectBox123', treeSelectOptions);

      return {
        registerTable,
        handleEdit,
        createActions,
        onEditChange,
      };
    },
  });
</script>
