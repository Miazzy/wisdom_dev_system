<template>
  <div class="indicator">
    <div class="icon" :style="'background-color: ' + props.color"></div>
    <div class="info">
      <div class="title">{{ props.title }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';

  const props = defineProps({
    color: { type: String, default: 'red' },
    title: { type: String, default: '' },
    value: { type: Number, default: 0 },
    showValue: { type: Boolean, default: true },
  });

  const values = ref();
  const showValueFlag = ref(false);

  watch(
    () => props.value,
    () => {
      values.value = props.value;
    },
  );

  watch(
    () => props.showValue,
    () => {
      showValueFlag.value = props.showValue;
    },
  );

  onMounted(() => {
    showValueFlag.value = props.showValue;
    values.value = props.value;
  });
</script>

<style scoped>
  .indicator {
    display: flex;
    align-items: center;
  }

  .icon {
    flex-shrink: 0;
    width: 0.1rem;
    height: 0.1rem;
    margin-top: -0.2rem;
    margin-right: 0.1rem;
    border: 0.01rem solid #45A2E930;
    border-radius: 50%;
    vertical-align: top;
  }

  .info {
    display: flex;
    flex-direction: column;
    height: 0.4rem;
  }

  .title {
    width: 100%;
    color: rgb(255 255 255 / 60%);
    font-family: "Microsoft YaHei";
    font-size: 0.12rem;
    font-weight: 400;
  }

</style>
