<template>
  <a-card title="通知公告" :bordered="false">
    <template #extra>
      <span>更多 &gt;</span>
    </template>
    <div class="card-content">
      <ul class="notice-list-box">
        <li class="notice-item" v-for="(item, index) in noticeList" :key="index">
          <span class="item-dot"></span>
          <span class="title-text" :class="{isRead: item.isRead}">{{item.title}}</span>
          <span class="dept-text">{{item.dept}}</span>
          <span class="person-text">{{item.person}}</span>
          <span class="time-text">{{item.time}}</span>
        </li>
      </ul>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';

  const noticeList = ref([
    {
      title:
        '物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知',
      dept: '人行部',
      person: '冯美清',
      time: '2020-05-14 12:00',
      isRead: 1
    },
    {
      title:
        '物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知',
      dept: '人行部',
      person: '冯美清',
      time: '2020-05-14 12:00',
    },
    {
      title:
        '物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知',
      dept: '人行部',
      person: '冯美清',
      time: '2020-05-14 12:00',
    },
    {
      title:
        '物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知',
      dept: '人行部',
      person: '冯美清',
      time: '2020-05-14 12:00',
    },
    {
      title:
        '物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知',
      dept: '人行部',
      person: '冯美清',
      time: '2020-05-14 12:00',
    },
    {
      title:
        '物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知',
      dept: '人行部',
      person: '冯美清',
      time: '2020-05-14 12:00',
    },
    {
      title:
        '物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知物联发〔2023〕27号关于更新运营中心2023年第三季度电站“安全主要负责人”“安全员”名单的通知',
      dept: '人行部',
      person: '冯美清',
      time: '2020-05-14 12:00',
    },
  ]);
</script>

<style lang="less" scoped>
  .card-content {
    height: 318px;
    padding-top: 2px;
    .notice-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 42px;
      .item-dot {
        width: 5px;
        height: 5px;  
        border-radius: 50%;
      }
      .title-text {
        width: 76%;
        opacity: 0.97;       
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 14px;
        cursor: pointer;        
      }
      .dept-text,
      .person-text
       {
        padding-right: 14px;
        width: 7%;
      }
      .time-text {
        width: 11%;        
      }
    }
  }
</style>