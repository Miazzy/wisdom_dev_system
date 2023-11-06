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
  import LeftContent from '/@/views/da/cockpit/security/LeftContent.vue';
  import MiddleContent from '/@/views/da/cockpit/security/MiddleContent.vue';
  import RightContent from '/@/views/da/cockpit/security/RightContent.vue';

  const title = ref('安全驾驶舱');
</script>

<style lang="less" scoped>
  .layout {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
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
