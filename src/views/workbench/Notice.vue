<template>
  <a-card title="信息公告" :bordered="false">
    <template #extra>
      <span @click="toMorePage">更多 &gt;</span>
    </template>
    <div class="card-content">
      <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
        <a-tab-pane key="1" tab="通知公告">
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
        </a-tab-pane>
        <a-tab-pane key="2" tab="资讯" force-render>
          <ul class="notice-list-box">
            <li
              class="notice-item"
              @click="toInformation(item)"
              v-for="(item, index) in informationList"
              :key="index"
            >
              <span class="item-dot"></span>
              <span class="title-text">{{ item.title }}</span>
              <span class="dept-text">{{ item.type }}</span>
              <span class="person-text">{{ item.person }}</span>
              <span class="time-text">{{ item.time }}</span>
            </li>
          </ul>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import * as DateUtil from '/@/utils/dateUtil';
  import * as WorkbenchApi from '@/api/workbench';
  import { addTabPage } from '@/utils/route';

  const urls: any = ref([
    { key: 'notice', url: '/oa/info/officedoc/view' },
    { key: 'announcement', url: '/oa/info/officedoc/view' },
  ]);
  const noticeList = ref([]);
  const informationList = ref([]);

  const toMorePage = () => {
    if(activeKey.value == '1'){
      addTabPage(`/oa/info/query/index`, '信息查询');
    }else{
      addTabPage('/oa/info/informationquery/index', '资讯查询');
    }
    
  };


  const activeKey = ref('1');
  const handleTabChange = (item) => {
    if (item === '1') {
      getNoticeAndAnnouncementPage();
    } else if (item === '2') {
      getInformation();
    } 
  };

  const toNotice = (item) => {
    const element = urls.value.find((e) => {
      return e?.key === item.businessType;
    });
    if (element) {
      var params = {
        bizId: item.id,
        module: element.key == 'notice' ? 'infoNotice' : 'officeDoc',
      };
      addTabPage(element.url, '通知公告详情', params);

      item.isRead = 1; //设置为已读
    }
  };

  const toInformation = (item) => {
    if(item.source === '1'){
      window.open(item.url);
    }else{
      addTabPage('/oa/info/informationquery/index', '资讯查询');
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

  const getInformation = async () => {
    const information = await WorkbenchApi.getInformationPage({
      pageNo: 1,
      pageSize: 7,
    });
    if (information) {
      informationList.value.splice(0, informationList.value.length);
      information.list.forEach((e) => {
        informationList.value.push({
          id: e.id,
          title: e.subject,
          type: e.typeText,
          source: e.source,
          url: e.url,
          person: e.personMemberName,
          time: DateUtil.formatToDate(e.finishedDate, 'YYYY-MM-DD HH:mm'),
          // isRead: e.isRead,
          // businessType: e.businessType,
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
        padding: 0 14px;
        overflow: hidden;
        opacity: 0.97;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }

      .dept-text {
        width: 12%;
        padding-right: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .person-text {
        width: 7%;
        padding-right: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time-text {
        width: 14%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
