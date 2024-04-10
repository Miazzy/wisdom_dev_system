<template>
  <a-input-group compact>
    <a-input
      v-model:value="iValue1"
      start-value
      class="start-value"
      :style="inputStyle"
      placeholder="最小值"
      required
      :disabled="isDisabled"
      @keydown="handleInput"
      @blur="handleInput"
      @input="handleInput"
    />
    <a-input class="middle-value" placeholder="~" disabled />
    <a-input
      v-model:value="iValue2"
      end-value
      class="end-value"
      :style="inputStyle"
      placeholder="最大值"
      required
      :disabled="isDisabled"
      @keydown="handleInput"
      @blur="handleInput"
      @input="handleInput"
    />
  </a-input-group>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch, defineProps, computed, defineEmits } from 'vue';
  import { MsgManager } from '/@/message/MsgManager';

  const props = defineProps({
    value: { type: [String], default: '' },
    value1: { type: [Number, String], default: null },
    value2: { type: [Number, String], default: null },
    width: { type: [Number], default: 220 },
    disabled: { type: [Boolean], default: false },
    type: { type: [String], default: 'number' }, // number | string | float
  });

  // 定义emits
  const emit = defineEmits(['update:value', 'update:value1', 'update:value2', 'change']);

  const inputWidth = ref(100);
  const iValue1 = ref();
  const iValue2 = ref();

  // 注入全局的disable状态
  const appDisabled = ref(false);

  // 根据disable状态计算出组件的disable状态
  const isDisabled = computed(() => {
    return props.disabled || appDisabled.value;
  });

  const inputStyle = computed(() => {
    return `width: ${inputWidth.value}px;`;
  });

  const handleInput = (event: InputEvent) => {
    const clist = event?.currentTarget?.classList;
    const val = clist.value.includes('start-value') ? iValue1 : iValue2;
    const isNumber = props.type === 'number' && !/^-?\d+$/.test(val.value);
    const isFloat = props.type === 'float' && !/^-?\d+(\.\d*)?$/.test(val.value);
    if (isNumber) {
      val.value = val.value.replace(/[^-\d]/g, ''); // 剔除非数字和负号
      if (val.value.startsWith('-') && val.value.lastIndexOf('-') != 0) {
        val.value = '-' + val.value.replace(/-/g, '');
      } else if (!val.value.startsWith('-')) {
        val.value = val.value.replace(/-/g, '');
      }
    } else if (isFloat) {
      val.value = val.value.replace(/[^-\d.]/g, ''); // 剔除非数字和小数点
      if (val.value.startsWith('-') && val.value.lastIndexOf('-') != 0) {
        val.value = '-' + val.value.replace(/-/g, '');
      } else if (!val.value.startsWith('-')) {
        val.value = val.value.replace(/-/g, '');
      }
      if (val.value.split('.').length > 2 && val.value.endsWith('.')) {
        val.value = val.value.slice(0, val.value.length - 1);
      }
    }
    if (props.type === 'number' && val.value.startsWith('0')) {
      val.value = parseInt(val.value);
    }
    if (iValue1.value && iValue2.value) {
      emit('update:value', `${iValue1.value},${iValue2.value}`);
      emit('change', `${iValue1.value},${iValue2.value}`);
    } else {
      emit('update:value', '');
      emit('change', '');
    }
    if (iValue1.value) {
      emit('update:value1', iValue1.value);
    }
    if (iValue2.value) {
      emit('update:value2', iValue2.value);
    }
  };

  const validate = () => {
    if (!iValue1.value || !iValue2.value) {
      return false; // 两个输入框有一个为空
    }
    // 可以添加其他校验逻辑
    return true;
  };

  const handleValueRange = () => {
    if (!props.value1 && !props.value2 && props.value) {
      const vals = props.value.split(',');
      iValue1.value = vals[0];
      iValue2.value = vals[1];
      if (iValue1.value) {
        emit('update:value1', iValue1.value);
      }
      if (iValue2.value) {
        emit('update:value2', iValue2.value);
      }
    }
  };

  defineExpose({
    validate,
  });

  watch(
    () => props.width,
    () => {
      inputWidth.value = (props.width - 30) / 2;
    },
  );

  watch(
    () => props.value1,
    () => {
      iValue1.value = props.value1;
      if (iValue1.value && iValue2.value) {
        emit('update:value', `${iValue1.value},${iValue2.value}`);
      }
    },
  );

  watch(
    () => props.value2,
    () => {
      iValue2.value = props.value2;
      if (iValue1.value && iValue2.value) {
        emit('update:value', `${iValue1.value},${iValue2.value}`);
      }
    },
  );

  watch(
    () => props.value,
    () => {
      handleValueRange();
    },
  );

  onMounted(() => {
    inputWidth.value = (props.width - 30) / 2;
    iValue1.value = props.value1;
    iValue2.value = props.value2;
    handleValueRange();
    MsgManager.getInstance().listen('global-disabled', (message) => { appDisabled.value = message; });
  });
</script>

<style lang="less" scoped>
  .start-value {
    width: 100px;
    text-align: left;
  }

  .middle-value {
    width: 30px;
    border-left: 0;
    background-color: #fff;
    pointer-events: none;
  }

  .end-value {
    width: 100px;
    border-left: 0;
    text-align: left;
  }
</style>
