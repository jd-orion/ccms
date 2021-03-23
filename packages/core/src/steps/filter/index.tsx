import React from 'react'
import { Field, FieldConfigs } from '../../components/formFields/common'
import Step, { StepConfig, StepProps } from '../common'
import FieldComponents from '../../components/formFields'

/**
 * 表单步骤配置文件格式定义
 * - layout: 表单布局类型
 * - * horizontal: 左侧文本、右侧输入框、纵向排列
 * - * vertical:   顶部文本、底部输入框、纵向排列
 * - * inline:     左侧文本、右侧输入框、横向排列
 * - fields: 表单项配置列表
 */
export interface FilterConfig extends StepConfig {
  type: 'filter'
  fields?: FieldConfigs[]
}

/**
 * 表单步骤组件 - UI渲染方法 - 入参格式
 * - layout:   表单布局类型
 * - * horizontal: 左侧文本、右侧输入框、纵向排列
 * - * vertical:   顶部文本、底部输入框、纵向排列
 * - * inline:     左侧文本、右侧输入框、横向排列
 * - submit:   表单提交操作事件
 * - cancel:   表单取消操作事件
 * - children: 表单内容
 */
export interface IFilter {
  onSubmit: () => Promise<any>
  onReset: () => Promise<any>
  children: React.ReactNode[]
}

/**
 * 表单项容器组件 - UI渲染方法 - 入参格式
 * - label:       表单项名称
 * - status:      表单项状态
 * - * normal       默认状态
 * - * error        错误
 * - * loading      加载中
 * - description: 表单项说明
 * - message:     表单项消息
 * - layout:      表单项布局
 * - * horizontal:  左侧文本、右侧输入框、纵向排列
 * - * vertical:    顶部文本、底部输入框、纵向排列
 * - * inline:      左侧文本、右侧输入框、横向排列
 * - children:    表单项内容
 */
export interface IFilterItem {
  label: string
  status: 'normal' | 'error' | 'loading'
  description?: string
  message?: string
  children: React.ReactNode
}

/**
 * 表单步骤组件 - 状态
 * - filterData: 表单的值
 */
interface FilterState {
  filterData: { [field: string]: { value: any, status: 'normal' | 'error' | 'loading', message?: string } }
}

/**
 * 表单步骤组件
 */
export default class FilterStep extends Step<FilterConfig, FilterState> {
  // 各表单项对应的类型所使用的UI组件的类
  getFieldComponents = (type: string) => FieldComponents[type]

  // 各表单项所使用的UI组件的实例
  fields: { [key: string]: Field<FieldConfigs, {}, any> | null } = {}

  /**
   * 初始化表单的值
   * @param props
   */
  constructor (props: StepProps<FilterConfig>) {
    super(props)
    this.state = {
      filterData: {}
    }
  }

  /**
   * 重写表单步骤装载事件
   */
  willMount = async () => {
    // 初始化表单的值
    const filterData: { [field: string]: { value: any, status: 'normal' | 'error' | 'loading', message?: string } } = {}

    // 处理表单步骤配置文件的默认值
    const {
      config: {
        fields = []
      },
      onMount
    } = this.props

    for (const field of fields) {
      if (this.fields[field.field]) {
        const filterItem = this.fields[field.field]
        if (filterItem) {
          const value = await filterItem.reset()
          const validation = await filterItem.validate(value)
          if (validation === true) {
            filterData[field.field] = { value, status: 'normal' }
          } else {
            filterData[field.field] = { value, status: 'error', message: validation[0].message }
          }
        }
      }
    }
    await this.setState({
      filterData: filterData
    })

    // 表单初始化结束，展示表单界面。
    onMount()
    this.handleSubmit()
  }

  /**
   * 处理表单提交事件
   */
  handleSubmit = async () => {
    const {
      config: {
        fields = []
      },
      onSubmit
    } = this.props

    const data: { [key: string]: any } = {}

    for (const field of fields) {
      if (Object.keys(this.fields).includes(field.field)) {
        const fieldItem = this.fields[field.field]
        if (fieldItem !== null) {
          const value = await fieldItem.get()
          const validation = await fieldItem.validate(value)
          if (validation !== true) {
            console.warn('表单项中存在问题')
            return
          }
          data[field.field] = value
        }
      }
    }

    console.info('表单校验通过', data)
    onSubmit(data, false)
  }

  /**
   * 处理表单返回事件
   */
  handleReset = async () => {
    this.willMount()
  }

  /**
   * 处理表单项change事件
   * @param field 表单项配置
   * @param value 目标值
   */
  handleChange = async (field: FieldConfigs, value: any) => {
    const {
      onChange
    } = this.props
    const {
      filterData
    } = this.state

    const fieldRef = this.fields[field.field]
    if (fieldRef) {
      const validation = await fieldRef.validate(value)
      if (validation === true) {
        filterData[field.field] = { value, status: 'normal' }
      } else {
        filterData[field.field] = { value, status: 'error', message: validation[0].message }
      }

      await this.setState({
        filterData: filterData
      })
      if (onChange) {
        onChange(filterData)
      }
    }
  }

  /**
   * 表单步骤组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderComponent = (props: IFilter) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Filter组件。
    </React.Fragment>
  }

  /**
   * 表单项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderItemComponent = (props: IFilterItem) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FilterItem组件。
    </React.Fragment>
  }

  render () {
    const {
      data,
      step,
      config: {
        fields = []
      }
    } = this.props

    const {
      filterData
    } = this.state

    return (
      <React.Fragment>
        {/* 渲染表单 */}
        {this.renderComponent({
          onSubmit: async () => this.handleSubmit(),
          onReset: async () => this.handleReset(),
          children: fields.map((field, index) => {
            let children = <React.Fragment></React.Fragment>

            const FieldComponent = this.getFieldComponents(field.type)

            if (FieldComponent) {
              children = <FieldComponent
                ref={(fieldRef: Field<FieldConfigs, any, any> | null) => { this.fields[field.field] = fieldRef }}
                formLayout={'inline'}
                value={(filterData[field.field] || {}).value}
                data={data}
                step={step}
                config={field}
                onChange={(value: any) => this.handleChange(field, value)}
              />
            }

            // 渲染表单项容器
            return (
              <React.Fragment key={index}>
                {
                  this.renderItemComponent({
                    label: field.label,
                    status: (filterData[field.field] || {}).status || 'normal',
                    message: (filterData[field.field] || {}).message,
                    children
                  })
                }
              </React.Fragment>
            )
          })
        })}
      </React.Fragment>
    )
  }
}
