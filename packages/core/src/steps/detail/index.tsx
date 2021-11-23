import React from 'react'
import { DetailField, DetailFieldConfigs, DetailFieldError } from '../../components/detail/common'
import Step, { StepConfig, StepProps } from '../common'
import getALLComponents from '../../components/detail'
import { getValue, setValue } from '../../util/value'
import { ParamConfig } from '../../interface'
import ParamHelper from '../../util/param'
import { cloneDeep, get, set, unset } from 'lodash'
import ConditionHelper from '../../util/condition'

/**
 * 详情步骤配置文件格式定义
 * - type 对应 detail
 * - layout: 表单布局类型
 * - * horizontal: 左侧文本、右侧输入框、纵向排列
 * - * vertical:   顶部文本、底部输入框、纵向排列
 * - * inline:     左侧文本、右侧输入框、横向排列
 * - fields: 详情项配置列表
 * - defaultValue  默认值
 * - hiddenBack  是否隐藏返回按钮
 * - backText   返回按钮文案
 */
export interface DetailConfig extends StepConfig {
  type: 'detail'
  layout?: 'horizontal' | 'vertical' | 'inline'
  fields?: DetailFieldConfigs[]
  defaultValue?: ParamConfig
  hiddenBack?: boolean
  backText?: string
}

/**
 * 详情步骤组件 - UI渲染方法 - 入参格式
 * - layout:   表单布局类型
 * - * horizontal: 左侧文本、右侧输入框、纵向排列
 * - * vertical:   顶部文本、底部输入框、纵向排列
 * - * inline:     左侧文本、右侧输入框、横向排列
 * - children: 表单内容
 */
export interface IDetail {
  layout: 'horizontal' | 'vertical' | 'inline'
  children: React.ReactNode[]
  onBack?: () => Promise<any>
  backText?: string
}

/**
 * 详情项组件 - UI渲染方法
 * - key: react需要的unique key
 * - label:       详情项名称
 * - layout:      详情项布局
 * - visitable:  详情项可见性
 * - * horizontal:  左侧文本、右侧输入框、纵向排列
 * - * vertical:    顶部文本、底部输入框、纵向排列
 * - * inline:      左侧文本、右侧输入框、横向排列
 * - children:    详情项内容
 */
export interface IDetailItem {
  key: string | number,
  label: string
  layout: 'horizontal' | 'vertical' | 'inline'
  visitable: boolean
  fieldType: string
  children: React.ReactNode
}

/**
 * 详情步骤组件 - 状态
 * - formData: 表单的值
 */
interface DetailState {
  ready: boolean
  detailValue: { [field: string]: any }
  detailData: { status: 'normal' | 'error' | 'loading', message?: string, name: string }[]
}

/**
 * 表单步骤组件
 */
export default class DetailStep extends Step<DetailConfig, DetailState> {
  // 各详情项对应的类型所使用的UI组件的类
  getALLComponents = (type: any): typeof DetailField => getALLComponents[type]

  // 各详情项所使用的UI组件的实例
  detailFields: Array<DetailField<DetailFieldConfigs, {}, any> | null> = []
  detailFieldsMounted: Array<boolean> = []

  detailValue: { [field: string]: any } = {}
  detailData: { status: 'normal' | 'error' | 'loading', message?: string, name: string, hidden: boolean }[] = []

  /**
   * 初始化表单的值
   * @param props
   */
  constructor(props: StepProps<DetailConfig>) {
    super(props)
    this.state = {
      ready: false,
      detailValue: {},
      detailData: []
    }
  }

  /**
   * 重写表单步骤装载事件
   */
  stepPush = async () => {
    // 处理表单步骤配置文件的默认值
    const {
      config: {
        fields: detailFieldsConfig = []
      },
      data,
      step,
      onMount
    } = this.props

    const detailData = cloneDeep(this.state.detailData)

    if (this.props.config.defaultValue) {
      const detailDefault = ParamHelper(this.props.config.defaultValue, { data, step })
      for (const detailFieldIndex in detailFieldsConfig) {
        const detailFieldConfig = detailFieldsConfig[detailFieldIndex]
        const value = getValue(detailDefault, detailFieldConfig.field)
        this.detailValue = setValue(this.detailValue, detailFieldConfig.field, value)
        detailData[detailFieldIndex] = { status: 'normal', name: detailFieldConfig.label }
      }
    }

    await this.setState({
      ready: true,
      detailValue: this.detailValue,
      detailData: cloneDeep(detailData)
    })

    // 表单初始化结束，展示表单界面。
    onMount()
  }

