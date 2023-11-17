<template>
  <div class="indicator">
    <div class="icon" :style="'background-color: ' + props.color"></div>
    <div class="info">
      <div class="title">{{ props.title }}</div>
      <div v-if="props.showValue" class="value">{{ values }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  const props = defineProps({
    color: { type: String, default: 'red' },
    title: { type: String, default: '' },
    value: { type: Number, default: 0 },
    showValue: { type: Boolean, default: true}
  });

  const values = ref('');

  onMounted(() => {
    if(props.showValue) {
      values.value = props.value.toFixed(2) + '%';
    }   
  });
</script>

<style scoped>
  .indicator {
    display: flex;
    align-items: center;
  }

  .icon {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    margin-top: -20px;
    margin-right: 10px;
    border: 1px solid #45A2E930;
    border-radius: 50%;
    vertical-align: top;
  }

  .info {
    display: flex;
    flex-direction: column;
    height: 40px;
  }

  .title {
    width: 100%;
    color: rgb(255 255 255 / 60%);
    font-family: "Microsoft YaHei";
    font-size: 12px;
    font-weight: 400;
  }

  .value {
    width: 100%;
    height: 12px;
    color: #FFF;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    font-weight: 400;
  }
</style>
