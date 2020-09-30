/**
 * rules Created by LiuSiyao on 2019/5/21.
 */
const regularExpression = {
  baseNumber: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
  mobilePhone: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
  telephone: /\d{3}-\d{8}$|\d{4}-\d{7,8}$/,
  plateNumber: /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/,
  ip: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,
  dateTimeFormat24: /^\d{4}[/-](0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])\s+(0[0-9]|1[0-9]|2[0-3]){1}:(0?[1-5]|[0-5][0-9]){1}:(0?[0-6]|[0-5][0-9]){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1})$/
}
const ruleUtils = {
  triggerMessage (trigger) {
    return `${trigger === 'change' ? '选择' : '输入'}`
  },
  password (rule, value, callback) {
    // 登录密码，6-18位，字母数字特殊字符
      let numberCount = 0
      let letterCount = 0
      let character = 0
      let length = value.length
      if (length < 6 || length > 18) {
          callback('请输入6~18位字母、数字和符号两种及以上组合')
      }
      for (let i = 0; i < length; i++) {
          if (/^[\d]$/i.test(value.charAt(i))) {
              numberCount = numberCount + 1
          } else if (/^[a-zA-Z]$/i.test(value.charAt(i))) {
              letterCount = letterCount + 1
          } else if (/^[!@#$%^&*()_+-|{}]$/i.test(value.charAt(i))) {
              character = character + 1
          } else {
              callback('符号只支持!@#$%^&*()_+-|{}')
          }
      }
      if ((numberCount + character) === 0 || (character + letterCount === 0) || (numberCount + letterCount) === 0) {
          callback('请输入6~18位字母、数字和符号两种及以上组合')
      }
      callback()
  },
  // 校验固话或手机号
  validPhone (rule, value, callback) {
    if (value === '' || value === undefined || value === null) {
      callback()
    } else {
      if (regularExpression.mobilePhone.test(value) || regularExpression.telephone.test(value)) {
        callback()
      } else {
        callback(new Error())
      }
    }
  },
  // 校验身份证
  checkIdNumber (rule, value, callback) {
    var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    var parityBit = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    var varArray = new Array();
    var lngProduct = 0;
    var intCheckDigit;
    var intStrLen = 0
    var idNumber = ''
    if (value) {
      intStrLen = value.length;
      idNumber = value;
    }
    if (intStrLen !== 0 && value !== undefined) {
      // initialize
      if (intStrLen !== 18) {
        callback(new Error('请输入正确的身份证号'))
      }
      // check and set value
      for (var i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < '0' || varArray[i] > '9') && (i !== 17)) {
          callback(new Error('请输入正确的身份证号'))
        } else if (i < 17) {
          varArray[i] = varArray[i] * factorArr[i];
        }
      }
      if (intStrLen === 18) {
        // check date
        var date8 = idNumber.substring(6, 14);
        if (ruleUtils.isDate8(date8) === false) {
          callback(new Error('请输入正确的身份证号'))
        }
        // calculate the sum of the products
        for (i = 0; i < 17; i++) {
          lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = parityBit[lngProduct % 11];
        // check last digit
        if (varArray[17] !== intCheckDigit) {
          callback(new Error('请输入正确的身份证号'))
        }
      } else { // length is 15
        // check date
        var date6 = idNumber.substring(6, 12);
        if (ruleUtils.isDate6(date6) === false) {
          callback(new Error('请输入正确的身份证号'))
        }
      }
    }
    callback()
  },
  isDate8 (sDate) {
    if (!/^[0-9]{8}$/.test(sDate)) {
      return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    day = sDate.substring(6, 8);
    var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (year < 1700 || year > 2500) return false
    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) iaMonthDays[1] = 29;
    if (month < 1 || month > 12) return false
    if (day < 1 || day > iaMonthDays[month - 1]) return false
    return true
  },
  isDate6 (sDate) {
    if (!/^[0-9]{6}$/.test(sDate)) {
      return false;
    }
    var year, month;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    if (year < 1700 || year > 2500) return false
    if (month < 1 || month > 12) return false
    return true
  }
}
const rules = {
  /**
   * 必填校验
   * @param name 名称
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{trigger: string, message: (*|string), required: boolean}}
   */
  required ({name, trigger = 'blur', message}) {
    return { required: true, trigger,message : message || `请${ruleUtils.triggerMessage(trigger)}${name}` }
  },
  /**
   * 基础数字校验
   * @param name 名称
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{pattern: RegExp, trigger: string, message: (*|string)}}
   */
  number ({name, trigger = 'blur', message}) {
    return { pattern: regularExpression.baseNumber, trigger, message: message || `${name}只能输入数字` }
  },
  /**
   * 范围校验
   * @param name 名称
   * @param number 是否是数字类型 默认为false
   * @param min 最小值
   * @param max 最大值
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{min: *, max: *, trigger: string, message: (*|string)}}
   */
  range ({name, number = false, min, max, trigger = 'blur', message}) {
    let defaultMessage = ''
    if (min !== undefined && max !== undefined) {
      if (number) {
        defaultMessage = `${name}只能在${min}-${max}之间`
      } else {
        defaultMessage = `${name}只能输入${min}-${max}个字符`
      }
    } else if (min !== undefined) {
      if (number) {
        defaultMessage = `${name}不能小于${min}`
      } else {
        defaultMessage = `${name}至少输入${min}个字符`
      }

    } else if (max !== undefined) {
      if (number) {
        defaultMessage = `${name}不能大于${max}`
      } else {
        defaultMessage = `${name}最多输入${max}个字符`
      }
    }
    if (number) {
      return {type: 'number', min, max, trigger, transform: (val) => {
        if (val === '' || val === undefined || val === null) {
          return null
        } else {
          return parseFloat(val)
        }
        }, message: message || defaultMessage}
    } else {
      return {min, max, trigger, message: message || defaultMessage}
    }
  },
  /**
   * 小数位数校验
   * @param name 名称
   * @param maxLength 长度限制 默认值 2
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{pattern: string, trigger: string, message: (*|string)}}
   */
  decimals ({name, maxLength = 2, trigger = 'blur', message}) {
    let pattern = '^[0-9]+(\\.[0-9]{1,' + maxLength + '})?$'
    return { pattern, trigger, message: message || `${name}最多只能输入${maxLength}位小数` }
  },
  phone ({name = '电话号', trigger = 'blur', message}) {
    return {validator: ruleUtils.validPhone, trigger, message: message || `请输入正确的${name}`}
  },
  /**
   * 手机号校验
   * @param name 名称
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{pattern: RegExp, trigger: string, message: (*|string)}}
   */
  mobilePhone ({name = '手机号', trigger = 'blur', message}) {
    return { pattern: regularExpression.mobilePhone, trigger, message: message || `请输入正确的${name}` }
  },
  /**
   * 固话校验
   * @param name 名称
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{pattern: RegExp, trigger: string, message: (*|string)}}
   */
  telephone ({name = '电话号', trigger = 'blur', message}) {
    return { pattern: regularExpression.telephone, trigger, message: message || `请输入正确的${name}` }
  },
  /**
   * 车牌号校验
   * @param name 名称
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{pattern: RegExp, trigger: string, message: (*|string)}}
   */
  plateNumber ({name = '车牌号', trigger = 'blur', message}) {
    return { pattern: regularExpression.plateNumber, trigger, message: message || `请输入正确的${name}` }
  },
  /**
   * 身份证号校验
   * @param name 名称
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{validator: ruleUtils.checkIdNumber, trigger: string, message: (*|string)}}
   */
  idNumber ({name = '身份证号', trigger = 'blur', message}) {
    return {validator: ruleUtils.checkIdNumber, trigger, message: message || `请输入正确的${name}`}
  },
  /**
   * 链接校验
   * @param name 名称
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{trigger: string, type: string, message: (*|string)}}
   */
  url ({name = '链接', trigger = 'blur', message}) {
    return { type: 'url', trigger, message: message || `请输入正确的${name}` }
  },
  /**
   * 邮箱校验
   * @param name 名称
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{trigger: string, type: string, message: (*|string)}}
   */
  email ({name = '邮箱', trigger = 'blur', message}) {
    return { type: 'email', trigger, message: message || `请输入正确的${name}` }
  },
  /**
   * 日期时间格式校验
   * @param name 名称
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{pattern: RegExp, trigger: string, message: (*|string)}}
   */
  dateTimeFormat24 ({name = '日期', trigger = 'blur', message}) {
    return { pattern: regularExpression.dateTimeFormat24, trigger, message: message || `请输入正确的${name}` }
  },
  password ({trigger = 'blur'}) {
    return {validator: ruleUtils.password, trigger}
  },
  /**
   * IP校验
   * @param name 名称
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{pattern: RegExp, trigger: string, message: (*|string)}}
   */
  ip ({name = 'IP', trigger = 'blur', message}) {
    return { pattern: regularExpression.ip, trigger, message: message || `请输入正确的${name}` }
  },
  /**
   * 正则校验
   * @param pattern 正则
   * @param trigger 触发方式
   * @param message 自定义信息
   * @returns {{pattern: *, trigger: string, message: (*|string)}}
   */
  pattern ({name, pattern, trigger = 'blur', message}) {
    return { pattern, trigger, message: message || `请输入正确的${name}` }
  }
}
export default {
  regularExpression,
  ruleUtils,
  rules
}
