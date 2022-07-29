import React from 'react'
import { get } from 'lodash'
import { Field, FieldConfigs, FieldError } from '../../components/formFields/common'
import Step, { StepConfig, StepProps } from '../common'
import getALLComponents from '../../components/formFields'
import { ParamConfig } from '../../interface'
import ParamHelper from '../../util/param'
import { push, splice, sort, set, setValue } from '../../util/produce'
import ConditionHelper from '../../util/condition'
import { getValue } from '../../util/value'

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
  defaultValue?: ParamConfig
  hiddenSubmit?: boolean // 是否隐藏确认按钮
  hiddenReset?: boolean // 是否隐藏重置按钮
  submitText?: string // 自定义确认按钮文本
  resetText?: string //  自定义重置按钮文本
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
  onSubmit?: () => Promise<unknown>
  onReset?: () => Promise<unknown>
  submitText?: string // 自定义确认按钮文本
  resetText?: string //  自定义重置按钮文本
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
  visitable: boolean
  fieldType: string
  children: React.ReactNode
}

/**
 * 表单步骤组件 - 状态
 * - filterData: 表单的值
 */
interface FilterState {
  formValue: { [field: string]: unknown }
  formData: { status: 'normal' | 'error' | 'loading'; message?: string }[]
}

/**
 * 表单步骤组件
 */
