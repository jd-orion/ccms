import React from 'react'
import { ColumnsConfig, ParamConfig } from '../../interface'

import { FieldConfigs as getFieldConfigs } from './'
import ParamHelper from '../../util/param'
import { updateCommonPrefixItem } from '../../util/value'
import { ConditionConfig } from '../../util/condition'
import { StatementConfig } from '../../util/statement'
import { isEqual, get } from 'lodash'

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
  defaultValue?: ParamConfig,
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
  // 挂载事件
  ref: (instance: Field<C, {}, any> | null) => void
  // 挂载引用
  form: React.ReactNode
  formLayout: 'horizontal' | 'vertical' | 'inline'
  value: T,
  record: { [field: string]: any },
  data: any[],
  config: C
  // TODO 待删除
  onChange: (value: T) => Promise<void>
  // 事件：设置值  noPathCombination：为true时不做路径拼接
  onValueSet: (path: string, value: T, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => Promise<void>
  // 事件：置空值
  onValueUnset: (path: string, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => Promise<void>
  // 事件：修改值 - 列表 - 追加
  onValueListAppend: (path: string, value: any, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => Promise<void>
  // 事件：修改值 - 列表 - 删除
  onValueListSplice: (path: string, index: number, count: number, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => Promise<void>
  // 事件：修改值 - 列表 - 修改顺序
  onValueListSort: (path: string, index: number, sortType: 'up' | 'down', validation: true | FieldError[], options?: { noPathCombination?: boolean }) => Promise<void>
  baseRoute: string,
  containerPath: string, // 容器组件所在路径以字段拼接展示  1.3.0新增
  onReportFields?: (field: string) => Promise<void> // 向父组件上报依赖字段  1.3.0新增
  step: { [field: string]: any } // 传递formValue
  loadDomain: (domain: string) => Promise<string>
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
  dependentFields: string[] = [] // 组件param依赖字段存放数组  1.3.0新增
  static defaultProps = {
    config: {}
  };

  /**
   * 获取默认值
   */
  defaultValue : () => Promise<any> = async () => {
    const {
      config
    } = this.props
    if (config.defaultValue !== undefined) {
      return ParamHelper(config.defaultValue, { record: this.props.record, data: this.props.data, step: this.props.step }, this)
    }

    return undefined
  }

  reset: () => Promise<T> = async () => {
    return this.defaultValue()
  };

  set: (value: any) => Promise<any> = async (value) => {
    return value
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

  didMount: () => Promise<void> = async () => { }

  /**
   * 上报param依赖字段名称
   * @param field
   */
  handleReportFields: (field: string) => void = async (field) => {
    const update: string[] | boolean = updateCommonPrefixItem(this.dependentFields, field)
    if (typeof update === 'boolean') return
    this.dependentFields = update
    this.props.onReportFields && await this.props.onReportFields(field)
  }

  renderComponent = (props: E) => {
    return <React.Fragment>
      当前UI库未实现该表单类型
    </React.Fragment>
  }

  shouldComponentUpdate (nextProps: FieldProps<C, T>, nextState: S) {
    // console.log('nextProps', nextProps, this.props, nextProps.value == this.props.value);

    const dependentFieldsArr = this.dependentFields
    // console.log('dependentFieldsArr',dependentFieldsArr);
    let dependentIsChange = false
    if (dependentFieldsArr && dependentFieldsArr.length) {
      for (let i = dependentFieldsArr.length; i >= 0; i--) {
        const nextDependentField = get(nextProps.step, dependentFieldsArr[i])
        const currentDependentField = get(this.props.step, dependentFieldsArr[i])

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
    if (!dependentIsChange && isEqual(this.state, nextState) && nextProps.value === this.props.value && this.props.config === nextProps.config) {
      // console.log('no update' );
      return false
    }
    return true
  }

  render = () => {
    return (<React.Fragment>
      当前UI库未实现该表单类型
    </React.Fragment>)
  }
}

export interface DisplayProps<C extends FieldConfig, T> {
  value: T,
  record: { [field: string]: any },
  data: any[],
  step: { [field: string]: any }
  config: C,
  // 事件：设置值
  onValueSet: (path: string, value: T, options?: { noPathCombination?: boolean }) => Promise<void>
  // 事件：置空值
  onValueUnset: (path: string, options?: { noPathCombination?: boolean }) => Promise<void>
  // 事件：修改值 - 列表 - 追加
  onValueListAppend: (path: string, value: any, options?: { noPathCombination?: boolean }) => Promise<void>
  // 事件：修改值 - 列表 - 删除
  onValueListSplice: (path: string, index: number, count: number, options?: { noPathCombination?: boolean }) => Promise<void>
  baseRoute: string,
  loadDomain: (domain: string) => Promise<string>
}

export class Display<C extends FieldConfig, E, T, S = {}> extends React.Component<DisplayProps<C, T>, S> {
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

  set: (value: any) => Promise<any> = async (value) => {
    return value
  };

  get: () => Promise<T> = async () => {
    return this.props.value
  }

  renderComponent = (props: E) => {
    return <React.Fragment>
      当前UI库未实现该表单类型
    </React.Fragment>
  }

  didMount: () => Promise<void> = async () => { }

  render = () => {
    return (<React.Fragment>
      当前UI库未实现该表单类型
    </React.Fragment>)
  }
}

export class FieldError {
  message: string
  constructor (message: string) {
    this.message = message
  }
}
