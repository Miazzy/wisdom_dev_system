<template>
  <div class="number-display" :class="props.colorStyle">
    <div class="title-container">
      <div class="title" :style="{ fontSize: props.tsize }">{{ props.title }}</div>
      <div v-show="props?.subtitle" class="subtitle">
        <span v-show="props?.subtitle?.mtext">{{ props.subtitle.mtext }}</span>
        <span
          v-show="props?.subtitle?.mvalue"
          class="arrow"
          :class="props?.subtitle?.mvalue?.startsWith('-') ? 'arrow-negative' : 'arrow-positive'"
        >
          {{ props.subtitle.mvalue }}
        </span>
        <span v-show="props?.subtitle?.stext" style="margin-left: 0.1rem">{{
          props.subtitle.stext
        }}</span>
        <span
          v-show="props?.subtitle?.svalue"
          class="arrow"
          :class="props?.subtitle?.svalue?.startsWith('-') ? 'arrow-negative' : 'arrow-positive'"
          >{{ props.subtitle.svalue }}</span
        >
      </div>
    </div>
    <div class="number-container">
      <div class="icon-box">
        <div class="inner-box">
          <img v-if="props.colorStyle==='green'" class="icon-img" src="../../../assets/images/operationScreen/generation-icon.png">
          <img v-if="props.colorStyle==='blue'" class="icon-img" src="../../../assets/images/operationScreen/online-electric-icon.png">
        </div>
      </div>
      <div
        :class="`${digit == '.' ? 'number-dot' : 'number'}`"
        v-for="(digit, index) in digitArray"
        :key="index"
        :style="{
          fontSize: props.vsize,
          color: digit == '.' ? '' : props.vcolor,
        }"
      >
        <span style="display: inline-block;">{{ digit }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';

  // 将数字拆分成个位数字的数组
  const digitArray = ref([]);
  const props = defineProps({
    title: { type: String, default: '' },
    subtitle: { type: Object, default: {} as Object },
    value: { type: Number, default: 0 },
    tsize: { type: String, default: '0.14rem' },
    vsize: { type: String, default: '0.48rem' },
    vcolor: { type: String, default: '#FEFEFF' },
    colorStyle: {type: String, default: 'green' }
  });

  watch(
    () => props.value,
    () => {
      digitArray.value = String(props.value).split('').map(String) as never[];
    },
  );

  onMounted(() => {
    digitArray.value = String(props.value).split('').map(String) as never[];
  });
</script>

<style lang="less" scoped>
  .number-display {
    text-align: left;
  }

  .title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    font-family: 'Microsoft YaHei', '微软雅黑';
    font-size: 0.14rem;
    text-align: left;
    white-space: nowrap;
    line-height: 1;
    margin-bottom: 0.16rem;
  }

  .subtitle {
    transform: scale(0.80);
    color: #32afff;
    font-size: 0.12rem;
    white-space: nowrap;
  }

  .number-container {
    display: flex;
    align-items: center;
    justify-content: left;
  }

  .number {
    position: relative;
    width: 0.36rem;
    height: 0.6rem;
    margin: 0 0.03rem 0 0; /* 根据需要调整数字之间的间距 */
    border-radius: 0.04rem; /* 可以根据需要调整圆角 */
    font-weight: 600;
    line-height: 0.58rem; /* 调整行高以增加数字的高度 */
    text-align: center;
  }

  .number-dot {
    margin: 0 0.03rem 0 0; /* 根据需要调整数字之间的间距 */   
    font-weight: 600;
    line-height: 0.58rem; /* 调整行高以增加数字的高度 */
    text-align: center;
  }

  .arrow {
    margin-right: 0.04rem;
    margin-left: 0.04rem;
    color: #32afff;
  }

  .arrow-positive {
    color: #FF4F38;
  }

  .arrow-negative {
    color: #00BA24;
  }

  .arrow-positive::before {
    content: '▲';
    color: #FF4F38;
  }

  .arrow-negative::before {
    content: '▼';
    color: #00BA24;
  }

  .icon-box {
      width: 0.6rem;
      height: 0.6rem;
      padding: 0.06rem;
      border-radius: 0.04rem;
      margin-right: 0.2rem;
      .inner-box {
        width: 100%;
        height: 100%;
        border-radius: 0.04rem;
        padding-top: 0.1rem;
        text-align: center;
        .icon-img {
          display: inline-block;
          width: 0.3rem;
        }
      }
    }

  .green {
    .title {
      color: #00F6FF;
    }

    .number {
      border: 0.01rem solid rgba(0, 246, 255, 0.25);
      background-color: rgba(0, 246, 255, 0.2);
    }

    .number-dot {
      color: #00F6FF;
    }

    .icon-box {
      border:  0.01rem solid rgba(0, 246, 255, .25);
      .inner-box {
        background-color: rgba(0, 246, 255, .2);
      }
    }
  }

  .blue {
    .title {
      color: #16CFFE;
    }

    .number {
      border: 0.01rem solid rgba(22, 207, 254, .25);
      background-color: rgba(22, 207, 254, .2);
    }

    .number-dot {
      color: #16CFFE;
    }

    .icon-box {
      border: 0.01rem solid rgba(22, 207, 254, .25);
      .inner-box {
        background-color: rgba(22, 207, 254, .2);
      }
    }
  }
</style>
