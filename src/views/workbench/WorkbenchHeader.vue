<template>
  <a-card :bordered="false">
    <div class="workbench-header">
      <div class="user-icon-box">
        <img class="user-icon-img" src="../../assets/images/header.jpg" />
      </div>
      <div class="info-box">
        <p class="black-text">上午好，卢晓东，开始您一天的工作吧！</p>
        <p class="grey-text">今日晴，20℃ - 32℃！</p>
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup></script>
<style lang="less" scoped>
  .workbench-header {
    height: 72px;
    display: flex;
    align-items: center;
    .user-icon-box {
      width: 46px;
      height: 46px;
      margin-right: 16px;
      border-radius: 50%;
      overflow: hidden;
      & > .user-icon-img {
        width: 100%;
      }
    }
    .info-box {
      line-height: 1;
      .black-text {
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 8px;
      }
      .grey-text {
        font-size: 12px;
        margin-bottom: 0;
      }
    }
  }
</style>
