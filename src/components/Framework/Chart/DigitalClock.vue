<template>
  <div class="time-display">
    <div class="clock">
      <div class="hour">
        <span v-for="digit in currentTime.hours.split('')" :key="digit">{{ digit }}</span>
      </div>
      <span class="colon">:</span>
      <div class="minute">
        <span v-for="digit in currentTime.minutes.split('')" :key="digit">{{ digit }}</span>
      </div>
      <span class="colon">:</span>
      <div class="second">
        <span v-for="digit in currentTime.seconds.split('')" :key="digit">{{ digit }}</span>
      </div>
    </div>

    <div class="date">
      <span class="normal-font">{{ currentDate }}</span>
      <span class="normal-font" style="margin-left: 10px">{{ currentWeek }}</span>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';

  const currentTime = ref({
    hours: '',
    minutes: '',
    seconds: '',
  });

  const currentDate = ref('');
  const currentWeek = ref('');

  const updateClock = () => {
    const now = new Date();
    currentTime.value.hours = String(now.getHours()).padStart(2, '0');
    currentTime.value.minutes = String(now.getMinutes()).padStart(2, '0');
    currentTime.value.seconds = String(now.getSeconds()).padStart(2, '0');
    currentDate.value = now.toLocaleDateString();
    currentWeek.value = now.toLocaleDateString([], { weekday: 'long' });
  };

  onMounted(() => {
    // 更新时钟
    updateClock();
    // 每秒更新一次
    setInterval(updateClock, 1000);
  });
</script>

<style lang="less" scoped>
  .time-display {
    text-align: center;

    .clock {
      display: flex;
      justify-content: center;
      font-family: 'Digital';
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 4px;
      color: #32AFFF;
      div {
        width: 28px;
        display: flex;
        justify-content: center;
        span {
          flex: 50%;
        }
      }

      .colon {
        font-size: 20px;
        margin: 2px 5px 0px 5px;
      }
    }

    .date {
      margin-top: -6px;
      .normal-font {
        font-size: 14px;
        font-family: 'Microsoft YaHei';
      }
    }
  }
</style>
