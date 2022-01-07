import React from 'react'
import { ParamConfig } from '../../interface'

import { DetailFieldConfigs as getFieldConfigs } from './'
import ParamHelper from '../../util/param'
/**
 * 详情页表单项基类配置文件格式定义
 * - field:    表单项字段名
 * - label:    表单项名称
 * - defaultValue:  表单项默认值
 * - display: 是否可见
 * - - type:     默认值类型
 * - - * static:   固定值
 * - - * data:     上一步骤数据
 * - - * query:    页面GET方法传参
 * - - * hash:     页面HASH传参
 * - - * interface: 接口入参获取
 * - - value:    默认值（static类型使用）
 * - - field:    字段名（data/query/hash类型使用）（hash类型选填）
 */
export interface DetailFieldConfig {
  field: string
  label: string
  columns?: {
    type: 'span' | 'width'
    value: number | string,
    wrap: boolean
    gutter: number | string
  }
  display?: 'none'
  defaultValue?: ParamConfig,
  condition?: DetailFieldConditionConfig
  layout?: 'horizontal' | 'vertical'
  // styles?: object
}

export interface DetailFieldConditionConfig {
  statement?: string
  params?: Array<{
    field?: string
    data?: ParamConfig
  }>
  debug?: boolean
}

/**
 * 详情页表单项配置文件格式定义 - 枚举
 */
export type DetailFieldConfigs = getFieldConfigs

/**
 * 详情页表单项子类需实现的方法
 * - reset:    表单项重置当前值
 * - set:      表单项设置当前值
 * - get:      表单项获取当前值
 * - validate: 表单项的值校验方法
 */
export interface IDetailField<T> {
  reset: () => Promise<T>
  set: (value: T) => Promise<void>
  get: () => Promise<T>
  validate: (value: T) => Promise<true | DetailFieldError[]>
  fieldFormat: () => Promise<{}>
}

/**
 * 详情页表单项子类需要的入参
 * - ref:
 * - formLayout:
 * - value:
 * - data:
 * - step:
 * - config:
 * - onChange:
 */
export interface DetailFieldProps<C extends DetailFieldConfig, T> {
  // 挂载事件
  ref: (instance: DetailField<C, {}, any> | null) => void
  formLayout: 'horizontal' | 'vertical'
  value: T,
  record: { [field: string]: any },
  data: any[],
  step: number,
  config: C
  // TODO 待删除
  onChange: (value: T) => Promise<void>
  // 事件：设置值
  onValueSet: (path: string, value: T, validation: true | DetailFieldError[]) => Promise<void>
  // // 事件：置空值
  onValueUnset: (path: string, validation: true | DetailFieldError[]) => Promise<void>
  // 事件：修改值 - 列表 - 追加
  onValueListAppend: (path: string, value: any, validation: true | DetailFieldError[]) => Promise<void>
  // 事件：修改值 - 列表 - 删除
  onValueListSplice: (path: string, index: number, count: number, validation: true | DetailFieldError[]) => Promise<void>
  baseRoute: string,
  loadDomain: (domain: string) => Promise<string>
}

/**
 * 详情页配置接口获取数据需要的入参
* - url: 请求地址
* - method: 请求类型
* - withCredentials?: 跨域是否提供凭据信息
* - response: 返回值
* - format?: 格式化返回值
* - responseArrayKey?: format === 'array' 时配置 key 值
* - responseArrayValue?: format === 'array' 时配置 value 值
 */
export interface DetailFieldInterface {
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
 * 详情项基类
 * - C: 表单项的配置文件类型
 * - E: 表单项的渲染方法入参
 * - T: 表单项的值类型
 * - S: 表单项的扩展状态
 */
export class DetailField<C extends DetailFieldConfig, E, T, S = {}> extends React.Component<DetailFieldProps<C, T>, S> implements IDetailField<T> {
  static defaultProps = {
    config: {}
  };

  /**
   * 获取默认值
   */
  defaultValue = async () => {
    const {
      config
    } = this.props
    if (config.defaultValue !== undefined) {
      return ParamHelper(config.defaultValue, { record: this.props.record, data: this.props.data, step: this.props.step })
    }

    return undefined
  }

  reset: () => Promise<T> = async () => {
    return this.defaultValue()
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

  validate: (value: T) => Promise<true | DetailFieldError[]> = async () => {
    return true
  };

  fieldFormat: () => Promise<{}> = async () => {
    return {}
  }

  didMount: () => Promise<void> = async () => { }

  renderComponent = (props: E) => {
    return <React.Fragment>
      当前UI库未实现该展示类型
    </React.Fragment>
  }

  render = () => {
    return (<React.Fragment>
      当前UI库未实现该展示类型
    </React.Fragment>)
  }
}

export class DetailFieldError {
  message: string
  constructor(message: string) {
    this.message = message
  }
}
