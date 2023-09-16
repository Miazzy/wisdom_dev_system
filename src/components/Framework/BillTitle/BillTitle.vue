<template>
  <div
    class="bill-title-box"
    :style="`min-height: ${billTitleOption.height}px; border-bottom: ${billTitleOption.bottomLine};`"
  >
    <h2 class="bill-title">{{ billTitleOption.title }}</h2>
    <div class="bill-info-box" v-if="billTitleOption.infoItems && billTitleOption.infoItems.length">
      <div class="bill-info-item left">
        <div v-if="billInfo.left" class="bill-info-item-content"
          >{{ billInfo.left.label }}：{{ billInfo.left.value }}</div
        >
      </div>
      <div class="bill-info-item center">
        <div v-if="billInfo.center" class="bill-info-item-content"
          >{{ billInfo.center.label }}：{{ billInfo.center.value }}</div
        >
      </div>
      <div class="bill-info-item right">
        <div v-if="billInfo.right" class="bill-info-item-content"
          >{{ billInfo.right.label }}：{{ billInfo.right.value }}</div
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch, PropType, reactive, computed } from 'vue';
  import type { BillTitleOptions } from '#/framework';

  const props = defineProps({
    options: { type: Object as PropType<BillTitleOptions> },
  });
  const DEF_TITLE = '';
  const DEF_HEIGHT = 70;
  const DEF_BOTTOM_LINE = '1px solid #f0f0f0';
  const billTitleOption = reactive<BillTitleOptions>({});

  const billInfo = computed(() => {
    let obj = {};
    if (billTitleOption?.infoItems?.length) {
      billTitleOption.infoItems.forEach((item) => {
        obj[item.position] = item;
      });
    }
    return obj;
  });

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
    billTitleOption.title = props.options?.title || DEF_TITLE;
    billTitleOption.height = props.options?.height || DEF_HEIGHT;
    billTitleOption.bottomLine = props.options?.bottomLine || DEF_BOTTOM_LINE;
    billTitleOption.infoItems = props.options?.infoItems || [];
  });
</script>
<style lang="less" scoped>
  .bill-title-box {
    width: 100%;
    padding: 15px;
    background-color: #fff;

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

        &.center {
          text-align: center;
        }

        &.right {
          text-align: right;
        }
      }
    }
  }
</style>
