<template>
  <div
    class="bill-title-box"
    :style="`height: ${billTitleOption.height}px;`"
  >
    <div class="bill-title">{{ billTitleOption.title }}</div>
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
  const DEF_HEIGHT = 56;
  // const DEF_BOTTOM_LINE = '1px solid #f0f0f0';
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
      // billTitleOption.bottomLine = newValue?.bottomLine || billTitleOption?.bottomLine || DEF_BOTTOM_LINE;
      billTitleOption.infoItems = newValue?.infoItems || billTitleOption?.infoItems;
    },
    { deep: true }
  );

  onMounted(() => {
    billTitleOption.title = props.options?.title || DEF_TITLE;
    billTitleOption.height = props.options?.height || DEF_HEIGHT;
    // billTitleOption.bottomLine = props.options?.bottomLine || DEF_BOTTOM_LINE;
    billTitleOption.infoItems = props.options?.infoItems || [];
  });
</script>
<style lang="less" scoped>
  .bill-title-box {
    width: 100%;
    padding: 0 16px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .bill-title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;   
    }

    .bill-info-box {
      display: flex;
      align-items: center;

      .bill-info-item {
        color: #666;
        font-size: 13px;
        margin-right: 16px;
      }
    }
  }
</style>
