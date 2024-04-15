import * as ProcessInstanceApi from '@/api/bpm/processInstance';
import { addTabPage } from '@/utils/route';
import { useUserStore } from '/@/store/modules/user';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();
const userStore = useUserStore();

export const toUnderline = (str) => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

export const toFlowPage = async (bizId) => {
  const flowData = await ProcessInstanceApi.getFlowData(bizId);
  if(flowData){
    let tabName = getTabName(flowData.status,flowData.name,flowData.startUserId,flowData.isHandle);
    let isReadOnly = ((tabName.indexOf(t('common.action.view')) != -1 || tabName.indexOf(t('common.action.approval')) != -1)?'true':'false');
    addTabPage(flowData.viewPath, tabName, { id: bizId, processInstanceId: flowData.processInstanceId, page_readonly: isReadOnly });
  }
};

export const getTabName = (status,flowName,startUserId, isHandle) => {
  let tabName = t('common.action.view');
  let userId = userStore.getUserInfo?.userId;
  let isEqual = (userId == startUserId?true:false);
  if(status == 0 && isEqual){
    tabName = t('common.action.edit');
  } else if(status == 1 && isHandle > 0){
    tabName = t('common.action.approval');
  }
  return tabName+flowName;
};


