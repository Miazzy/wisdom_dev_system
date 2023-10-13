<script lang="tsx">
  import { defineComponent, PropType, ref } from 'vue';
  import { isHexColor } from '@/utils/color';
  import { ElTag } from 'element-plus';
  import { DictDataType } from '@/utils/dict';
  import { useDictStoreWithOut } from '@/store/modules/dict';

  export default defineComponent({
    name: 'DictTag',
    props: {
      type: { type: String, required: true },
      mode: { type: String, default: 'group' }, // 如果mode为group模式，则统一加载数据
      value: {
        type: [String, Number, Boolean] as PropType<string | number | boolean>,
        required: true,
      },
      delaytimes: { type: Number, default: 900 },
    },
    setup(props) {
      const dictData = ref<DictDataType>();
      const dictStore = useDictStoreWithOut();
      const getDictObj = async (type: string, value: string | number | boolean) => {
        if (props.mode !== 'group') {
          const response = await dictStore.fetchBackendData('', { type });
          const node = response.find((item) => item.value == value);
          dictData.value = node;
        } else {
          const timestamp =
            (props.delaytimes * (Math.random() + Math.random() + Math.random())) / 2;
          dictStore.setDictKey(props.type);
          setTimeout(async () => {
            const typeList = dictStore.getDictKey.join(',');
            const response = await dictStore.fetchBackendData(typeList, props); // 调用后端接口获取数据
            const node = response.find((item) => item.value == value);
            dictData.value = node;
          }, timestamp);
        }
      };
      const getDictObjClass = (dictData) => {
        const flag = dictData.value?.cssClass && isHexColor(dictData.value?.cssClass);
        return flag ? dictData.value?.cssClass : '';
      };
      const rederDictTag = () => {
        const { type, value } = props;
        if (!type) {
          return null;
        }
        getDictObj(type, value);
        return (
          <ElTag
            style={dictData.value?.cssClass ? 'color: #fff' : ''}
            type={dictData.value?.colorType}
            color={getDictObjClass(dictData)}
            disableTransitions={true}
          >
            {dictData.value?.label}
          </ElTag>
        );
      };
      return () => rederDictTag();
    },
  });
</script>
