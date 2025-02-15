/**
 * 数据字典工具类
 */
import { useDictStoreWithOut } from '@/store/modules/dict';
import { createLocalStorage } from '@/utils/cache';
import { DICT_DATA__KEY } from '@/enums/cacheEnum';

const ls = createLocalStorage();

export type InfoType = 'success' | 'info' | 'warning' | 'danger';

const dictStore = useDictStoreWithOut();

export enum DICT_TYPE {

  SYSTEM_MULTI_ORGANIZATION = "system_multi_organization",
  USER_TYPE = 'user_type',
  COMMON_STATUS = 'common_status',
  SYSTEM_TENANT_PACKAGE_ID = 'system_tenant_package_id',
  TERMINAL = 'terminal', // 终端
  CERTIFICATE = 'certificate',

  // ========== SYSTEM 模块 ==========
  SYSTEM_USER_SEX = 'system_user_sex',
  SYSTEM_MENU_TYPE = 'system_menu_type',
  SYSTEM_ROLE_TYPE = 'system_role_type',
  SYSTEM_DATA_SCOPE = 'system_data_scope',
  SYSTEM_NOTICE_TYPE = 'system_notice_type',
  SYSTEM_OPERATE_TYPE = 'system_operate_type',
  SYSTEM_LOGIN_TYPE = 'system_login_type',
  SYSTEM_LOGIN_RESULT = 'system_login_result',
  SYSTEM_SMS_CHANNEL_CODE = 'system_sms_channel_code',
  SYSTEM_SMS_TEMPLATE_TYPE = 'system_sms_template_type',
  SYSTEM_SMS_SEND_STATUS = 'system_sms_send_status',
  SYSTEM_SMS_RECEIVE_STATUS = 'system_sms_receive_status',
  SYSTEM_ERROR_CODE_TYPE = 'system_error_code_type',
  SYSTEM_OAUTH2_GRANT_TYPE = 'system_oauth2_grant_type',
  SYSTEM_MAIL_SEND_STATUS = 'system_mail_send_status',
  SYSTEM_NOTIFY_TEMPLATE_TYPE = 'system_notify_template_type',

  // ========== INFRA 模块 ==========
  INFRA_BOOLEAN_STRING = 'infra_boolean_string',
  INFRA_JOB_STATUS = 'infra_job_status',
  INFRA_JOB_LOG_STATUS = 'infra_job_log_status',
  INFRA_API_ERROR_LOG_PROCESS_STATUS = 'infra_api_error_log_process_status',
  INFRA_CONFIG_TYPE = 'infra_config_type',
  INFRA_CODEGEN_TEMPLATE_TYPE = 'infra_codegen_template_type',
  INFRA_CODEGEN_FRONT_TYPE = 'infra_codegen_front_type',
  INFRA_CODEGEN_SCENE = 'infra_codegen_scene',
  INFRA_FILE_STORAGE = 'infra_file_storage',

  // ========== BPM 模块 ==========
  BPM_MODEL_CATEGORY = 'bpm_model_category',
  BPM_MODEL_FORM_TYPE = 'bpm_model_form_type',
  BPM_TASK_ASSIGN_RULE_TYPE = 'bpm_task_assign_rule_type',
  BPM_PROCESS_INSTANCE_STATUS = 'bpm_process_instance_status',
  BPM_PROCESS_INSTANCE_RESULT = 'bpm_process_instance_result',
  BPM_TASK_ASSIGN_SCRIPT = 'bpm_task_assign_script',
  BPM_OA_LEAVE_TYPE = 'bpm_oa_leave_type',

  // ========== PAY 模块 ==========
  PAY_CHANNEL_CODE = 'pay_channel_code', // 支付渠道编码类型
  PAY_ORDER_STATUS = 'pay_order_status', // 商户支付订单状态
  PAY_REFUND_STATUS = 'pay_refund_status', // 退款订单状态
  PAY_NOTIFY_STATUS = 'pay_notify_status', // 商户支付回调状态
  PAY_NOTIFY_TYPE = 'pay_notify_type', // 商户支付回调状态

  // ========== MP 模块 ==========
  MP_AUTO_REPLY_REQUEST_MATCH = 'mp_auto_reply_request_match', // 自动回复请求匹配类型
  MP_MESSAGE_TYPE = 'mp_message_type', // 消息类型

  // ========== MALL - 会员模块 ==========
  MEMBER_POINT_BIZ_TYPE = 'member_point_biz_type', // 积分的业务类型
  MEMBER_EXPERIENCE_BIZ_TYPE = 'member_experience_biz_type', // 会员经验业务类型

  // ========== MALL - 商品模块 ==========
  PRODUCT_UNIT = 'product_unit', // 商品单位
  PRODUCT_SPU_STATUS = 'product_spu_status', //商品状态

