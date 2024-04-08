<template>
  <a-input-group compact>
    <a-input
      v-model:value="value1"
      start-value
      class="start-value"
      :style="inputStyle"
      placeholder="最小值"
      @blur="handleInput"
      @input="handleInput"
    />
    <a-input
      class="middle-value"
      placeholder="~"
      disabled
    />
    <a-input
      v-model:value="value2"
      end-value
      class="end-value"
      :style="inputStyle"
      placeholder="最大值"
      @blur="handleInput"
      @input="handleInput"
    />
  </a-input-group>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch, defineProps, computed, defineEmits } from 'vue';

  const props = defineProps({
    value1: { type: [Number, String], default: null },
    value2: { type: [Number, String], default: null },
    width: { type: [Number], default: 220 },
    type: { type: [String], default: 'number' }, // number | string | float 
  });

  const inputWidth = ref(100);
  const value1 = ref();
  const value2 = ref();

  const inputStyle = computed(() => {
    return `width: ${inputWidth.value}px;`;
  });

  const handleInput = (value: string | number) => {
    const clist = value?.currentTarget?.classList;
    const val = clist.value.includes('start-value') ? value1 : value2;
    if (props.type === 'number' && value.toString() !== '' && !(/^\d+$/.test(value.toString()))) {
      val.value = val.value.toString().replace(/\D/g, ''); // 剔除非数字和小数点
    } else if (props.type === 'float' && value.toString() !== '' && !(/^\d+(\.\d+)?$/.test(value.toString()))) {
      val.value = val.value.toString().replace(/[^\d.]/g, ''); // 剔除非数字
    } 
  };

  const validate = () => {
    if (!value1.value || !value2.value) {
      return false; // 两个输入框有一个为空
    }
    // 可以添加其他校验逻辑
    return true;
  };

  watch(
    () => props.width,
    () => {
      inputWidth.value = (props.width - 30) / 2;
    },
  );

  onMounted(() => {
    inputWidth.value = (props.width - 30) / 2;
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
