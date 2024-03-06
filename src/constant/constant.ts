// 时间间隔枚举
export enum TimeInterval {
  ONE_SECOND = 1000 * 1,
  FIVE_SECOND = 1000 * 5,
  TEN_SECOND = 1000 * 10,
  HALF_MINUTE = 60000 * 0.5,
  ONE_MINUTE = 60000 * 1,
  FIVE_MINUTE = 60000 * 5,
  TEN_MINUTE = 60000 * 10,
  HALF_HOUR = 1800000 * 1,
  ONE_HOUR = 3600000 * 1,
  TWO_HOUR = 3600000 * 2,
  THREE_HOUR = 3600000 * 3,
  FOUR_HOUR = 3600000 * 4,
  FIVE_HOUR = 3600000 * 5,
  TEN_HOUR = 3600000 * 10,
}

// 配置信息
export const Config = {
  RENDER_ENGINE_URL: 'http://localhost:5175/',
};