  // ========== MALL - 交易模块 ==========
  EXPRESS_CHARGE_MODE = 'trade_delivery_express_charge_mode', //快递的计费方式
  TRADE_AFTER_SALE_STATUS = 'trade_after_sale_status', // 售后 - 状态
  TRADE_AFTER_SALE_WAY = 'trade_after_sale_way', // 售后 - 方式
  TRADE_AFTER_SALE_TYPE = 'trade_after_sale_type', // 售后 - 类型
  TRADE_ORDER_TYPE = 'trade_order_type', // 订单 - 类型
  TRADE_ORDER_STATUS = 'trade_order_status', // 订单 - 状态
  TRADE_ORDER_ITEM_AFTER_SALE_STATUS = 'trade_order_item_after_sale_status', // 订单项 - 售后状态
  TRADE_DELIVERY_TYPE = 'trade_delivery_type', // 配送方式
  BROKERAGE_ENABLED_CONDITION = 'brokerage_enabled_condition', // 分佣模式
  BROKERAGE_BIND_MODE = 'brokerage_bind_mode', // 分销关系绑定模式
  BROKERAGE_BANK_NAME = 'brokerage_bank_name', // 佣金提现银行
  BROKERAGE_WITHDRAW_TYPE = 'brokerage_withdraw_type', // 佣金冻结时间
  BROKERAGE_RECORD_BIZ_TYPE = 'brokerage_record_biz_type', // 佣金业务类型
  BROKERAGE_RECORD_STATUS = 'brokerage_record_status', // 佣金状态
  BROKERAGE_WITHDRAW_STATUS = 'brokerage_withdraw_status', // 佣金提现状态

  // ========== MALL - 营销模块 ==========
  PROMOTION_DISCOUNT_TYPE = 'promotion_discount_type', // 优惠类型
  PROMOTION_PRODUCT_SCOPE = 'promotion_product_scope', // 营销的商品范围
  PROMOTION_COUPON_TEMPLATE_VALIDITY_TYPE = 'promotion_coupon_template_validity_type', // 优惠劵模板的有限期类型
  PROMOTION_COUPON_STATUS = 'promotion_coupon_status', // 优惠劵的状态
  PROMOTION_COUPON_TAKE_TYPE = 'promotion_coupon_take_type', // 优惠劵的领取方式
  PROMOTION_ACTIVITY_STATUS = 'promotion_activity_status', // 优惠活动的状态
  PROMOTION_CONDITION_TYPE = 'promotion_condition_type', // 营销的条件类型枚举
}

export interface DictDataType {
  dictType: string;
  label: string;
  value: string | number | boolean;
  colorType: InfoType | '';
  cssClass: string;
}

export function getDictDatas(dictType: string) {
  return dictStore.getDictMap[dictType] || [];
}

export function getDictOpts(dictType: string) {
  return getDictDatas(dictType);
}

export async function initDictMapInfo(dictList: []) {
  const key = dictList.join(',');
  const map = await dictStore.fetchBackendData(key, { type: '' });
  Object.keys(map).forEach((key) => {
    const value = map[key];
    ls.set(DICT_DATA__KEY + key, value, 60 * 60 * 24 * 7);
  });
}

export function getDictOptions(dictType: string, valueType?: 'string' | 'number' | 'boolean') {
  const dictOption: DictDataType[] = [];
  const dictOptions: DictDataType[] = getDictDatas(dictType);
  if (dictOptions && dictOptions.length > 0) {
    dictOptions.forEach((dict: DictDataType) => {
      dictOption.push({
        ...dict,
        key: dict.value,
        value:
          valueType === 'string'
            ? `${dict.value}`
            : valueType === 'boolean'
            ? `${dict.value}` === 'true'
            : Number.parseInt(`${dict.value}`),
      });
    });
  }
  return dictOption;
}

export function getDictObj(dictType: string, value: any) {
  const dictOptions: DictDataType[] = getDictDatas(dictType);
  if (dictOptions) {
    dictOptions.forEach((dict: DictDataType) => {
      if (dict.value === value.toString()) return dict;
    });
  } else {
    return null;
  }
}

// 获取流程分类数据字典
export const getDictTypeWflow = () => {
  const type = JSON.parse(
    `[{"value":1,"label":"默认","colorType":"primary","cssClass":""},{"value":2,"label":"OA","colorType":"success","cssClass":""}]`,
  );
  return type;
};

// 获取表单类型数据字典
export const getBpmModelFormType = () => {
  const type = JSON.parse(
    `[{"dictType": "bpm_model_form_type","value": 10,"label": "流程表单","colorType": "","cssClass": ""},{"dictType": "bpm_model_form_type","value": 20,"label": "业务表单","colorType": "","cssClass": ""}]`,
  );
  return type;
};

// 获取字段选项
export const getIntDictOptions = (key: any) => {
  if (key === 'bpm_task_assign_script') {
    const type = JSON.parse(
      `[{"value":10,"label":"流程发起人","colorType":"","cssClass":""},{"value":20,"label":"流程发起人的一级领导","colorType":"","cssClass":""},{"value":21,"label":"流程发起人的二级领导","colorType":"","cssClass":""}]`,
    );
    return type;
  } else if (key === 'bpm_task_assign_rule_type') {
    const type = JSON.parse(
      `[{"value":10,"label":"角色","colorType":"info","cssClass":""},{"value":20,"label":"部门的成员","colorType":"primary","cssClass":""},{"value":21,"label":"部门的负责人","colorType":"primary","cssClass":""},{"value":22,"label":"岗位","colorType":"success","cssClass":""},{"value":30,"label":"用户","colorType":"info","cssClass":""}]`, // ,{"value":40,"label":"用户组","colorType":"warning","cssClass":""},{"value":50,"label":"自定义脚本","colorType":"danger","cssClass":""}
    );
    return type;
  } else if (key === 'bpm_model_category') {
    return null;
  }
  return null;
};
