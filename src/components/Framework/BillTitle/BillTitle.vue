<template>
  <div
    class="bill-title-box"
    :style="`height: ${billTitleOption.height}px; border-bottom: ${billTitleOption.bottomLine};`"
  >
    <h2 class="bill-title">{{ billTitleOption.title }}</h2>
    <div class="bill-info-box" v-if="billTitleOption.infoItems && billTitleOption.infoItems.length">
      <div class="bill-info-item" v-for="(item, index) in billTitleOption.infoItems" :key="index">
        {{ item.label }}：{{ item.value }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch, PropType, reactive } from 'vue';
  import { BillTitleOptions } from './types';

  const props = defineProps({
    title: { type: String },
    height: { type: Number },
    bottomLine: { type: String },
    options: { type: Object as PropType<BillTitleOptions> },
  });
  const DEF_HEIGHT = 65;
  const DEF_BOTTOM_LINE = '1px solid #f0f0f0';
  const billTitleOption = reactive<BillTitleOptions>({});

  watch(
    () => props.options,
    (newValue) => {
      billTitleOption.title = newValue?.title || billTitleOption?.title;
      billTitleOption.height = newValue?.height || billTitleOption?.height || DEF_HEIGHT;
      billTitleOption.bottomLine = newValue?.bottomLine || billTitleOption?.bottomLine || DEF_BOTTOM_LINE;
      billTitleOption.infoItems = newValue?.infoItems || billTitleOption?.infoItems;
    },
  );

  onMounted(() => {
    billTitleOption.title = props.options?.title || props?.title;
    billTitleOption.height = props.options?.height || props?.height || DEF_HEIGHT;
    billTitleOption.bottomLine = props.options?.bottomLine || props?.bottomLine || DEF_BOTTOM_LINE;
    billTitleOption.infoItems = props.options?.infoItems || [];
  });
</script>
<style lang="less" scoped>
  .bill-title-box {
    width: 100%;
    padding: 15px;

    .bill-title {
      color: #333;
      font-size: 26px;
      font-weight: 600;
      text-align: center;
    }

    .bill-info-box {
      display: flex;
      justify-content: space-between;

      .bill-info-item {
        flex: 1;
        color: #777;
        font-size: 12px;

        &:nth-child(2) {
          text-align: center;
        }

        &:last-child {
          text-align: right;
        }
      }
    }
  }
</style>
