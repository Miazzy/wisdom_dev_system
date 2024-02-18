<template>
  <a-card title="通知公告" :bordered="false">
    <template #extra>
      <span @click="toMorePage">更多 &gt;</span>
    </template>
    <div class="card-content">
      <ul class="notice-list-box">
        <li
          class="notice-item"
          @click="toNotice(item)"
          v-for="(item, index) in noticeList"
          :key="index"
        >
          <span class="item-dot"></span>
          <span class="title-text" :class="{ isRead: item.isRead }">{{ item.title }}</span>
          <span class="dept-text">{{ item.dept }}</span>
          <span class="person-text">{{ item.person }}</span>
          <span class="time-text">{{ item.time }}</span>
        </li>
      </ul>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import * as DateUtil from '/@/utils/dateUtil';
  import * as WorkbenchApi from '@/api/workbench';
  import { addTabPage } from '@/utils/route';
  // import { useRouter } from 'vue-router';
  // const router = useRouter();

  const urls: any = ref([
    { key: 'notice', url: '/oa/info/infonotice/create' },
    { key: 'announcement', url: '/oa/info/officedoc/create' },
  ]);
  const noticeList = ref([]);

  const toMorePage = () => {
    // router.push(`/oa/info/officedoc/index`);
    addTabPage(`/oa/info/officedoc/index`, '通知公告');
  };

  const toNotice = (item) => {
    const element = urls.value.find((e) => {
      return e?.key === item.businessType;
    });
    if (element) {
      // router.push({ path: element.url, query: { id: item.id } });
      addTabPage(element.url, '通知公告详情', { id: item.id });
    }
  };

  const getNoticeAndAnnouncementPage = async () => {
    const noticeAndAnnouncement = await WorkbenchApi.getNoticeAndAnnouncementPage({
      pageNo: 1,
      pageSize: 7,
    });
    if (noticeAndAnnouncement) {
      noticeList.value.splice(0, noticeList.value.length);
      noticeAndAnnouncement.list.forEach((e) => {
        noticeList.value.push({
          id: e.id,
          title: e.subject,
          dept: e.deptName,
          person: e.personMemberName,
          time: DateUtil.formatToDate(e.finishedDate, 'YYYY-MM-DD HH:mm'),
          isRead: e.isRead,
          businessType: e.businessType,
        });
      });
    }
  };

  /** 初始化 */
  onMounted(async () => {
    getNoticeAndAnnouncementPage();
  });
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
        width: 67%;
        opacity: 0.97;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 14px;
        cursor: pointer;
      }
      .dept-text {
        padding-right: 14px;
        width: 12%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .person-text {
        padding-right: 14px;
        width: 7%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .time-text {
        width: 14%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
