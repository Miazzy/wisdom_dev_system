<template>
  <div class="footer">
    <div class="menu-item" :class="{'selected': props.selectedKey===item.key}" v-for="(item, index) in menus" :key="index" @click="handleClickMenu(item)">{{item.name}}</div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineProps } from 'vue';

  const props = defineProps({
    selectedKey: { type: String, default: '1' }, // 标题
  });

  const menus = ref([
    {
      name: '运营总览',
      key: '1'
    },
    {
      name: '智慧监视',
      key: '2'
    },
    {
      name: '智慧运维',
      key: '3'
    },
    {
      name: '智慧设备',
      key: '4'
    },
  ]);

  const handleClickMenu = (item) => {
    emit('change', item);
  };

  const emit = defineEmits(['change'])
</script>
<style>

</style>
<style lang="less" scoped>
  .footer {
    width: 100%;
    height: 0.9rem;
    background: url('../../../assets/images/operationScreen/footer-bg.png') no-repeat center/17.93rem auto;
    display: flex;
    justify-content: center;
    align-items: center;
    .menu-item {
      width: 1.3rem;
      height: 0.35rem;
      margin-right: 0.25rem;
      background: url('../../../assets/images/operationScreen/menu-bg.png') no-repeat center/100% 100%;
      font-size: 0.18rem;
      color: #03A9FF;
      line-height: 0.35rem;
      text-align: center;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &.selected {
        background: url('../../../assets/images/operationScreen/menu-selected-bg.png') no-repeat center/100% 100%;
        color: #00F6FF;
      }
    }
  }
</style>