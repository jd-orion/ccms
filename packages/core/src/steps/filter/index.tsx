import React from 'react'
import { Field, FieldConfigs, FieldError } from '../../components/formFields/common'
import Step, { StepConfig, StepProps } from '../common'
import getALLComponents from '../../components/formFields'
import { ParamConfig } from '../../interface'
import ParamHelper from '../../util/param'
import { cloneDeep, get, set, unset } from 'lodash'
import ConditionHelper from '../../util/condition'
import { getValue, setValue, listItemMove } from '../../util/value'

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
  submitText?: string    // 自定义确认按钮文本
  resetText?: string   //  自定义重置按钮文本
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
  onSubmit?: () => Promise<any>
  onReset?: () => Promise<any>
  submitText?: string    // 自定义确认按钮文本
  resetText?: string   //  自定义重置按钮文本
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
  formValue: { [field: string]: any }
  formData: { status: 'normal' | 'error' | 'loading', message?: string }[]
}

/**
 * 表单步骤组件
 */
export default class FilterStep extends Step<FilterConfig, FilterState> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any): typeof Field => getALLComponents[type]

  // 各表单项所使用的UI组件的实例
  formFields: Array<Field<FieldConfigs, {}, any> | null> = []
  formFieldsMounted: Array<boolean> = []

  formValue: { [field: string]: any } = {}
  formData: { status: 'normal' | 'error' | 'loading', message?: string }[] = []

  /**
   * 初始化表单的值
   * @param props
   */
  constructor (props: StepProps<FilterConfig>) {
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
      for (const formFieldIndex in (this.props.config.fields || [])) {
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
        const value = (formFieldConfig.field === undefined || formFieldConfig.field === '') ? formDefault : get(formDefault, formFieldConfig.field)
        this.formValue = setValue(this.formValue, formFieldConfig.field, value)
        this.formData[formFieldIndex] = { status: 'normal' }
      }
    }

    await this.setState({
      formValue: this.formValue,
      formData: cloneDeep(this.formData)
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

    this.formFieldsMounted[formFieldIndex] = true

    if (this.formFields[formFieldIndex]) {
      const formField = this.formFields[formFieldIndex]
      if (formField) {
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]

        let value = getValue(this.formValue, formFieldConfig.field)
        if ((formFieldConfig.defaultValue) && value === undefined) {
          value = await formField.reset()
        }
        this.formValue = setValue(this.formValue, formFieldConfig.field, value)

        if (value !== undefined) {
          const validation = await formField.validate(value)
          if (validation === true) {
            this.formData[formFieldIndex] = { status: 'normal' }
          } else {
            this.formData[formFieldIndex] = { status: 'error', message: validation[0].message }
          }
        }
      }
    }
    await this.setState({
      formValue: this.formValue,
      formData: cloneDeep(this.formData)
    })
  }

  /**
   * 处理表单提交事件
   */
  handleSubmit = async () => {
    let data: { [key: string]: any } = {}
    let canSubmit = true

    for (const formFieldIndex in (this.props.config.fields || [])) {
      if (this.formFields[formFieldIndex]) {
        const formField = this.formFields[formFieldIndex]
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
        if (formField && formFieldConfig.field) {
          const value = await formField.get()
          const validation = await formField.validate(value)
          // const submitFieldFormat = await formField.fieldFormat()

          if (validation !== true) {
            console.warn('表单项中存在问题', value, formFieldConfig)
            this.formData[formFieldIndex] = { status: 'error', message: validation[0].message }
            canSubmit = false
          }
          data = setValue(data, formFieldConfig.field, value)
        }
      }
    }
    console.info('表单校验通过', data)

    await this.setState({
      formData: cloneDeep(this.formData)
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
      for (const formFieldIndex in (this.props.config.fields || [])) {
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
        const value = (formFieldConfig.field === undefined || formFieldConfig.field === '') ? formDefault : get(formDefault, formFieldConfig.field)
        this.formValue = setValue(this.formValue, formFieldConfig.field, value)
        this.formData[formFieldIndex] = { status: 'normal' }
      }
    }

    for (const formFieldIndex in (this.props.config.fields || [])) {
      const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
      const formField = this.formFields[formFieldIndex]
      if (formField) {
        let value = getValue(this.formValue, formFieldConfig.field)
        if ((formFieldConfig.defaultValue) && value === undefined) {
          value = await formField.reset()
        }
        this.formValue = setValue(this.formValue, formFieldConfig.field, value)

        const validation = await formField.validate(value)
        if (validation === true) {
          this.formData[formFieldIndex] = { status: 'normal' }
        } else {
          this.formData[formFieldIndex] = { status: 'error', message: validation[0].message }
        }
      }
    }

    await this.setState({
      formValue: this.formValue,
      formData: cloneDeep(this.formData)
    })

    this.handleSubmit()
  }

  /**
   * 处理表单项change事件
   * @param field 表单项配置
   * @param value 目标值
   */
  handleChange = async (formFieldIndex: number, value: any) => {
    const formField = this.formFields[formFieldIndex]
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formField && formFieldConfig.field) {
      this.formValue = setValue(this.formValue, formFieldConfig.field, value)

      const validation = await formField.validate(value)
      if (validation === true) {
        this.formData[formFieldIndex] = { status: 'normal' }
      } else {
        this.formData[formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      await this.setState({
        formValue: this.formValue,
        formData: cloneDeep(this.formData)
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }
    }
  }

  handleValueSet = async (formFieldIndex: number, path: string, value: any, validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`

      set(this.formValue, fullPath, value)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData[formFieldIndex] = { status: 'normal' }
      } else {
        this.formData[formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      await this.setState({
        formData: cloneDeep(this.formData)
      })
    }
  }

  handleValueUnset = async (formFieldIndex: number, path: string, validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`

      unset(this.formValue, fullPath)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData[formFieldIndex] = { status: 'normal' }
      } else {
        this.formData[formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      await this.setState({
        formData: cloneDeep(this.formData)
      })
    }
  }

  handleValueListAppend = async (formFieldIndex: number, path: string, value: any, validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`

      const list = get(this.formValue, fullPath, [])
      list.push(value)
      set(this.formValue, fullPath, list)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData[formFieldIndex] = { status: 'normal' }
      } else {
        this.formData[formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      await this.setState({
        formData: cloneDeep(this.formData)
      })
    }
  }

  handleValueListSplice = async (formFieldIndex: number, path: string, index: number, count: number, validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`

      const list = get(this.formValue, fullPath, [])
      list.splice(index, count)
      set(this.formValue, fullPath, list)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData[formFieldIndex] = { status: 'normal' }
      } else {
        this.formData[formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      await this.setState({
        formData: cloneDeep(this.formData)
      })
    }
  }
  handleValueListSort = async (formFieldIndex: number, path: string, index: number, sortType: 'up' | 'down', validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`

      const list = listItemMove(get(this.formValue, fullPath, []), index, sortType)
      set(this.formValue, fullPath, list)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData[formFieldIndex] = { status: 'normal' }
      } else {
        this.formData[formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      await this.setState({
        formData: cloneDeep(this.formData)
      })
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
      formValue,
      formData
    } = this.state

    return (
      <React.Fragment>
        {/* 渲染表单 */}
        {this.renderComponent({
          onSubmit: this.props.config?.hiddenSubmit ? undefined : async () => this.handleSubmit(),
          onReset: this.props.config?.hiddenReset ? undefined : async () => this.handleReset(),
          submitText: this.props.config?.submitText?.replace(/(^\s*)|(\s*$)/g, ""),
          resetText: this.props.config?.resetText?.replace(/(^\s*)|(\s*$)/g, ""),
          children: fields.map((formFieldConfig, formFieldIndex) => {
            if (!ConditionHelper(formFieldConfig.condition, { record: formValue, data, step })) {
              this.formFieldsMounted[formFieldIndex] = false
              return null
            }
            let hidden: boolean = true
            let display: boolean = true

            if (formFieldConfig.type === 'hidden') {
              hidden = true
              display = false
            }

            if (formFieldConfig.display === 'none') {
              hidden = true
              display = false
            }

            const FormField = this.getALLComponents(formFieldConfig.type) || Field

            const renderData = {
              label: formFieldConfig.label,
              status: (formData[formFieldIndex] || {}).status || 'normal',
              message: (formData[formFieldIndex] || {}).message || '',
              visitable: display,
              fieldType: formFieldConfig.type,
              children: (
                  <FormField
                    key={formFieldIndex}
                    ref={(formField: Field<FieldConfigs, any, any> | null) => {
                      if (formFieldIndex !== null) {
                        this.formFields[formFieldIndex] = formField
                        this.handleFormFieldMount(formFieldIndex)
                      }
                    }}
                    formLayout={'inline'}
                    value={formFieldConfig.field !== undefined ? get(formValue, formFieldConfig.field) : undefined}
                    record={formValue}
                    data={cloneDeep(data)}
                    step={step}
                    config={formFieldConfig}
                    onChange={async (value: any) => { await this.handleChange(formFieldIndex, value) }}
                    onValueSet={async (path, value, validation) => await this.handleValueSet(formFieldIndex, path, value, validation)}
                    onValueUnset={async (path, validation) => await this.handleValueUnset(formFieldIndex, path, validation)}
                    onValueListAppend={async (path, value, validation) => await this.handleValueListAppend(formFieldIndex, path, value, validation)}
                    onValueListSplice={async (path, index, count, validation) => await this.handleValueListSplice(formFieldIndex, path, index, count, validation)}
                    onValueListSort={async (path, index, sortType, validation) => await this.handleValueListSort(formFieldIndex, path, index, sortType, validation)}
                    baseRoute={this.props.baseRoute}
                    loadDomain={async (domain: string) => await this.props.loadDomain(domain)}
                  />
              )
            }

            // 渲染表单项容器
            return (
              hidden
                ? this.renderItemComponent(renderData)
                : <React.Fragment key={formFieldIndex}></React.Fragment>
            )
          })
        })}
      </React.Fragment>
    )
  }
}
