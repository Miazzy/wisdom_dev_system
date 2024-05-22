<template>
  <div class="bill-title-box" :style="`height: ${DEF_HEIGHT}px;`">
    <div class="bill-title">{{ options.subject }}</div>
    <div class="bill-info-box">
      <div class="bill-info-item left">
        <div class="bill-info-item-content">单据编号：{{ options.billCode || '' }}</div>
      </div>
      <div class="bill-info-item center">
        <div class="bill-info-item-content">制单日期：{{ options.fillinDate || '' }}</div>
      </div>
      <div class="bill-info-item right">
        <div class="bill-info-item-content">创建人：{{ options.personMemberName || '' }}</div>
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
  const DEF_HEIGHT = 56;
</script>
<style lang="less" scoped>
  .bill-title-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .bill-title {
      font-size: 16px;
    }

    .bill-info-box {
      display: flex;
      align-items: center;

      .bill-info-item {
        font-size: 13px;
        margin-right: 16px;
      }
    }
  }
</style>
