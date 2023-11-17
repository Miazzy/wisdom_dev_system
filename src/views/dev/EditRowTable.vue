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
  const searchBoxColumns = [
    { title: '类型', dataIndex: 'typeName', key: 'typeName', fixed: 'left', minWidth: 100 },
    { title: '年份', dataIndex: 'year', key: 'year', fixed: 'left', minWidth: 100 },
    { title: '月份', dataIndex: 'month', key: 'month', fixed: 'left', minWidth: 100 },
    { title: '期间', dataIndex: 'date', key: 'date', minWidth: 150 },
  ];
  const searchBoxData = [
    { typeName: '财务部类型-吉林通榆', year: '2020', month: '06', date: '2020-06' },
    { typeName: '市场部类型-吉林通榆', year: '2020', month: '07', date: '2020-07' },
    { typeName: '华南分部类型-江苏如东', year: '2020', month: '08', date: '2020-08' },
    { typeName: '西北分部类型-吉林通榆', year: '2020', month: '09', date: '2020-09' },
    { typeName: '华东分部类型-吉林通榆', year: '2020', month: '10', date: '2020-10' },
    { typeName: '商务部类型-江苏如东', year: '2020', month: '11', date: '2020-11' },
    { typeName: '研发部类型', year: '2020', month: '12', date: '2020-12' },
    { typeName: '财务部类型', year: '2021', month: '01', date: '2021-01' },
    { typeName: '研发部类型', year: '2021', month: '02', date: '2021-02' },
    { typeName: '财务部类型', year: '2021', month: '03', date: '2021-03' },
    { typeName: '市场部类型', year: '2021', month: '04', date: '2021-04' },
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
            twidth: '500px',
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
            twidth: '500px',
          },
          width: 150,
        },
      ],
    },
  ];
  export default defineComponent({
    components: { BasicTable, TableAction },
    setup() {
      const { createMessage: msg } = useMessage();
      const currentEditKeyRef = ref('');

      const tableData = ref([]);

      tableData.value = JSON.parse(
        '[{"id":"0","beginTime":"2003-06-11 17:12:49","endTime":"2014-12-08 19:37:57","address":"湖州市","name":"锺秀兰","name1":"熊杰","name2":"谢秀英","name3":"胡涛","name4":"金霞","name5":"雷洋","name6":"金刚","name7":"常明","name8":"邹磊","radio1":"选项1","radio2":"选项1","radio3":"选项1","avatar":"http://dummyimage.com/400x400/f29b79/797af2&text=Robert","imgArr":["http://dummyimage.com/800x600/9df279/f279c1&text=Lspnfrll Skujf Sbixp Ncmvbpu Rqxs","http://dummyimage.com/800x600/79e4f2/f2dc79&text=Iyxke Dxikdmx Hmklfcuev","http://dummyimage.com/800x600/b979f2/79f295&text=Fjchacoa Whnzynkmu Gvwxtls Dsrvzip","http://dummyimage.com/800x600/f2797f/79a2f2&text=Ofpssal Hdapoynj Lbrw Cgnujolgil Vxyjqwqf"],"imgs":["http://dummyimage.com/800x600/c6f279/f279e9&text=Hycceh Vjwjtlvea Lhuskpi Bhkov Sijtv Bkddivet Qgsz","http://dummyimage.com/800x600/79f2d7/f2b479&text=Fpzo Eiedud Mbteluc Vnojpyq Tnmygk","http://dummyimage.com/800x600/9079f2/84f279&text=Ifoybd Jtbyt Tzyq"],"date":"2005-11-06","time":"10:53","no":9399405,"status":"disable"},{"id":"1","beginTime":"1984-06-25 13:32:00","endTime":"1996-12-20 20:04:03","address":"鄂尔多斯市","name":"黄超","name1":"郭涛","name2":"苏静","name3":"史杰","name4":"熊敏","name5":"谭秀兰","name6":"丁霞","name7":"潘洋","name8":"林平","radio1":"选项2","radio2":"选项2","radio3":"选项2","avatar":"http://dummyimage.com/400x400/f279a8/79cbf2&text=Dorothy","imgArr":["http://dummyimage.com/800x600/eef279/d279f2&text=Xigdkmxw Srwcbpqlle Wuowha Bvfssum Ftmx Pxfkkrv","http://dummyimage.com/800x600/79f2ae/f28b79&text=Xmpf Oglpxjv Hreofedzm Hbjt Mlirro Oyqxfwluz","http://dummyimage.com/800x600/7989f2/adf279&text=Xqmyntgx Trqmhv Mpxbzekquh Mhmpevfitg","http://dummyimage.com/800x600/f279d0/79f2f0&text=Crpef Rnimjaykm Lmvj Yktgqcxfc Oyweg"],"imgs":["http://dummyimage.com/800x600/f2cd79/a979f2&text=Ohol Feqvqfgw Phgqmbn","http://dummyimage.com/800x600/79f286/f2798f&text=Elenucj Xpha Qdfgiys Fyjxcwkfe Ourlij","http://dummyimage.com/800x600/79b2f2/d5f279&text=Ywlwln Piqjsk Lofqgeslfn Qfyh Yso Rjaorfhdo"],"date":"1972-04-25","time":"01:32","no":4140132,"status":"disable"},{"id":"2","beginTime":"1975-10-27 15:29:03","endTime":"1971-10-20 23:56:12","address":"广州市","name":"魏涛","name1":"林杰","name2":"侯霞","name3":"马秀英","name4":"萧强","name5":"康秀兰","name6":"郝桂英","name7":"许刚","name8":"赵秀英","radio1":"选项3","radio2":"选项3","radio3":"选项3","avatar":"http://dummyimage.com/400x400/eb79f2/79f2c8&text=William","imgArr":["http://dummyimage.com/800x600/f2a479/8179f2&text=Kbhktnr Pyfxb Bflbsna Azfnf Qsubjjngq Wxknowixm Hhrzn","http://dummyimage.com/800x600/94f279/f279b7&text=Pqyy Rgyouqtjys Nwtjur Tmgcjh Rvzpk Dimy","http://dummyimage.com/800x600/79daf2/f2e679&text=Jkrbtxd Vmpwi Summ Ihtumipb","http://dummyimage.com/800x600/c279f2/79f29f&text=Ohcmo Wuq Xevfqqbiy Vizkk Vcp Hmst"],"imgs":["http://dummyimage.com/800x600/f27c79/7999f2&text=Ecsjua Ocyira Feshmc Vmwbcq Zqbjpu Ivwhaatf","http://dummyimage.com/800x600/bcf279/f279e0&text=Cgwhkjykx Ebs Dovrx Vhpwkxwys","http://dummyimage.com/800x600/79f2e1/f2bd79&text=Qvqwslowe Yydl Qspl Esbirwcv Akzdn Jein Qgkyjyjev"],"date":"2011-10-10","time":"00:47","no":2562536,"status":"enable"},{"id":"3","beginTime":"2017-07-05 23:17:12","endTime":"1993-03-30 00:05:08","address":"重庆市","name":"刘芳","name1":"常勇","name2":"林刚","name3":"赵桂英","name4":"常丽","name5":"贾秀兰","name6":"汤磊","name7":"金秀兰","name8":"吕洋","radio1":"选项4","radio2":"选项4","radio3":"选项4","avatar":"http://dummyimage.com/400x400/9a79f2/7bf279&text=Brian","imgArr":["http://dummyimage.com/800x600/f2799e/79c1f2&text=Dfpkinmtw Urrq Aqwynmebm Qqjkncq Vihpmxijp","http://dummyimage.com/800x600/e5f279/db79f2&text=Iuzjbniu Jif Mvauwmzgd"],"imgs":["http://dummyimage.com/800x600/79f2b8/f29579&text=Xqixeedqu Pgnwhy Qgjmzuos Ypiwktrsu Kytyynhqsr Gosqgklay Mfqnducr","http://dummyimage.com/800x600/7980f2/a3f279&text=Pifgvj Usrjtq Ukojd Yvcuwd Pekay Chup","http://dummyimage.com/800x600/f279c7/79eaf2&text=Flwqxgusk Hiwliu Sqipgusir Clfk"],"date":"2023-01-26","time":"02:31","no":871498,"status":"disable"},{"id":"4","beginTime":"2019-03-04 05:42:10","endTime":"2009-11-16 21:00:59","address":"苗栗县","name":"金强","name1":"贺丽","name2":"雷杰","name3":"杨娟","name4":"姜超","name5":"谭强","name6":"金杰","name7":"赵强","name8":"谢艳","radio1":"选项5","radio2":"选项5","radio3":"选项5","avatar":"http://dummyimage.com/400x400/f2d679/b379f2&text=John","imgArr":["http://dummyimage.com/800x600/79f290/f27985&text=Zwpokru Quavwx Qrdjes Toym","http://dummyimage.com/800x600/79a8f2/ccf279&text=Sswisw Fpiiljhbm Sqrlnfc Hlekniptls","http://dummyimage.com/800x600/f279ef/79f2d1&text=Yemrnm Qdxrt Ogkks"],"imgs":["http://dummyimage.com/800x600/f2ae79/8a79f2&text=Wytwls Rnrphewqnb Jnoq Rwqjgfnzej","http://dummyimage.com/800x600/8af279/f279ae&text=Paqyjjlh Jpujgo Genhsjme Lgnlvnzsh Blevq Gxgfzr","http://dummyimage.com/800x600/79d1f2/f2ef79&text=Dqdykuwab Whkioriac Szxxg Lee Ujgne Phihnbl","http://dummyimage.com/800x600/cc79f2/79f2a9&text=Psp Bvbb Yjqokpgrc Tttivxjofn"],"date":"1995-07-04","time":"17:52","no":1233264,"status":"enable"},{"id":"5","beginTime":"2015-12-30 21:42:03","endTime":"1993-09-15 07:10:22","address":"石家庄市","name":"潘艳","name1":"黄明","name2":"何勇","name3":"阎明","name4":"廖洋","name5":"孔洋","name6":"孙磊","name7":"金明","name8":"刘秀兰","radio1":"选项6","radio2":"选项6","radio3":"选项6","avatar":"http://dummyimage.com/400x400/f28579/798ff2&text=Paul","imgArr":["http://dummyimage.com/800x600/b3f279/f279d6&text=Szwwbhzn Tqornkh Nlcdafizw Dkywwmubz Boppui","http://dummyimage.com/800x600/79f2ea/f2c779&text=Jkturkqt Fcmjtzaiy Bcoyjldr"],"imgs":["http://dummyimage.com/800x600/a379f2/79f280&text=Wlxhhb Sjgljupuw Kciqhj Tvkup","http://dummyimage.com/800x600/f27995/79b8f2&text=Uuaqnfh Wzhbnt Omh Eykwx","http://dummyimage.com/800x600/dbf279/e579f2&text=Gdcfe Zsybaw Xbc Mlain Jfwamhs","http://dummyimage.com/800x600/79f2c2/f29e79&text=Svca Fvgpfefq Xmbcywl Bjufcpb Nxydimldy Ohlx"],"date":"1997-06-09","time":"12:52","no":656666,"status":"enable"},{"id":"6","beginTime":"1982-05-14 17:58:15","endTime":"2019-10-15 11:58:38","address":"通辽市","name":"赖磊","name1":"邹丽","name2":"秦秀英","name3":"萧丽","name4":"高桂英","name5":"胡芳","name6":"李平","name7":"夏秀兰","name8":"袁伟","radio1":"选项7","radio2":"选项7","radio3":"选项7","avatar":"http://dummyimage.com/400x400/7b79f2/9af279&text=Deborah","imgArr":["http://dummyimage.com/800x600/f279bd/79e0f2&text=Huxrhw Dgmeq Pdiqrp Sxuekno","http://dummyimage.com/800x600/f2e079/bc79f2&text=Rodr Mjlum Xdagtw Behgeervvv"],"imgs":["http://dummyimage.com/800x600/79f299/f2797b&text=Gwqt Wfuq Nrbrb Cscqsoz","http://dummyimage.com/800x600/799ff2/c2f279&text=Chcwykcll Dpht Fndemxuxz Shxspqwhl Afueapsmfx","http://dummyimage.com/800x600/f279e6/79f2db&text=Ocdjbpn Hwkf Flutk Ukmy Vcvx"],"date":"2000-02-07","time":"05:20","no":271631,"status":"normal"},{"id":"7","beginTime":"1984-05-09 05:30:05","endTime":"1983-03-12 06:34:30","address":"张家口市","name":"邓静","name1":"谢明","name2":"马洋","name3":"谢秀兰","name4":"蔡勇","name5":"杨洋","name6":"马明","name7":"唐强","name8":"李平","radio1":"选项8","radio2":"选项8","radio3":"选项8","avatar":"http://dummyimage.com/400x400/f2b779/9479f2&text=Elizabeth","imgArr":["http://dummyimage.com/800x600/81f279/f279a4&text=Htpoqife Mqwjshjec Pcdu Ovdchxs Qeqvyefiw Eyzyngxh","http://dummyimage.com/800x600/79c7f2/ebf279&text=Jpw Hwbx Oqtqhv Otwymfhl Jpqyyd Xrjlttw","http://dummyimage.com/800x600/d579f2/79f2b2&text=Qcksyjem Lcrvfu Evamat Vlda Ifjyi"],"imgs":["http://dummyimage.com/800x600/f28f79/7986f2&text=Etgcsq Jhmh Gkow Wfetjjabae Pmnlnfwmho Dbruhjcp","http://dummyimage.com/800x600/a9f279/f279cc&text=Nuedh Dgggb Derwyjqoa Kphbck Pvlpm","http://dummyimage.com/800x600/79f0f2/f2d079&text=Ltyxhx Fauskazmt Xsciadduok Ydwx Cxlmlrgw","http://dummyimage.com/800x600/ad79f2/79f28a&text=Haxtr Txhtxk Fwyvc Evkwb Zyvpm"],"date":"2020-05-18","time":"23:06","no":1953981,"status":"disable"},{"id":"8","beginTime":"2018-10-22 00:58:28","endTime":"1991-05-13 19:24:21","address":"七台河市","name":"许洋","name1":"陆艳","name2":"罗超","name3":"吴桂英","name4":"吴芳","name5":"范秀兰","name6":"田洋","name7":"廖艳","name8":"谢强","radio1":"选项9","radio2":"选项9","radio3":"选项9","avatar":"http://dummyimage.com/400x400/f2798b/79aef2&text=Thomas","imgArr":["http://dummyimage.com/800x600/d2f279/ef79f2&text=Ujgm Yvsfgiymu Rfeosai Ghkhjtjff Gwtrmgqf Phfzn Lztpbkxxl","http://dummyimage.com/800x600/79f2cb/f2a879&text=Pnhnybrncr Eommkisls Fuqtm Lndpap","http://dummyimage.com/800x600/8479f2/90f279&text=Bil Pakcm Yttolkpo Gkwnjgfmp"],"imgs":["http://dummyimage.com/800x600/f279b3/79d7f2&text=Lzizhvfrsv Kordhn Shopkerrk Okkwvmtdl Pzlftfbl Eoa","http://dummyimage.com/800x600/f2e979/c679f2&text=Zynblmppxh Ller Aouwjgk Yhxskpf Wjbfegfx","http://dummyimage.com/800x600/79f2a3/f27f79&text=Vzchhckp Yxdudjmx Pexj Kphdcm Udp Qozegf","http://dummyimage.com/800x600/7995f2/b9f279&text=Peb Jmjwfrie Gdzdmqp Nhmw Clqirss Mdvinqc"],"date":"1976-12-06","time":"04:49","no":8568077,"status":"enable"},{"id":"9","beginTime":"2016-06-08 19:58:48","endTime":"1999-04-30 09:59:59","address":"衢州市","name":"龚娜","name1":"吴艳","name2":"孙平","name3":"杜芳","name4":"孙平","name5":"张涛","name6":"韩静","name7":"邓丽","name8":"夏芳","radio1":"选项10","radio2":"选项10","radio3":"选项10","avatar":"http://dummyimage.com/400x400/f279dc/79f2e4&text=Scott","imgArr":["http://dummyimage.com/800x600/f2c179/9e79f2&text=Jopd Gfrksqo Xnhconxt Jkizsdvvm Fgwhi Pebsuf","http://dummyimage.com/800x600/79f27a/f2799a&text=Icwwzrdyvw Hhewszq Trltmkk Jqpu Kgijtockr Mqyuebwj Nud","http://dummyimage.com/800x600/79bef2/e1f279&text=Dnvxodzhk Tulvouip Tepnsroyw Jjkupcp Cqlfumkd","http://dummyimage.com/800x600/df79f2/79f2bc&text=Ezhvwyhid Nphf Nyeozmalen Zsbhsvxs"],"imgs":["http://dummyimage.com/800x600/f29879/797cf2&text=Bdpcgwrnq Wdg Ylpneqbt","http://dummyimage.com/800x600/a0f279/f279c3&text=Jkei Ssbvfqjnhr Qqcevimjm Gmpmptwct Uxntlua Xhnonssbb Snwkfdnu","http://dummyimage.com/800x600/79e6f2/f2da79&text=Gzcjqpwhx Wljs Xcqjxiy Svqdkbirxt Rjofxi Fsru","http://dummyimage.com/800x600/b779f2/79f293&text=Dtwji Jwtbjyzf Wbhniaul Hgrt Umujdbgw"],"date":"2011-02-24","time":"01:50","no":6681753,"status":"enable"},{"id":"10","beginTime":"1990-06-18 09:28:18","endTime":"1992-07-17 20:58:55","address":"七台河市","name":"白丽","name1":"龚强","name2":"锺平","name3":"方明","name4":"于秀英","name5":"袁秀英","name6":"潘超","name7":"曹洋","name8":"韩静","radio1":"选项11","radio2":"选项11","radio3":"选项11","avatar":"http://dummyimage.com/400x400/f27981/79a5f2&text=Brenda","imgArr":["http://dummyimage.com/800x600/c8f279/f279eb&text=Gkbqwsst Cfpdcki Tiupizsb","http://dummyimage.com/800x600/79f2d5/f2b179&text=Ldrbdivlg Sinskkmtj Mfxxlvpt Ufubge Nuym Npfgktqw","http://dummyimage.com/800x600/8e79f2/87f279&text=Pfbxuvv Rhdturqr Cdhbjln Nogkxtibf Dqdss"],"imgs":["http://dummyimage.com/800x600/f279aa/79cdf2&text=Agjggs Jfvcpuuvh Mxyjbnsu Lgjgjvajx Arbhads Smjpirblp","http://dummyimage.com/800x600/f1f279/d079f2&text=Vpct Iltdbkjc Cycpjufh Trnkq"],"date":"1985-08-06","time":"00:33","no":2671267,"status":"normal"},{"id":"11","beginTime":"1991-05-12 18:20:11","endTime":"1998-02-20 22:43:15","address":"承德市","name":"马超","name1":"顾平","name2":"龚艳","name3":"姚艳","name4":"卢娜","name5":"袁娟","name6":"张艳","name7":"武洋","name8":"张杰","radio1":"选项12","radio2":"选项12","radio3":"选项12","avatar":"http://dummyimage.com/400x400/79f2ac/f28979&text=George","imgArr":["http://dummyimage.com/800x600/798cf2/aff279&text=Lhinwjp Ccqucjt Cgn Qncpge","http://dummyimage.com/800x600/f279d2/79f2ee&text=Whzewebjw Thtkon Chrnuv","http://dummyimage.com/800x600/f2ca79/a779f2&text=Rfl Vdkp Pmnwmhwf"],"imgs":["http://dummyimage.com/800x600/79f284/f27991&text=Amchvyync Hgeowuw Dnees Oab Wvkqtk Ptdfgndad","http://dummyimage.com/800x600/79b4f2/d8f279&text=Gembbl Sxxbbdlrn Dotsiml Wbll Ybwokiuj"],"date":"2002-08-31","time":"15:01","no":2959561,"status":"enable"},{"id":"12","beginTime":"2015-06-24 17:11:48","endTime":"2017-12-01 13:24:18","address":"萍乡市","name":"常洋","name1":"田静","name2":"邵丽","name3":"朱超","name4":"石秀英","name5":"袁明","name6":"萧娟","name7":"何娜","name8":"丁强","radio1":"选项13","radio2":"选项13","radio3":"选项13","avatar":"http://dummyimage.com/400x400/e979f2/79f2c5&text=Melissa","imgArr":["http://dummyimage.com/800x600/f2a279/7f79f2&text=Yetwhowge Phs Gevdxmwf Tuckd","http://dummyimage.com/800x600/96f279/f279b9&text=Nhep Klmtfwv Uofsh Eyhuyc Rgojp Fqwbbqhi"],"imgs":["http://dummyimage.com/800x600/79ddf2/f2e379&text=Lgld Cxs Fhnsodmyqb Tybit Nottobseo","http://dummyimage.com/800x600/c079f2/79f29d&text=Blbrvteuw Xcbizl Iqfwtato Jugrsm Qryc","http://dummyimage.com/800x600/f27979/799bf2&text=Gxl Dedjzvfxd Crbc Lit"],"date":"1972-11-28","time":"22:30","no":1241119,"status":"disable"},{"id":"13","beginTime":"1975-05-20 13:36:17","endTime":"2019-10-29 02:22:57","address":"绍兴市","name":"史娟","name1":"郭涛","name2":"孔伟","name3":"黎静","name4":"何丽","name5":"谭娜","name6":"贾明","name7":"赖芳","name8":"张敏","radio1":"选项14","radio2":"选项14","radio3":"选项14","avatar":"http://dummyimage.com/400x400/bff279/f279e2&text=Robert","imgArr":["http://dummyimage.com/800x600/79f2de/f2bb79&text=Gogoyiher Kayqa Gkyeiylu Rtnwtlj","http://dummyimage.com/800x600/9879f2/7df279&text=Rogxun Ztyf Dhsvikmso Punnbnkg Kjsb Jwydmhq","http://dummyimage.com/800x600/f279a0/79c4f2&text=Tkevubxfmb Gthxn Chno Kjbfblqeu Wcjjwnwq Mdya Xqwvkuy","http://dummyimage.com/800x600/e7f279/d979f2&text=Tuwyhbx Wojygtj Zkfb Kowkr Fuldsndtk Dwypwqxlj"],"imgs":["http://dummyimage.com/800x600/79f2b6/f29279&text=Vbcovlb Jlde Wsdtdix Vjchdjkn","http://dummyimage.com/800x600/7982f2/a5f279&text=Dqjl Zwycqwttdd Qyprqnmtne Bovhuhh Fksolciop Ipen"],"date":"1992-07-10","time":"17:39","no":9894390,"status":"enable"},{"id":"14","beginTime":"1977-03-30 02:50:16","endTime":"2022-06-08 19:44:50","address":"长治市","name":"谢芳","name1":"陈霞","name2":"罗娜","name3":"贺娜","name4":"侯军","name5":"蒋磊","name6":"龙平","name7":"潘芳","name8":"毛伟","radio1":"选项15","radio2":"选项15","radio3":"选项15","avatar":"http://dummyimage.com/400x400/f279c9/79ecf2&text=Linda","imgArr":["http://dummyimage.com/800x600/f2d479/b179f2&text=Hisdh Nnnhli Kphdznssw Uvjyj","http://dummyimage.com/800x600/79f28d/f27987&text=Jdyhqejf Kxkutcmgi Sxjdsrvgu Iqvy Gcrvlifao","http://dummyimage.com/800x600/79abf2/cef279&text=Ujhazjk Hkxzzkv Sdfpmri Pjwsqbvq Lrlou Oyuxnnp","http://dummyimage.com/800x600/f279f1/79f2cf&text=Wgvfkoxe Pvucoiy Lmltrff Oxlddmzuc"],"imgs":["http://dummyimage.com/800x600/f2ab79/8879f2&text=Gwjibp Pins Zpybsxui Xadigssf Bqpoyiiws","http://dummyimage.com/800x600/8cf279/f279b0&text=Jpvort Vjtm Hiztybkil Ndgpvq Artptbuqb Lpmvzxewth","http://dummyimage.com/800x600/79d3f2/f2ed79&text=Trorpbaqu Pdkmrww Vibqksvoml Anjroe Huzqbfbnu Owhmhnhgx"],"date":"2023-01-14","time":"11:48","no":4559299,"status":"disable"},{"id":"15","beginTime":"1978-09-29 01:56:20","endTime":"1983-01-02 06:33:26","address":"三亚市","name":"白秀英","name1":"苏军","name2":"文勇","name3":"高丽","name4":"唐超","name5":"白丽","name6":"史勇","name7":"杜丽","name8":"王磊","radio1":"选项16","radio2":"选项16","radio3":"选项16","avatar":"http://dummyimage.com/400x400/ca79f2/79f2a6&text=Carol","imgArr":["http://dummyimage.com/800x600/f28379/7992f2&text=Xfbmdi Nohfqxogh Gpkhuszvg Ixpuyybyj","http://dummyimage.com/800x600/b5f279/f279d8&text=Ehliyfqhti Iefizfiola Sbmi Dri Fpbwp Akroi","http://dummyimage.com/800x600/79f2e8/f2c579&text=Ypecbhrgf Bmjd Hlnwuto Ykpk Wsmfg Twkcwgs Ejgsic","http://dummyimage.com/800x600/a179f2/79f27e&text=Pihtzi Tvkuq Tdbqlhmxn Omibe Igyyemldy Qoadp"],"imgs":["http://dummyimage.com/800x600/f27997/79baf2&text=Rav Uxaxuw Nggldgqqup Nqgcezan","http://dummyimage.com/800x600/ddf279/e379f2&text=Jjmx Qfslo Kbnjcl Mtqtldrld Rrccjeinjs Byvxphaf"],"date":"1983-06-27","time":"18:07","no":1817639,"status":"enable"},{"id":"16","beginTime":"1985-11-12 02:39:16","endTime":"1979-12-24 18:30:02","address":"阿坝藏族羌族自治州","name":"彭丽","name1":"锺明","name2":"顾明","name3":"刘霞","name4":"孙敏","name5":"郭洋","name6":"武芳","name7":"孙军","name8":"段霞","radio1":"选项17","radio2":"选项17","radio3":"选项17","avatar":"http://dummyimage.com/400x400/79f2bf/f29c79&text=Charles","imgArr":["http://dummyimage.com/800x600/7979f2/9cf279&text=Xldwfjk Dbhq Nxqocg","http://dummyimage.com/800x600/f279bf/79e3f2&text=Pcjkxxfm Wgp Lhtu Zucfspql Ewvjlacl"],"imgs":["http://dummyimage.com/800x600/f2de79/ba79f2&text=Dwgaeq Sptme Rbvshhre Dybsdtc Emjorbbxd Oiqvwm Holicc","http://dummyimage.com/800x600/79f297/f2797e&text=Xumv Sxssrwui Tvciovdf Hvete","http://dummyimage.com/800x600/79a1f2/c4f279&text=Yihb Xsnueq Knvtxrwkd"],"date":"2006-01-21","time":"21:59","no":8249690,"status":"normal"},{"id":"17","beginTime":"1996-08-30 12:38:33","endTime":"1997-06-25 18:46:52","address":"晋中市","name":"唐强","name1":"蔡杰","name2":"毛秀英","name3":"孙桂英","name4":"方秀英","name5":"谭静","name6":"戴娟","name7":"苏刚","name8":"郑娜","radio1":"选项18","radio2":"选项18","radio3":"选项18","avatar":"http://dummyimage.com/400x400/f279e8/79f2d8&text=Anthony","imgArr":["http://dummyimage.com/800x600/f2b579/9279f2&text=Wuui Wkyiajex Nrdudl Acafdldep Alpxcdldh Fsrqrc","http://dummyimage.com/800x600/83f279/f279a6&text=Xygladyecj Vhrhst Wkcotlz Ggvug Zytdveqxey","http://dummyimage.com/800x600/79caf2/edf279&text=Dumn Zmfuuvnori Lrw Pnxuipbe","http://dummyimage.com/800x600/d379f2/79f2b0&text=Coprjbadt Oxdyxpx Lvvfbg Dfukmr"],"imgs":["http://dummyimage.com/800x600/f28d79/7988f2&text=Tslqoph Tnkxgtw Sgmtagk Ubtvppuocr Ixjjh Vesiizjm","http://dummyimage.com/800x600/abf279/f279cf&text=Dlgxmpmh Ofyrrr Tvoxnhxk Brqvoeebg Dlgqc Hacrtnnoim Mwogae"],"date":"1992-05-02","time":"16:10","no":2752564,"status":"disable"},{"id":"18","beginTime":"1983-04-17 12:35:36","endTime":"1979-11-03 01:08:20","address":"固原市","name":"邵敏","name1":"白刚","name2":"邱秀兰","name3":"毛刚","name4":"崔杰","name5":"史强","name6":"叶秀兰","name7":"林静","name8":"汪强","radio1":"选项19","radio2":"选项19","radio3":"选项19","avatar":"http://dummyimage.com/400x400/79f2f1/f2ce79&text=Brenda","imgArr":["http://dummyimage.com/800x600/ab79f2/79f287&text=Wefw Sxoyos Strnafmc","http://dummyimage.com/800x600/f2798d/79b1f2&text=Pqjlrv Etfx Qxtpbpfl Ofoeqvsmv Tkducay Qtmr Admzhxu"],"imgs":["http://dummyimage.com/800x600/d4f279/ec79f2&text=Vfhbl Vebmizexol Uzxlpjogx Upgbuybw","http://dummyimage.com/800x600/79f2c9/f2a679&text=Uuqrcpcm Hcdo Ligmgnued Zgro Ekydgrpo Xlplytkbt"],"date":"1978-04-01","time":"21:13","no":8758718,"status":"enable"},{"id":"19","beginTime":"2002-02-12 00:32:03","endTime":"1997-01-06 15:51:18","address":"黄冈市","name":"于刚","name1":"熊明","name2":"夏娟","name3":"阎平","name4":"姜杰","name5":"乔丽","name6":"赖霞","name7":"尹艳","name8":"常芳","radio1":"选项20","radio2":"选项20","radio3":"选项20","avatar":"http://dummyimage.com/400x400/8279f2/92f279&text=Jeffrey","imgArr":["http://dummyimage.com/800x600/f279b6/79d9f2&text=Tuedvx Gdouycydjr Ovuceihcc Hywjxm Wfmloj Iuzodi Dggakirdi","http://dummyimage.com/800x600/f2e779/c479f2&text=Cwpm Tsdkz Llswxa Yhbva Xiveig Uliwtuqv","http://dummyimage.com/800x600/79f2a0/f27d79&text=Nwmh Dlouhz Euvx Qqvu"],"imgs":["http://dummyimage.com/800x600/7998f2/bbf279&text=Nldipdf Whug Jqih","http://dummyimage.com/800x600/f279de/79f2e2&text=Dwwhuf Ymiv Vucxxcede"],"date":"2016-12-26","time":"14:52","no":7542434,"status":"enable"}]',
      );

      const [registerTable] = useTable({
        title: '可编辑行示例',
        titleHelpMessage: [
          '本例中修改[数字输入框]这一列时，同一行的[远程下拉]列的当前编辑数据也会同步发生改变',
        ],
        columns: columns,
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
        currentEditKeyRef.value = record.key;
        record.onEdit?.(true);
      }

      function handleCancel(record: EditRecordRow) {
        currentEditKeyRef.value = '';
        record.onEdit?.(false, false);
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
          `{"code":0,"result":[{"orgId":"AABAB68C2D0440ADA0A52AE93B9508A0","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFJLTYYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/AABAB68C2D0440ADA0A52AE93B9508A0.dpt","name":"吉林通榆","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"AABAB68C2D0440ADA0A52AE93B9508A0","nodeName":"吉林通榆","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"BC583036CFFA4EB3AE4ECCC21E57F682","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFJSRDYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/BC583036CFFA4EB3AE4ECCC21E57F682.dpt","name":"江苏如东","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"station","stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"BC583036CFFA4EB3AE4ECCC21E57F682","nodeName":"江苏如东","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"jzsnbq","categoryName":null,"typeName":"jzsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"7e14c133613b443590005078554bb797","nodeName":"gfq-cateGory","nodeType":"category","typeSort":null,"categorySort":1,"typeCode":"gfq","children":[{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"zcsnbq","categoryName":"gfq","typeName":"zcsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"0d76f0a575a94fa599f63d8eb1a4283f","nodeName":"zcsnbq-type","nodeType":"type","typeSort":1,"categorySort":null,"typeCode":"zcsnbq","children":[]},{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"jzsnbq","categoryName":"gfq","typeName":"jzsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"7e14c133613b443590005078554bb797","nodeName":"jzsnbq-type","nodeType":"type","typeSort":2,"categorySort":null,"typeCode":"jzsnbq","children":[]}]}]},{"orgId":"HZ93a0a35fd71b32015fd849228c100a","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFSDZBYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a35fd71b32015fd849228c100a.dpt","name":"山东高青","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a35fd71b32015fd849228c100a","nodeName":"山东高青","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"HZ93a0a36120d1490161260327b63ea4","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"SDPD","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a36120d1490161260327b63ea4.dpt","name":"山东平度","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a36120d1490161260327b63ea4","nodeName":"山东平度","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"HZ93a0a367e001980167e84d6e2962a4","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"tjdgyyz","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a367e001980167e84d6e2962a4.dpt","name":"天津大港","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a367e001980167e84d6e2962a4","nodeName":"天津大港","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]}],"message":""}`,
        );
        const list = result.result as never[];
        treeData.value = list;
      }

      queryDeptTreeList();
      const options = {
        columns: searchBoxColumns,
        data: searchBoxData,
        vfield: 'date',
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
