<template>
  <!-- 工作栏 -->
  <div class="workspace-box">
    <ng-form-design />
  </div>
</template>
<script lang="ts" setup>
  import { NgFormDesign } from 'ng-form-elementplus';
  import 'ng-form-elementplus/lib/style.css';
</script>
<style scoped>
  .workspace-box {
    width: calc(100% - 20px);
    height: auto;
    margin: 10px;
    background: #fefefe;
  }
</style>
