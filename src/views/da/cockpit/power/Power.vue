<template>
  <div class="layout">
    <div class="dashboard">
      <CockpitHeader :title="title" />
      <div class="content">
        <LeftContent />
        <MiddleContent />
        <RightContent />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import CockpitHeader from '/@/components/Framework/Chart/CockpitHeader.vue';
  import LeftContent from '/@/views/da/cockpit/power/LeftContent.vue';
  import MiddleContent from '/@/views/da/cockpit/power/MiddleContent.vue';
  import RightContent from '/@/views/da/cockpit/power/RightContent.vue';

  const title = ref('电量驾驶舱');
</script>

<style lang="less" scoped>
  .layout {
    width: 100%;
    height: 100%;
    background: url('../../../../assets/images/background3.png') no-repeat center/cover;

    .dashboard {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .content {
        flex: 1;
        display: flex;
        flex-shrink: 0;
      }
    }
  }
</style>
