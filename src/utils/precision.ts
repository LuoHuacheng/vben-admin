/**
 * @file 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
 * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
 */

/**
 * 把错误的数据转正
 * strip(0.09999999999999998)=0.1
 */
function strip(num: number, precision = 12) {
  return +parseFloat(num.toPrecision(precision));
}

/**
 * 科学记数法
 */
function parseSnToString(num: number | string) {
  const numString: any = String(num);
  if (!numString.includes('e')) return num;
  const zeroLength = numString.split('-')[1] - 1;
  const noZeroNum = numString.split('e')[0].replace('.', '');
  return `0.${'0'.repeat(zeroLength)}${noZeroNum}`;
}

/**
 * Return digits length of a number
 * @param {*} num } num Input number
 */
function digitLength(num: number) {
  // Get digit length of e
  const eSplit = num.toString().split(/[eE]/);
  const len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0);
  return len > 0 ? len : 0;
}

/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数 */
function float2Fixed(num: number) {
  if (num.toString().indexOf('e') === -1) {
    return Number(num.toString().replace('.', ''));
  }
  const dLen = digitLength(num);
  return dLen > 0 ? num * 10 ** dLen : num;
}

/**
 * 检测数字是否越界，如果越界给出提示 */
function checkBoundary(num: number) {
  if (
    (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) &&
    process.env.NODE_ENV === 'development'
  ) {
    // eslint-disable-next-line
    console.warn(
      `${num} is beyond boundary when transfer to integer, the results may not be accurate`,
    );
  }
}

/**
 * 精确乘法
 */
function times(num1: number, num2: number, ...others: number[]) {
  if (others.length > 0) {
    return times(times(num1, num2), others[0], ...others.slice(1));
  }
  const num1Changed = float2Fixed(num1);
  const num2Changed = float2Fixed(num2);
  const baseNum = digitLength(num1) + digitLength(num2);
  const leftValue = num1Changed * num2Changed;
  checkBoundary(leftValue);

  return leftValue / 10 ** baseNum;
}

/**
 * 精确加法
 */
function plus(num1: number, num2: number, ...others: number[]) {
  if (others.length > 0) {
    return plus(plus(num1, num2), others[0], ...others.slice(1));
  }
  const baseNum = 10 ** Math.max(digitLength(num1), digitLength(num2));
  return (times(num1, baseNum) + times(num2, baseNum)) / baseNum;
}

/**
 * 精确减法
 */
function minus(num1: number, num2: number, ...others: number[]) {
  if (others.length > 0) {
    return minus(minus(num1, num2), others[0], ...others.slice(1));
  }
  const baseNum = 10 ** Math.max(digitLength(num1), digitLength(num2));
  return (times(num1, baseNum) - times(num2, baseNum)) / baseNum;
}

/**
 * 精确除法
 */
function divide(num1: number, num2: number, ...others: number[]) {
  if (others.length > 0) {
    return divide(divide(num1, num2), others[0], ...others.slice(1));
  }
  const num1Changed = float2Fixed(num1);
  const num2Changed = float2Fixed(num2);
  checkBoundary(num1Changed);
  checkBoundary(num2Changed);
  if (num2Changed === 0) return 0;
  const diff = digitLength(num2) - digitLength(num1);
  return times(num1Changed / num2Changed, 10 ** diff);
}

/**
 * 四舍五入
 */
function round(num: number, ratio: number) {
  const base = 10 ** ratio;
  return divide(Math.round(times(num, base)), base);
}

/**
 * 四舍五入支持科学记数法
 */
function roundScience(num: number, ratio: number) {
  const base = 10 ** ratio;
  return parseSnToString(divide(Math.round(times(num, base)), base));
}

/**
 * 截取指定位数
 */
function slice(num: number, decimal: number) {
  const numArr = num.toString().split('.');
  const [numArr0, numArr1] = numArr;
  let numString: string | number;
  if (!numArr1) {
    numString = numArr0;
  } else {
    numString =
      numArr1.length > decimal ? `${numArr0}.${numArr1.slice(0, decimal - numArr1.length)}` : num;
  }
  return Number(numString);
}

/**
 * 截取指定位数, 位数不够则补0
 */
function slice2String(num: number, decimal: number) {
  const numArr = num.toString().split('.');
  const [numArr0, numArr1] = numArr;
  let numString: string | number;
  if (!numArr1) {
    numString = `${numArr0}.${'0'.repeat(decimal)}`;
  } else if (numArr1.length > decimal) {
    numString = `${numArr0}.${numArr1.slice(0, decimal - numArr1.length)}`;
  } else {
    numString = `${num}${'0'.repeat(decimal - numArr1.length)}`;
  }
  return numString;
}

export {
  strip,
  plus,
  minus,
  times,
  divide,
  round,
  roundScience,
  digitLength,
  float2Fixed,
  slice,
  slice2String,
  parseSnToString,
};

export default {
  strip,
  plus,
  minus,
  times,
  divide,
  round,
  roundScience,
  digitLength,
  float2Fixed,
  slice,
  slice2String,
  parseSnToString,
};
