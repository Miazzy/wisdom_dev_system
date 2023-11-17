<template>
  <div class="layout">
    <div class="dashboard">
      <CockpitHeader :title="title" />
      <div class="top-content-box">
        <TopContent />
      </div>
      <div class="content">
        <LeftContent />
        <!-- <MiddleContent /> -->
        <RightContent />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import CockpitHeader from '/@/components/Framework/Chart/CockpitHeader.vue';
  import LeftContent from '/@/views/da/cockpit/property/LeftContent.vue';
  import RightContent from '/@/views/da/cockpit/property/RightContent.vue';
  import TopContent from '/@/views/da/cockpit/property/TopContent.vue';

  const title = ref('资产驾驶舱');
</script>

<style lang="less" scoped>
  .layout {
    width: 100%;
    height: 100%;
    background: url('../../../../assets/images/background3.png') no-repeat center/cover;

    .dashboard {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .content {
        display: flex;
        flex: 1;
        flex-shrink: 0;
      }
    }
  }
</style>
