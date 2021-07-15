import queryString from 'query-string'
import { ParamConfig } from '../interface'

export const getValue = (obj: any, path: string = '', defaultValue: any = undefined) => {
  const result = String.prototype.split
    .call(path, /[[\].]+/)
    .filter(Boolean)
    .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
  return result === undefined ? defaultValue : result
}

export const setValue = (obj: any, path: string = '', value: any) => {
  const pathList = String.prototype.split
    .call(path, /[[\].]+/)
    .filter(Boolean)

  const lastNode = pathList.slice(0, -1)
    .reduce((res, key, index) => {
      if (isNaN(Number(path[index + 1]))) {
        // 后一个节点索引为数字
        if (Object.prototype.toString.call(res[key]) !== '[object Array]') {
          res[key] = {}
        }
      } else {
        // 后一个节点索引为文本
        /* istanbul ignore file */
        if (Object.prototype.toString.call(res[key]) !== '[object Object]') {
          res[key] = []
        }
      }
      return res[key]
    }, obj)

  lastNode[pathList[pathList.length - 1]] = value

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
