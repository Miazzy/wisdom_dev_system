import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

/***
 * @description 日期工具库
 * @class  DateUtil 日期工具库
 * @classdesc 日期工具库，格式化日期
 */
export class DateTools {
  constructor() {}

  public static format(date: Date | string, format?: string): string {
    // 如果只有一个参数，则第一个参数为format参数，date为当前值
    if (typeof date == 'string' && (format == null || format == undefined)) {
      format = date;
      date = new Date();
    } else if (typeof date == 'string' && !(format == null || format == undefined)) {
      date = new Date(date); // 类型为字符串
    } else if (typeof date == 'number') {
      date = new Date(date); // 类型为时间戳
    }

    if (format == null || format == undefined || format == '') {
      format = DATE_FORMAT;
    }

    const targetDate = date as Date;
    const padZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

    const year = targetDate.getFullYear();
    const month = padZero(targetDate.getMonth() + 1);
    const day = padZero(targetDate.getDate());
    const hours = padZero(targetDate.getHours());
    const minutes = padZero(targetDate.getMinutes());
    const seconds = padZero(targetDate.getSeconds());
    const milliseconds = padZero(targetDate.getMilliseconds());

    return format
      .replace(/yyyy/g, year.toString())
      .replace(/YYYY/g, year.toString())
      .replace(/MM/g, month)
      .replace(/dd/g, day)
      .replace(/DD/g, day)
      .replace(/HH/g, hours)
      .replace(/hh/g, hours)
      .replace(/mm/g, minutes)
      .replace(/ss/g, seconds)
      .replace(/SSS/g, milliseconds);
  }
}

export function formatToDateTime(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatDate(date: Date | number, format: string = DATE_FORMAT): string {
  if (!date) {
    return '';
  }
  return dayjs(date).format(format);
}

export function formatTime(date: Date | number, format: string = DATE_TIME_FORMAT): string {
  if (!date) {
    return '';
  }
  return dayjs(date).format(format);
}

export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

export const dateFormatter = (row, column, cellValue) => {
  if (!cellValue) {
    return;
  }
  return formatToDate(cellValue);
};

export const timeFormatter = (row, column, cellValue) => {
  if (!cellValue) {
    return;
  }
  return formatToDateTime(cellValue);
};

/**
 * 将毫秒，转换成时间字符串。例如说，xx 分钟
 *
 * @param ms 毫秒
 * @returns {string} 字符串
 */
export function formatPast2(ms) {
  const day = Math.floor(ms / (24 * 60 * 60 * 1000))
  const hour = Math.floor(ms / (60 * 60 * 1000) - day * 24)
  const minute = Math.floor(ms / (60 * 1000) - day * 24 * 60 - hour * 60)
  const second = Math.floor(ms / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60)
  if (day > 0) {
    return day + '天' + hour + '小时' + minute + '分钟'
  }
  if (hour > 0) {
    return hour + '小时' + minute + '分钟'
  }
  if (minute > 0) {
    return minute + '分钟'
  }
  if (second > 0) {
    return second + '秒'
  } else {
    return 0 + '秒'
  }
}

export const dateUtil = dayjs;
