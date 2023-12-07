export class Maths {
  // 加法函数
  static add(a: number | string, b: number | string, precision?: number): number {
    const result = Number(a) + Number(b);
    return Maths.handlePrecision(result, precision);
  }

  // 减法函数
  static subtract(a: number | string, b: number | string, precision?: number): number {
    const result = Number(a) - Number(b);
    return Maths.handlePrecision(result, precision);
  }

  // 乘法函数
  static multiply(a: number | string, b: number | string, precision?: number): number {
    const result = Number(a) * Number(b);
    return Maths.handlePrecision(result, precision);
  }

  // 除法函数
  static divide(a: number | string, b: number | string, precision?: number): number {
    const numB = Number(b);
    if (numB === 0) {
      throw new Error('Division by zero is not allowed.');
    }
    const result = Number(a) / numB;
    return Maths.handlePrecision(result, precision);
  }

  // 处理保留小数位
  private static handlePrecision(value: number, precision?: number): number {
    if (precision !== undefined) {
      const multiplier = 10 ** precision;
      return Math.round(value * multiplier) / multiplier;
    }
    return value;
  }
}
