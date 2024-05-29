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
  RENDER_ENGINE_URL: 'http://139.9.148.32:9090/',
};

// 附件预览枚举
export enum FILE_PREVIEW {
  PREVIEW_DOMAIN = 'http://122.9.154.245',
  PREVIEW_PORT = '8012',
  DOWNLOAD_DOMAIN = 'http://139.9.148.32',
  DOWNLOAD_PORT = '48080',
  FILE_DOMAIN = 'http://192.168.0.200',
  FILE_PORT = '48080',
  IMAGE_TYPES = '[".jpg",".jpeg",".png",".gif",".bmp",".ico",".jfif",".webp"]',
}

// 大屏白名单路由
export const ScreenList = [
  ['/#/frame/cockpit/overview', '/#/CockpitOverview'],
  ['/#/frame/cockpit/operation', '/#/CockpitOperation'],
  ['/#/frame/cockpit/property', '/#/CockpitProperty'],
  ['/#/frame/cockpit/security', '/#/CockpitSecurity'],
  ['/#/frame/cockpit/composition', '/#/CockpitComposition'],
  ['/#/frame/cockpit/power', '/#/CockpitPower'],
  ['/#/frame/groupOperation', '/#/groupOperation'],
  ['/#/frame/stationOperation', '/#/stationOperation'],
];

// 大屏白名单路由
export const ScreenRouteList = ScreenList.map((item) => item[1].slice(2));

// 附件预览图片类型
export const PICTURE_TYPES = JSON.parse(FILE_PREVIEW.IMAGE_TYPES);
