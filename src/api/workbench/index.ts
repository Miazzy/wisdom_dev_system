import { defHttp } from '@/utils/http/axios';

// 查询通知公告列表
export function getNoticeAndAnnouncementPage(params) {
  return defHttp.get(
    { url: '/po/workbench/notice-and-announcement-page', params },
    { isOnlyResult: true },
  );
}