export default class FilterStep extends Step<FilterConfig, FilterState> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: string): typeof Field => getALLComponents[type]

  // 各表单项所使用的UI组件的实例
  formFields: Array<Field<FieldConfigs, unknown, unknown> | null> = []

  formFieldsMounted: Array<boolean> = []

  dependentFields_: string[] = []

  formValue: { [field: string]: unknown } = {}

  formData: { status: 'normal' | 'error' | 'loading'; message?: string }[] = []

  /**
   * 初始化表单的值
   * @param props
   */
  constructor(props: StepProps<FilterConfig>) {
    super(props)
    this.state = {
      formValue: {},
      formData: []
    }
  }

  /**
   * 重写表单步骤装载事件
   */
  stepPush = async () => {
    // 处理表单步骤配置文件的默认值
    this.formValue = {}
    this.formData = []

    if (this.props.config.defaultValue) {
      const formDefault = ParamHelper(this.props.config.defaultValue, { data: this.props.data, step: this.props.step })
      for (let formFieldIndex = 0; formFieldIndex < (this.props.config.fields || []).length; formFieldIndex++) {
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
        const value =
          formFieldConfig.field === undefined || formFieldConfig.field === ''
            ? formDefault
            : get(formDefault, formFieldConfig.field)
        this.formValue = setValue(this.formValue, formFieldConfig.field, value)
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal' })
      }
    }

    await this.setState({
      formValue: this.formValue,
      formData: this.formData
    })

    // 表单初始化结束，展示表单界面。
    if (this.props.onMount) {
      this.props.onMount()
    }
    setTimeout(() => {
      this.handleSubmit()
    }, 100)
  }

  handleFormFieldMount = async (formFieldIndex: number) => {
    if (this.formFieldsMounted[formFieldIndex]) {
      return true
    }

    this.formFieldsMounted = set(this.formFieldsMounted, `[${formFieldIndex}]`, true)

    if (this.formFields[formFieldIndex]) {
      const formField = this.formFields[formFieldIndex]
      if (formField) {
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]

        let value = getValue(this.formValue, formFieldConfig.field)
        if (formFieldConfig.defaultValue && value === undefined) {
          value = await formField.reset()
        }
        this.formValue = setValue(this.formValue, formFieldConfig.field, value)

        if (value !== undefined) {
          const validation = await formField.validate(value)
          if (validation === true) {
            this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal' })
          } else {
            this.formData = set(this.formData, `[${formFieldIndex}]`, {
              status: 'error',
              message: validation[0].message
            })
          }
        }
      }
    }
    await this.setState({
      formValue: this.formValue,
      formData: this.formData
    })
  }

  /**
   * 处理表单提交事件
   */
  handleSubmit = async () => {
    let data: { [key: string]: unknown } = {}
    let canSubmit = true

    for (const formFieldIndex in this.props.config.fields || []) {
      if (this.formFields[formFieldIndex]) {
        const formField = this.formFields[formFieldIndex]
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
        if (formField && formFieldConfig.field) {
          const value = await formField.get()
          const validation = await formField.validate(value)
          // const submitFieldFormat = await formField.fieldFormat()

          if (validation !== true) {
            this.formData[formFieldIndex] = { status: 'error', message: validation[0].message }
            canSubmit = false
          }
          data = setValue(data, formFieldConfig.field, value)
        }
      }
    }

    await this.setState({
      formData: this.formData
    })

    if (canSubmit && this.props.onSubmit) {
      this.props.onSubmit(data, false)
    }
  }

  /**
   * 处理表单返回事件
   */
  handleReset = async () => {
    this.formValue = {}
    this.formData = []

    if (this.props.config.defaultValue) {
      const formDefault = ParamHelper(this.props.config.defaultValue, { data: this.props.data, step: this.props.step })
      for (let formFieldIndex = 0; formFieldIndex < (this.props.config.fields || []).length; formFieldIndex++) {
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
        const value =
          formFieldConfig.field === undefined || formFieldConfig.field === ''
            ? formDefault
            : get(formDefault, formFieldConfig.field)
        this.formValue = setValue(this.formValue, formFieldConfig.field, value)
        this.formData[formFieldIndex] = { status: 'normal' }
      }
    }

    for (let formFieldIndex = 0; formFieldIndex < (this.props.config.fields || []).length; formFieldIndex++) {
      const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
      const formField = this.formFields[formFieldIndex]
      if (formField) {
        let value = getValue(this.formValue, formFieldConfig.field)
        if (formFieldConfig.defaultValue && value === undefined) {
          value = await formField.reset()
        }
        this.formValue = setValue(this.formValue, formFieldConfig.field, value)

        const validation = await formField.validate(value)
        if (validation === true) {
          this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal' })
        } else {
          this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'error', message: validation[0].message })
        }
      }
    }

    await this.setState({
      formValue: this.formValue,
      formData: this.formData
    })

    this.handleSubmit()
  }

  /**
   * 处理表单项change事件
   * @param field 表单项配置
   * @param value 目标值
   */
  handleChange = async (formFieldIndex: number, value: unknown) => {
    const formField = this.formFields[formFieldIndex]
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formField && formFieldConfig.field) {
      this.formValue = setValue(this.formValue, formFieldConfig.field, value)

      const validation = await formField.validate(value)
      if (validation === true) {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal' })
      } else {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'error', message: validation[0].message })
      }

      await this.setState({
        formValue: this.formValue,
        formData: this.formData
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }
    }
  }

  handleValueSet = async (
    formFieldIndex: number,
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      this.formValue = set(this.formValue, fullPath, value)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal' })
      } else {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'error', message: validation[0].message })
      }

      await this.setState({
        formData: this.formData
      })
    }
  }

  handleValueUnset = async (
    formFieldIndex: number,
    path: string,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      // unset(this.formValue, fullPath)
      this.formValue = set(this.formValue, fullPath)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal' })
      } else {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'error', message: validation[0].message })
      }

      await this.setState({
        formData: this.formData
      })
    }
  }

  handleValueListAppend = async (
    formFieldIndex: number,
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      this.formValue = push(this.formValue, fullPath, value)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal' })
      } else {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'error', message: validation[0].message })
      }

      await this.setState({
        formData: this.formData
      })
    }
  }

  handleValueListSplice = async (
    formFieldIndex: number,
    path: string,
    index: number,
    count: number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      this.formValue = splice(this.formValue, fullPath, index, count)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal' })
      } else {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'error', message: validation[0].message })
      }

      await this.setState({
        formData: this.formData
      })
    }
  }

  handleValueListSort = async (
    formFieldIndex: number,
    path: string,
    index: number,
    sortType: 'up' | 'down',
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      this.formValue = sort(this.formValue, fullPath, index, sortType)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal' })
      } else {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'error', message: validation[0].message })
      }

      await this.setState({
        formData: this.formData
      })
    }
  }

  /**
   * 表单步骤组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderComponent: (props: IFilter) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现Filter组件。</>
  }

  /**
   * 表单项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderItemComponent: (props: IFilterItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FilterItem组件。</>
  }

  render() {
    const {
      data,
      step,
      config: { fields = [] }
    } = this.props

    const { formValue, formData } = this.state

    return (
      <>
        {/* 渲染表单 */}
        {this.renderComponent({
          onSubmit: this.props.config?.hiddenSubmit ? undefined : async () => this.handleSubmit(),
          onReset: this.props.config?.hiddenReset ? undefined : async () => this.handleReset(),
          submitText: this.props.config?.submitText?.replace(/(^\s*)|(\s*$)/g, ''),
          resetText: this.props.config?.resetText?.replace(/(^\s*)|(\s*$)/g, ''),
          children: fields.map((formFieldConfig, formFieldIndex) => {
            if (!ConditionHelper(formFieldConfig.condition, { record: formValue, data, step })) {
              this.formFieldsMounted = set(this.formFieldsMounted, `[${formFieldIndex}]`, false)
              return null
            }
            let hidden = true
            let display = true

            if (formFieldConfig.type === 'hidden') {
              hidden = true
              display = false
            }

            if (formFieldConfig.display === 'none') {
              hidden = true
              display = false
            }

            const FormField = this.getALLComponents(formFieldConfig.type) || Field

            let status = (formData[formFieldIndex] || {}).status || 'normal'

            if (['group', 'import_subform', 'object', 'tabs', 'form'].some((type) => type === formFieldConfig.type)) {
              status = 'normal'
            }

            const renderData = {
              label: formFieldConfig.label,
              status,
              message: (formData[formFieldIndex] || {}).message || '',
              visitable: display,
              fieldType: formFieldConfig.type,
              children: (
                <FormField
                  key={formFieldIndex}
                  ref={(formField: Field<FieldConfigs, unknown, unknown> | null) => {
                    if (formFieldIndex !== null) {
                      this.formFields = set(this.formFields, `[${formFieldIndex}]`, formField)
                      this.handleFormFieldMount(formFieldIndex)
                    }
                  }}
                  form={this}
                  formLayout="inline"
                  value={formFieldConfig.field !== undefined ? get(formValue, formFieldConfig.field) : undefined}
                  record={formValue}
                  step={formValue}
                  data={data}
                  config={formFieldConfig}
                  onChange={async (value: unknown) => {
                    this.handleChange(formFieldIndex, value)
                  }}
                  onValueSet={async (path, value, validation, options) =>
                    this.handleValueSet(formFieldIndex, path, value, validation, options)
                  }
                  onValueUnset={async (path, validation, options) =>
                    this.handleValueUnset(formFieldIndex, path, validation, options)
                  }
                  onValueListAppend={async (path, value, validation, options) =>
                    this.handleValueListAppend(formFieldIndex, path, value, validation, options)
                  }
                  onValueListSplice={async (path, index, count, validation, options) =>
                    this.handleValueListSplice(formFieldIndex, path, index, count, validation, options)
                  }
                  onValueListSort={async (path, index, sortType, validation, options) =>
                    this.handleValueListSort(formFieldIndex, path, index, sortType, validation, options)
                  }
                  checkPageAuth={this.props.checkPageAuth}
                  loadPageURL={this.props.loadPageURL}
                  loadPageFrameURL={this.props.loadPageFrameURL}
                  loadPageConfig={this.props.loadPageConfig}
                  baseRoute={this.props.baseRoute}
                  loadDomain={async (domain: string) => this.props.loadDomain(domain)}
                  loadPageList={async () => this.props.loadPageList()}
                  containerPath=""
                />
              )
            }

            // 渲染表单项容器
            return hidden ? this.renderItemComponent(renderData) : <React.Fragment key={formFieldIndex} />
          })
        })}
      </>
    )
  }
}
