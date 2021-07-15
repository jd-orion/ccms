import React from 'react'
import QueryString from 'query-string'
import { getValue } from '../../util/value'
import { componentType } from '.'
import { request } from '../../util/request'
import { APIConfig, ParamConfig } from '../../interface'

import { FieldConfigs as getFieldConfigs } from './'
/**
 * 表单项基类配置文件格式定义
 * - field:    表单项字段名
 * - type:     表单项类型
 * - * text:     短文本类型
 * - * form:     子表单类型
 * - label:    表单项名称
 * - required: 表单项必填
 * - readonly: 表单项只读
 * - disabled: 表单项不可编辑
 * - default:  表单项默认值
 * - - type:     默认值类型
 * - - * static:   固定值
 * - - * data:     上一步骤数据
 * - - * query:    页面GET方法传参
 * - - * hash:     页面HASH传参
 * - - * interface: 接口入参获取
 * - - value:    默认值（static类型使用）
 * - - field:    字段名（data/query/hash类型使用）（hash类型选填）
 */
export interface FieldConfig extends componentType {
  field: string
  label: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean
  display?: 'none'
  default?: {
    type: 'static' | 'data' | 'query' | 'hash' | 'interface' | 'step' | 'all'
    value?: any
    field?: string
    api?: APIConfig
    apiResponse?: string
    step?: string | number
  },
  condition?: {
    statement?: string
    params?: Array<{
      field?: string
      data?: ParamConfig
    }>
  }
}

/**
 * 表单项配置文件格式定义 - 枚举
 */
export type FieldConfigs = getFieldConfigs

/**
 * 表单项子类需实现的方法
 * - reset:    表单项重置当前值
 * - set:      表单项设置当前值
 * - get:      表单项获取当前值
 * - validate: 表单项的值校验方法
 */
export interface IField<T> {
  reset: () => Promise<T>
  set: (value: T) => Promise<void>
  get: () => Promise<T>
  validate: (value: T) => Promise<true | FieldError[]>
  fieldFormat: () => Promise<{}>
}

/**
 * 表单项子类需要的入参
 * - ref:
 * - formLayout:
 * - value:
 * - data:
 * - step:
 * - config:
 * - onChange:
 */
export interface FieldProps<C extends FieldConfig, T> {
  ref: (instance: Field<C, {}, any> | null) => void
  formLayout: 'horizontal' | 'vertical' | 'inline'
  value: T,
  record: { [field: string]: any },
  data: any[],
  step: number,
  config: C
  onChange: (value: T) => Promise<void>
}

/**
 * 表单项配置接口获取数据需要的入参
* - url: 请求地址
* - method: 请求类型
* - withCredentials?: 跨域是否提供凭据信息
* - response: 返回值
* - format?: 格式化返回值
* - responseArrayKey?: format === 'array' 时配置 key 值
* - responseArrayValue?: format === 'array' 时配置 value 值
 */
export interface FieldInterface {
  interface?: {
    url: string
    method: 'GET' | 'POST' | 'get' | 'post'
    withCredentials?: boolean
    response: string
    format?: 'array' | 'key'
    responseArrayKey?: string
    responseArrayValue?: string
  }
}

/**
 * 表单项基类
 * - C: 表单项的配置文件类型
 * - E: 表单项的渲染方法入参
 * - T: 表单项的值类型
 * - S: 表单项的扩展状态
 */
export class Field<C extends FieldConfig, E, T, S = {}> extends React.Component<FieldProps<C, T>, S> implements IField<T> {
  static defaultProps = {
    config: {}
  };

  /**
   * 获取默认值
   */
  defaultValue = async () => {
    const {
      config,
      data,
      step
    } = this.props
    /* istanbul ignore file */
    if (config.default !== undefined) {
      switch (config.default.type) {
        case 'static':
          if (config.default.value !== '' || config.default.value !== null || config.default.value !== undefined) return config.default.value
          break
        case 'data':
          if (data && data[step] && config.default.field) {
            return getValue(data[step], config.default.field)
          }
          break
        case 'query':
          if (window.location.search && config.default.field) {
            const query = QueryString.parse(window.location.search)
            return getValue(query, config.default.field)
          }
          break
        case 'hash':
          if (window.location.hash) {
            if (config.default.field) {
              try {
                const hash = JSON.parse(window.location.hash.substr(1))
                return getValue(hash, config.default.field)
              } catch (e) { }
            } else {
              return window.location.hash.substr(1)
            }
          }
          break
        case 'step':
          if (config.default.step) {
            if (data && data[config.default.step] && config.default.field) {
              return getValue(data[config.default.step], config.default.field)
            }
          }
          break
        case 'all':
          return data
        case 'interface':
          if (config.default.api) {
            let res = await request(config.default.api)
            res = getValue(res, config.default.apiResponse)
            return res
          }
          break
      }
    }

    return undefined
  }

  reset: () => Promise<T> = async () => {
    return this.props.value
  };

  set: (value: T) => Promise<void> = async (value) => {
    const {
      onChange
    } = this.props
    if (onChange) {
      onChange(value)
    }
  };

  get: () => Promise<T> = async () => {
    return this.props.value
  }

  validate: (value: T) => Promise<true | FieldError[]> = async () => {
    return true
  };

  fieldFormat: () => Promise<{}> = async () => {
    return {}
  }

  renderComponent = (props: E) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Field组件。
    </React.Fragment>
  }

  render = () => {
    return (<></>)
  }
}

export class FieldError {
  message: string
  constructor (message: string) {
    this.message = message
  }
}