  handleDetailFieldMount = async (detailFieldIndex: number) => {
    if (this.detailFieldsMounted[detailFieldIndex]) {
      return true
    }
    this.detailFieldsMounted[detailFieldIndex] = true

    const detailData = cloneDeep(this.state.detailData)

    if (this.detailFields[detailFieldIndex]) {
      const detailField = this.detailFields[detailFieldIndex]
      if (detailField) {
        const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]

        let value = getValue(this.detailValue, detailFieldConfig.field)
        if ((detailFieldConfig.defaultValue) && value === undefined) {
          value = await detailField.reset()
        }
        this.detailValue = setValue(this.detailValue, detailFieldConfig.field, value)

        const validation = await detailField.validate(value)
        if (validation === true) {
          detailData[detailFieldIndex] = { status: 'normal', name: detailFieldConfig.label }
        } else {
          // 首次进入错误提示; 
          detailData[detailFieldIndex] = { status: 'error', message: validation[0].message, name: detailFieldConfig.label }
        }
      }
    }

    await this.setState({
      detailValue: this.detailValue,
      detailData: cloneDeep(detailData)
    })
  }


  /**
   * 处理表单返回事件
   */
  handleCancel = async () => {
    const {
      onUnmount
    } = this.props

    onUnmount()
  }

  /**
   * 处理详情项change事件
   * @param field 详情项配置
   * @param value 目标值
   */
  handleChange = async (detailFieldIndex: number, value: any) => {
    const detailData = cloneDeep(this.state.detailData)

    const detailField = this.detailFields[detailFieldIndex]
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailField && detailFieldConfig) {
      this.detailValue = setValue(this.detailValue, detailFieldConfig.field, value)

      const validation = await detailField.validate(value)
      if (validation === true) {
        detailData[detailFieldIndex] = { status: 'normal', name: detailFieldConfig.label }
      } else {
        detailData[detailFieldIndex] = { status: 'error', message: validation[0].message, name: detailFieldConfig.label }
      }

      await this.setState({
        detailValue: this.detailValue,
        detailData
      })
      if (this.props.onChange) {
        this.props.onChange(this.detailValue)
      }
    }
  }

  handleValueSet = async (detailFieldIndex: number, path: string, value: any, validation: true | DetailFieldError[]) => {
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailFieldConfig) {
      const fullPath = detailFieldConfig.field === '' || path === '' ? `${detailFieldConfig.field}${path}` : `${detailFieldConfig.field}.${path}`

      set(this.detailValue, fullPath, value)
      this.setState({
        detailValue: this.detailValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.detailValue)
      }

      if (validation === true) {
        this.detailData[detailFieldIndex] = { status: 'normal', name: detailFieldConfig.label, hidden: false }
      } else {
        this.detailData[detailFieldIndex] = { status: 'error', message: validation[0].message, name: detailFieldConfig.label, hidden: false }
      }
      await this.setState({
        detailData: this.detailData
      })
    }
  }

  handleValueUnset = async (detailFieldIndex: number, path: string, validation: true | DetailFieldError[]) => {
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailFieldConfig) {
      const fullPath = detailFieldConfig.field === '' || path === '' ? `${detailFieldConfig.field}${path}` : `${detailFieldConfig.field}.${path}`

      unset(this.detailValue, fullPath)
      this.setState({
        detailValue: this.detailValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.detailValue)
      }

      if (validation === true) {
        this.detailData[detailFieldIndex] = { status: 'normal', name: detailFieldConfig.label, hidden: false }
      } else {
        this.detailData[detailFieldIndex] = { status: 'error', message: validation[0].message, name: detailFieldConfig.label, hidden: false }
      }

      await this.setState({
        detailData: this.detailData
      })
    }
  }

  handleValueListAppend = async (detailFieldIndex: number, path: string, value: any, validation: true | DetailFieldError[]) => {
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailFieldConfig) {
      const fullPath = detailFieldConfig.field === '' || path === '' ? `${detailFieldConfig.field}${path}` : `${detailFieldConfig.field}.${path}`

      const list = get(this.detailValue, fullPath, [])
      list.push(value)
      set(this.detailValue, fullPath, list)
      this.setState({
        detailValue: this.detailValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.detailValue)
      }

      if (validation === true) {
        this.detailData[detailFieldIndex] = { status: 'normal', name: detailFieldConfig.label, hidden: false }
      } else {
        this.detailData[detailFieldIndex] = { status: 'error', message: validation[0].message, name: detailFieldConfig.label, hidden: false }
      }

      await this.setState({
        detailData: this.detailData
      })
    }
  }

  handleValueListSplice = async (detailFieldIndex: number, path: string, index: number, count: number, validation: true | DetailFieldError[]) => {
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailFieldConfig) {
      const fullPath = detailFieldConfig.field === '' || path === '' ? `${detailFieldConfig.field}${path}` : `${detailFieldConfig.field}.${path}`

      const list = get(this.detailValue, fullPath, [])
      list.splice(index, count)
      set(this.detailValue, fullPath, list)
      this.setState({
        detailValue: this.detailValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.detailValue)
      }

      if (validation === true) {
        this.detailData[detailFieldIndex] = { status: 'normal', name: detailFieldConfig.label, hidden: false }
      } else {
        this.detailData[detailFieldIndex] = { status: 'error', message: validation[0].message, name: detailFieldConfig.label, hidden: false }
      }

      await this.setState({
        detailData: this.detailData
      })
    }
  }

  /**
   * 详情步骤组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderComponent = (props: IDetail) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Detail组件。
    </React.Fragment>
  }

  /**
   * 详情项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderItemComponent = (props: IDetailItem) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现DetailItem组件。
    </React.Fragment>
  }

  render () {
    const {
      data,
      step
      // config: {
      //   layout = 'horizontal',
      //   fields = []
      // }
    } = this.props

    const layout = this.props.config?.layout || 'horizontal'
    const fields = this.props.config?.fields || []

    const {
      ready,
      detailValue,
      detailData
    } = this.state

    if (ready) {
      return (
        <React.Fragment>
          {/* 渲染表单 */}
          {this.renderComponent({
            layout,
            onBack: this.props.config.hiddenBack ? undefined : async () => this.handleCancel(),
            backText: this.props.config?.backText?.replace(/(^\s*)|(\s*$)/g, ""),
            children: fields.map((detailFieldConfig, detailFieldIndex) => {
              if (!ConditionHelper(detailFieldConfig.condition, { record: detailValue, data, step })) {
                return null
              }
              let hidden: boolean = true
              let display: boolean = true

              // if (detailFieldConfig.type === 'hidden') {
              //   hidden = true
              //   display = false
              // }

              if (detailFieldConfig.display === 'none') {
                hidden = true
                display = false
              }

              // 隐藏项同时打标录入数据并清空填写项
              if (!hidden) {
                this.detailData[detailFieldIndex] = { status: 'normal', name: detailFieldConfig.label, hidden }
              }

              const DetailFieldComponent = this.getALLComponents(detailFieldConfig.type) || DetailField

              const renderData = {
                key: detailFieldIndex,
                label: detailFieldConfig.label,
                // status: detailFieldConfig.field !== undefined ? getValue(detailData, detailFieldConfig.field, {}).status || 'normal' : 'normal',
                // message: detailFieldConfig.field !== undefined ? getValue(detailData, detailFieldConfig.field, {}).message || '' : '',
                layout,
                visitable: display,
                fieldType: detailFieldConfig.type,
                children: (
                  <DetailFieldComponent
                    key={detailFieldIndex}
                    ref={(detailField: DetailField<DetailFieldConfigs, any, any> | null) => {
                      if (detailFieldIndex !== null) {
                        this.detailFields[detailFieldIndex] = detailField
                        this.handleDetailFieldMount(detailFieldIndex)
                      }
                    }}
                    formLayout={layout}
                    value={detailFieldConfig.field !== undefined ? getValue(detailValue, detailFieldConfig.field) : undefined}
                    record={detailValue}
                    data={cloneDeep(data)}
                    step={step}
                    config={detailFieldConfig}
                    onChange={async (value: any) => { await this.handleChange(detailFieldIndex, value) }}
                    onValueSet={async (path, value, validation) => await this.handleValueSet(detailFieldIndex, path, value, validation)}
                    onValueUnset={async (path, validation) => await this.handleValueUnset(detailFieldIndex, path, validation)}
                    onValueListAppend={async (path, value, validation) => await this.handleValueListAppend(detailFieldIndex, path, value, validation)}
                    onValueListSplice={async (path, index, count, validation) => await this.handleValueListSplice(detailFieldIndex, path, index, count, validation)}
                    loadDomain={async (domain: string) => await this.props.loadDomain(domain)}
                  />
                )
              }
              // 渲染详情项容器
              return (
                hidden
                  ? this.renderItemComponent(renderData)
                  : <React.Fragment key={detailFieldIndex}></React.Fragment>
              )
            })
          })}
        </React.Fragment>
      )
    } else {
      return <></>
    }
  }
}
