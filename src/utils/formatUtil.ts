export function formatNumber(value: string, format: string) {
  const reg1 = /.0+/; // 小数点.后0的个数表示保留几位
  const reg2 = /,#+/; // 逗号,后的#表示数字的分隔符为几位
  let newValue = String(value);
  if (format?.match(reg1)?.[0]) {
    const fixedNum = format.match(reg1)[0].length - 1;
    let decimalPart = newValue.split('.')[1];
    if (decimalPart?.length > fixedNum) {
      newValue = Number(value).toFixed(fixedNum);
    }
  } else {
    newValue = Number(value).toFixed(0);
  }
  if (format?.match(reg2)?.[0]) {
    const splitNum = format.match(reg2)[0].length - 1;
    let intPart = newValue.split('.')[0];
    let decimalPart = newValue.split('.')[1] ? '.' + newValue.split('.')[1] : '';
    let formattedNumber = '';
    while (intPart.length > splitNum) {
      formattedNumber = ',' + intPart.substring(intPart.length - splitNum) + formattedNumber;
      intPart = intPart.substring(0, intPart.length - splitNum);
    }
    newValue = intPart + formattedNumber + decimalPart;
  }
  return newValue;
}

export function formatMoney(value: string, format: string) {
  const prefix = format.slice(0, 1);
  return value >= 0
    ? prefix + formatNumber(value, format)
    : '-' + prefix + formatNumber(value, format).slice(1);
}
