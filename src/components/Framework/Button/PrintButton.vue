<template>
  <a-button class="print-btn" @click="printPage">打印</a-button>
</template>
<script lang="ts" setup>
  import printJS from 'print-js';

  const props = defineProps({
    config: {
      type: Object,
      default: {}, // 配置参数参考print-js
    },
  });

  // 默认打印配置
  const defaultConfig = {
    printable: 'app', // 文档来源：pdf或图像的url，html元素的id或json数据的对象
    type: 'html', // 可打印类型。可用的打印选项包括：pdf，html，image，json和raw-html。
    maxWidth: 1100, // 最大文档宽度（像素）。根据需要更改此项。在打印HTML，图像或JSON时使用。
    scanStyles: false, // 设置为false时，库不会处理应用于正在打印的html的样式。使用css参数时很有用。
    css: './css/printStyle.css', // 这允许我们传递一个或多个应该应用于正在打印的html的css文件URL。值可以是包含单个URL的字符串，也可以是包含多个URL的数组。
  };
  // 打印
  const printPage = () => {
    let printJSConfig = {};
    Object.assign(printJSConfig, defaultConfig, props.config);
    printJS(printJSConfig);
  };
</script>
