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
    step: number
  }
) => {
  switch (config.source) {
    case 'record':
      return getValue(datas.record || {}, config.field)
    case 'data':
      return getValue(datas.data[datas.step], config.field)
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
    step: number
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
