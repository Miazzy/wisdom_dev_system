<template>
  <a-button class="print-btn" @click="printPage">打印</a-button>
</template>
<script lang="ts" setup>
  import printJS from 'print-js';

  const props = defineProps({
    config: {
      type: Object,
      default: {},
    },
  });
  const defaultConfig = {
    printable: 'app',
    type: 'html',
    maxWidth: 1100,
    scanStyles: false,
    css: './css/printStyle.css',
  };
  // 打印
  const printPage = () => {
    let printJSConfig = {};
    Object.assign(printJSConfig, defaultConfig, props.config);
    printJS(printJSConfig);
  };
</script>
