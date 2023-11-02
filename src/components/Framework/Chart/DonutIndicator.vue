<template>
  <div class="indicator">
    <div class="icon" :style="'background-color: ' + props.color"></div>
    <div class="info">
      <div class="title">{{ props.title }}</div>
      <div class="value">{{ values }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  const props = defineProps({
    color: { type: String, default: 'red' },
    title: { type: String, default: '' },
    value: { type: Number, default: 0 },
  });

  const values = ref('');

  onMounted(() => {
    values.value = props.value.toFixed(2) + '%';
  });
</script>

<style scoped>
  .indicator {
    display: flex;
    align-items: center;
  }

  .icon {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #45A2E930;
    margin-right: 10px;
    vertical-align: top;
    margin-top: -20px;
  }

  .info {
    display: flex;
    flex-direction: column;
    height: 40px;
  }

  .title {
    width: 100%;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
  }

  .value {
    width: 100%;
    height: 12px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FFFFFF;
  }
</style>
