import React from 'react'
import marked from 'marked'
import { isEqual, get } from 'lodash'
import { ColumnsConfig, ParamConfig } from '../../interface'

import { FieldConfigs as getFieldConfigs } from '.'
import ParamHelper from '../../util/param'
import { updateCommonPrefixItem } from '../../util/value'
import { ConditionConfig } from '../../util/condition'
import StatementHelper, { StatementConfig } from '../../util/statement'
import { CCMSConfig, PageListItem } from '../../main'

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
 * - default:  表单项默认值  // 改为defaultValue
 * - - type:     默认值类型
 * - - * static:   固定值
 * - - * data:     上一步骤数据
 * - - * query:    页面GET方法传参
 * - - * hash:     页面HASH传参
 * - - * interface: 接口入参获取
 * - - value:    默认值（static类型使用）
 * - - field:    字段名（data/query/hash类型使用）（hash类型选填）
 */
export interface FieldConfig {
  field: string
  label: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean
  display?: 'none'
  defaultValue?: ParamConfig
  subLabelConfig?: {
    enable: boolean
    mode: 'plain' | 'markdown' | 'html'
    content: StatementConfig
  }
  condition?: ConditionConfig
  extra?: StatementConfig
  columns?: ColumnsConfig
  styles?: object
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
  set: (value: T) => Promise<unknown>
  get: () => Promise<T>
  validate: (value: T) => Promise<true | FieldError[]>
  fieldFormat: () => Promise<unknown>
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
  // 挂载事件
  ref: (instance: Field<C, unknown, unknown> | null) => void
  // 挂载引用
  form: React.ReactNode
  formLayout: 'horizontal' | 'vertical' | 'inline'
  value: T
  record: { [field: string]: unknown }
  data: object[]
  config: C
  // TODO 待删除
  onChange: (value: T) => Promise<void>
  // 事件：设置值  noPathCombination：为true时不做路径拼接
  onValueSet: (
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => Promise<void>
  // 事件：置空值
  onValueUnset: (
    path: string,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => Promise<void>
  // 事件：修改值 - 列表 - 追加
  onValueListAppend: (
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => Promise<void>
  // 事件：修改值 - 列表 - 删除
  onValueListSplice: (
    path: string,
    index: number,
    count: number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => Promise<void>
  // 事件：修改值 - 列表 - 修改顺序
  onValueListSort: (
    path: string,
    index: number,
    sortType: 'up' | 'down' | 'top' | 'bottom' | number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => Promise<void>
  checkPageAuth: (pageID: unknown) => Promise<boolean>
  loadPageURL: (pageID: unknown) => Promise<string>
  loadPageFrameURL: (pageID: unknown) => Promise<string>
  loadPageConfig: (pageID: unknown) => Promise<CCMSConfig>
  loadPageList: () => Promise<Array<PageListItem>>
  baseRoute: string
  loadDomain: (domain: string) => Promise<string>
  containerPath: string // 容器组件所在路径以字段拼接展示  1.3.0新增
  onReportFields?: (field: string) => Promise<void> // 向父组件上报依赖字段  1.3.0新增
  step: { [field: string]: unknown } // 传递formValue
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
export class Field<C extends FieldConfig, E, T, S = unknown>
  extends React.Component<FieldProps<C, T>, S>
  implements IField<T>
{
  dependentFields: string[] = [] // 组件param依赖字段存放数组  1.3.0新增

  shouldComponentUpdate(nextProps: FieldProps<C, T>, nextState: S) {
    const { value, config, step } = this.props
    const dependentFieldsArr = this.dependentFields
    let dependentIsChange = false
    if (dependentFieldsArr && dependentFieldsArr.length) {
      for (let i = dependentFieldsArr.length; i >= 0; i--) {
        const nextDependentField = get(nextProps.step, dependentFieldsArr[i])
        const currentDependentField = get(step, dependentFieldsArr[i])

        if ((nextDependentField || currentDependentField) && nextDependentField !== currentDependentField) {
          dependentIsChange = true
          break
        }
      }
    }

    /**
     * data提交前不变, 去掉这项的比较
     * record也不比较，需要比较的话就在dependentFieldsArr取出record绝对路径
     * */
    if (
      !dependentIsChange &&
      isEqual(this.state, nextState) &&
      nextProps.value === value &&
      config === nextProps.config
    ) {
      return false
    }
    return true
  }

  /**
   * 根据mode不同，处理subLabel内容
   * @param config 子项config
   * @returns
   */

  handleSubLabelContent(config) {
    const { data, step, containerPath } = this.props
    if (config?.subLabelConfig?.enable) {
      const content = StatementHelper(
        {
          statement: config.subLabelConfig?.content?.statement || '',
          params: config.subLabelConfig?.content?.params || []
        },
        {
          data,
          step,
          containerPath,
          record: {}
        }
      ).replace(/(^\s*)|(\s*$)/g, '')
      const mode = config.subLabelConfig?.mode
      switch (mode) {
        case 'markdown':
          // eslint-disable-next-line
          return <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        case 'html':
          // eslint-disable-next-line
          return <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: content }}></div>
        default:
          return <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
      }
    }
    return undefined
  }

  /**
   * 获取默认值
   */
  defaultValue: () => Promise<T> = async () => {
    const { config, record, data, step, containerPath } = this.props
    if (config.defaultValue !== undefined) {
      return ParamHelper(config.defaultValue, { record, data, step, containerPath }, this)
    }

    return undefined
  }

  reset: () => Promise<T> = async () => {
    return this.defaultValue()
  }

  set: (value: T) => Promise<unknown> = async (value) => {
    return value
  }

  get: () => Promise<T> = async () => {
    const { value } = this.props
    return value
  }

  validate: (value: T) => Promise<true | FieldError[]> = async () => {
    return true
  }

  fieldFormat: () => Promise<unknown> = async () => {
    return {}
  }

  didMount: () => Promise<void> = async () => {
    /* ... */
  }

  /**
   * 上报param依赖字段名称
   * @param field
   */
  handleReportFields: (field: string) => void = async (field) => {
    const { onReportFields } = this.props
    const update: string[] | boolean = updateCommonPrefixItem(this.dependentFields, field)
    if (typeof update === 'boolean') return
    this.dependentFields = update
    onReportFields && (await onReportFields(field))
  }

  renderComponent: (props: E) => JSX.Element = () => {
    return <>当前UI库未实现该表单类型</>
  }

  render() {
    return <>当前UI库未实现该表单类型</>
  }
}

export interface DisplayProps<C extends FieldConfig, T> {
  value: T
  record: { [field: string]: unknown }
  data: object[]
  step: { [field: string]: unknown }
  config: C
  // 事件：设置值
  onValueSet: (path: string, value: unknown, options?: { noPathCombination?: boolean }) => Promise<void>
  // 事件：置空值
  onValueUnset: (path: string, options?: { noPathCombination?: boolean }) => Promise<void>
  // 事件：修改值 - 列表 - 追加
  onValueListAppend: (path: string, value: unknown, options?: { noPathCombination?: boolean }) => Promise<void>
  // 事件：修改值 - 列表 - 删除
  onValueListSplice: (
    path: string,
    index: number,
    count: number,
    options?: { noPathCombination?: boolean }
  ) => Promise<void>
  baseRoute: string
  loadDomain: (domain: string) => Promise<string>
  containerPath: string
}

export abstract class Display<C extends FieldConfig, E, T, S = unknown> extends React.Component<DisplayProps<C, T>, S> {
  defaultValue = async () => {
    const { config, record, data, step, containerPath } = this.props
    if (config.defaultValue !== undefined) {
      return ParamHelper(config.defaultValue, {
        record,
        data,
        step,
        containerPath
      })
    }

    return undefined
  }

  reset: () => Promise<T> = async () => {
    return this.defaultValue()
  }

  set: (value: T) => Promise<unknown> = async (value) => {
    return value
  }

  get: () => Promise<T> = async () => {
    const { value } = this.props
    return value
  }

  renderComponent: (props: E) => JSX.Element = () => {
    return <>当前UI库未实现该表单类型</>
  }

  didMount: () => Promise<void> = async () => {
    /* ... */
  }

  render() {
    return <>当前UI库未实现该表单类型</>
  }
}

export class FieldError {
  message: string

  constructor(message: string) {
    this.message = message
  }
}
