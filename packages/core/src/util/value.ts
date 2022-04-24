import queryString from 'query-string'
import { ParamConfig } from '../interface'
import { set, get, isArray, assignInWith, isObject, isUndefined } from 'lodash'

export const getValue = (obj: any, path: string = '', defaultValue: any = undefined) => {
  if (path === undefined) {
    return defaultValue
  } else if (path === '') {
    return obj === undefined ? defaultValue : obj
  } else {
    return get(obj, path, defaultValue)
  }
}

const merge = (a: any, b: any): any => {
  return assignInWith(a, b, (a, b) => {
    if (isUndefined(a) && isArray(b)) {
      a = []
    }
    if (isObject(b)) {
      if (isArray(a)) {
        return merge(a, b).filter((i: any) => i !== undefined)
      } else {
        return merge(a, b)
      }
    }
  })
}

export const setValue = (obj: any, path: string = '', value: any) => {
  if (path === '') {
    if (Object.prototype.toString.call(value) === '[object Object]') {
      obj = merge(obj, value)
    } else if (value !== undefined) {
      obj = value
    }
  } else {
    const source = get(obj, path)
    if (Object.prototype.toString.call(value) === '[object Object]' && Object.prototype.toString.call(source) === '[object Object]') {
      set(obj, path, merge(source, value))
    } else {
      set(obj, path, value)
    }
  }

  return obj
}

export const getParam = (
  config: ParamConfig,
  datas: {
    record?: object
    data: object[]
    step: { [field: string]: any }
  }
) => {
  switch (config.source) {
    case 'record':
      return getValue(datas.record || {}, config.field)
    case 'data':
      return getValue(datas.step, config.field)
    case 'source':
      return getValue(datas.data[0] || {}, config.field)
    case 'step':
      return getValue(datas.data[config.step] || {}, config.field)
    case 'url':
      return getValue(
        queryString.parse(window.location.search, { arrayFormat: 'bracket' }),
        config.field
      )
    case 'static':
      return config.value
  }
}

export const getParamText = (
  text: string,
  params: Array<{ field?: string, data?: ParamConfig }>,
  datas: {
    record?: object
    data: object[]
    step: { [field: string]: any }
  }
) => {
  for (const { field, data } of params) {
    if (field && data) {
      const paramValue = getParam(data, datas)
      // text = text.replaceAll('${' + field + '}', paramValue)
      const reg = new RegExp(`{${field}}`, 'gm')
      text = text.replace(reg, paramValue)
    }
  }
  return text
}

export const getBoolean = (value: any) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    return !(value === 'false' || value === '0')
  }
  if (typeof value === 'number') {
    return Boolean(value)
  }
  return false
}

/**
 * 处理list元素上移、下移
 * @param list  list
 * @param currentIndex  当前操作元素在list索引
 * @param sortType  up或down
 */
export const listItemMove = (list: any[], currentIndex: number, sortType: 'up' | 'down') => {
  switch (sortType) {
    case 'up':
      currentIndex !== 0 && (list[currentIndex] = list.splice(currentIndex - 1, 1, list[currentIndex])[0])
      break
    case 'down':
      currentIndex < list.length - 1 && (list[currentIndex] = list.splice(currentIndex + 1, 1, list[currentIndex])[0])
      break
  }
  return list
}

// 参数转化为链式路径
export const getChainPath = (...arg: any[]) => {
  const _fullPath = arg.join('.')
  const fullPath = _fullPath.replace(/(^\.*)|(\.*$)|(\.){2,}/g, '$3')
  return fullPath
}

/**
 * @param source 来源字符串
 * @param find  目标字符串
 * @returns  返回目标字符串出现在来源字符串中所有索引
 */
function indexes(source: string, find: string) {
  const result: number[] = []
  for (let i = 0; i < source.length; ++i) {
    if (source.substring(i, i + find.length) === find) {
      result.push(i)
    }
  }
  return result
}

/**
 * 获取一个数组中最长共同前缀
 *@param arr 入参数组的元素是二级及以上路径，为节省性能，该方法没有适配处理多个一级路径的共同前缀,一级路径没有共同前缀
 *
 * eg: 根据项目使用场景，如['81.mode', '81.me.1', '81.my.1', '81.m']的共同前缀为81，不可以是81.m
 */
export const getLongestCommonPrefix = (arr: string[]) => {
  if (arr.length === 0 || arr[0].length === 0) { return '' }
  for (let i = 0, len1 = arr[0].length; i < len1; i++) {
    const c = arr[0].charAt(i)
    for (let j = 1, len2 = arr.length; j < len2; j++) {
      if (i === arr[j].length || arr[j].charAt(i) !== c || (i === len1 - 1 && arr[j].length > len1 && arr[j].charAt(len1) !== '.')) {
        const _indexes = indexes(arr[0], '.')
        const res = arr[0].substring(0, i).replace(/\.+$/, '') // 去掉尾部'.'
        for (let n = 0; n < _indexes.length; n++) {
          if (res.length === _indexes[n]) {
            return res
          }
        }
        return res.replace(/\.+[^\\.]+$/, '')
      }
    }
  }
  return arr[0]
}

/**
 * @param arr 目标数组
 * @param sourceField 来源字段
 * @returns 与来源字段比较共同前缀后更新的数组 | 是否更新并上报
 *
 * eg: ['a.0', 'b']不会插入'a.0.c',会插入'a'替换'a.0',原数组改变为['a', 'b']
 */
export const updateCommonPrefixItem = (arr: string[], sourceField: string): string[] | boolean => {
  const reg = /[^\\.]+(?=\.?)/
  const sourceFieldPrefix = sourceField.match(reg)?.[0]
  const commonPrefixItemS = [sourceField]
  for (let i = arr.length - 1; i >= 0; i--) {
    const arrItem = arr[i]
    if (sourceField === arrItem) {
      return false
    }
    const arrItemPrefix = arrItem.match(reg)?.[0]
    if (arrItemPrefix && arrItemPrefix === sourceFieldPrefix) {
      arr.splice(i, 1)
      commonPrefixItemS.push(arrItem)
    }
  }

  arr.push(getLongestCommonPrefix(commonPrefixItemS))
  return arr
}
/**
 * 转化value数组中的值类型
 * @param list value数组
 * @param type 值类型
 * @returns value数组
 */
export const transformValueType = (list: any[], type: 'string' | 'number' | 'boolean' | undefined) => {
  switch (type) {
    case 'string':
      return list.map(v => String(v))

    case 'number':
      return list.map(v => +v)

    case 'boolean':
      return list.map(v => Boolean(v))

    default:
      return list
  }
}
