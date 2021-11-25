import React from 'react'
import { Field, FieldConfigs, FieldError } from '../../components/formFields/common'
import Step, { StepConfig, StepProps } from '../common'
import getALLComponents from '../../components/formFields'
import { getValue, setValue, listItemMove } from '../../util/value'
import { ParamConfig } from '../../interface'
import ParamHelper from '../../util/param'
import { cloneDeep, get, set, unset } from 'lodash'
import ConditionHelper, { ConditionConfig } from '../../util/condition'
import StatementHelper, { StatementConfig } from '../../util/statement'

/**
 * 表单步骤配置文件格式定义
 * - layout: 表单布局类型
 * - * horizontal: 左侧文本、右侧输入框、纵向排列
 * - * vertical:   顶部文本、底部输入框、纵向排列
 * - * inline:     左侧文本、右侧输入框、横向排列
 * - fields: 表单项配置列表
 * - defaultValue: 默认值
 * - hiddenSubmit: 是否隐藏提交按钮
 * - hiddenCancel: 是否隐藏取消按钮
 * - submitText: 自定义确认按钮文本
 * - cancelText: 自定义取消按钮文本
 * - validations: 全局校验
 * * - condition: （全局校验子项中）校验条件
 * * - message: 校验失败提示文本
 */
export interface FormConfig extends StepConfig {
  type: 'form'
  layout?: 'horizontal' | 'vertical' | 'inline'
  /**
   * 表单组件配置文件格式定义
   * 参照其它组件定义
   */
  fields?: FieldConfigs[],
  defaultValue?: ParamConfig,
  hiddenSubmit?: boolean // 是否隐藏提交按钮
  hiddenCancel?: boolean // 是否隐藏取消按钮
  submitText?: string    // 自定义确认按钮文本
  cancelText?: string   //  自定义取消按钮文本
  validations?: Array<{
    condition?: ConditionConfig
    message?: StatementConfig
  }>
}

/**
 * 全局校验 modal组件 - 入参格式
 * message: 提示文案
 */
export interface IFormStepModal {
  message: string
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
export interface IForm {
  layout: 'horizontal' | 'vertical' | 'inline'
  onSubmit?: () => Promise<any>
  onCancel?: () => Promise<any>
  children: React.ReactNode[]
  submitText?: string    // 自定义确认按钮文本
  cancelText?: string   //  自定义取消按钮文本
}

/**
 * 表单项容器组件 - UI渲染方法 - 入参格式
 * - key: react需要的unique key
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
export interface IFormItem {
  key: string | number,
  label: string
  status: 'normal' | 'error' | 'loading'
  description?: string
  message?: string
  layout: 'horizontal' | 'vertical' | 'inline'
  visitable: boolean
  fieldType: string
  children: React.ReactNode
}

/**
 * 表单步骤组件 - 状态
 * - formData: 表单的值
 */
interface FormState {
  ready: boolean
  formValue: { [field: string]: any }
  formData: { status: 'normal' | 'error' | 'loading', message?: string, name: string }[]
}

/**
 * 表单步骤组件
 */
export default class FormStep extends Step<FormConfig, FormState> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any): typeof Field => getALLComponents[type]

  // 各表单项所使用的UI组件的实例
  formFields: Array<Field<FieldConfigs, {}, any> | null> = []
  formFieldsMounted: Array<boolean> = []

  formValue: { [field: string]: any } = {}
  formData: { status: 'normal' | 'error' | 'loading', message?: string, name: string }[] = []

  /**
   * 初始化表单的值
   * @param props
   */
  constructor(props: StepProps<FormConfig>) {
    super(props)
    this.state = {
      ready: false,
      formValue: {},
      formData: []
    }
  }

  /**
   * 重写表单步骤装载事件
   */
  stepPush = async () => {
    // 处理表单步骤配置文件的默认值
    const {
      config: {
        fields: formFieldsConfig = []
      },
      data,
      step,
      onMount
    } = this.props

    this.formValue = {}
    this.formData = []

    if (this.props.config.defaultValue) {
      const formDefault = ParamHelper(this.props.config.defaultValue, { data, step })
      for (const formFieldIndex in formFieldsConfig) {
        const formFieldConfig = formFieldsConfig[formFieldIndex]
        const value = getValue(formDefault, formFieldConfig.field)
        this.formValue = setValue(this.formValue, formFieldConfig.field, value)
        this.formData[formFieldIndex] = { status: 'normal', name: formFieldConfig.label }
      }
    }

    await this.setState({
      ready: true,
      formValue: this.formValue,
      formData: cloneDeep(this.formData)
    })

    // 表单初始化结束，展示表单界面。
    onMount()
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
            this.formData[formFieldIndex] = { status: 'normal', name: formFieldConfig.label }
          } else {
            this.formData[formFieldIndex] = { status: 'error', message: validation[0].message, name: formFieldConfig.label }
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
    let data: any = {}
    let canSubmit = true
    
    if (this.props.config.validations) {
      for (const validation of this.props.config.validations) {
        if (!ConditionHelper(validation.condition, { record: this.state.formValue, data: this.props.data, step: this.props.step })) {
          canSubmit = false
          const message = StatementHelper(validation.message, { record: this.state.formValue, data: this.props.data, step: this.props.step }) || '未填写失败文案或失败文案配置异常'
          this.renderModalComponent({message})
          return null
        }
      }
      if (!canSubmit) return null
    }
    for (const formFieldIndex in (this.props.config.fields || [])) {
      if (this.formFields[formFieldIndex]) {
        const formField = this.formFields[formFieldIndex]
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
        if (formField && formFieldConfig) {
          const value = await formField.get()
          const validation = await formField.validate(value)
          // const submitFieldFormat = await formField.fieldFormat()

          if (validation !== true) {
            console.warn('表单项中存在问题', value, formFieldConfig)
            this.formData[formFieldIndex] = { status: 'error', message: validation[0].message, name: formFieldConfig.label }
            canSubmit = false
          }
          data = setValue(data, formFieldConfig.field, value)
        }
      }
    }
    console.info('表单参数信息', data, this.state.formValue, this.formData)

    await this.setState({
      formData: cloneDeep(this.formData)
    })

    if (canSubmit && this.props.onSubmit) {
      this.props.onSubmit(data)
    }
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
   * 处理表单项change事件
   * @param field 表单项配置
   * @param value 目标值
   */
  handleChange = async (formFieldIndex: number, value: any) => {
    const formField = this.formFields[formFieldIndex]
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formField && formFieldConfig) {
      this.formValue = setValue(this.formValue, formFieldConfig.field, value)

      const validation = await formField.validate(value)
      if (validation === true) {
        this.formData[formFieldIndex] = { status: 'normal', name: formFieldConfig.label }
      } else {
        this.formData[formFieldIndex] = { status: 'error', message: validation[0].message, name: formFieldConfig.label }
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
        this.formData[formFieldIndex] = { status: 'normal', name: formFieldConfig.label }
      } else {
        this.formData[formFieldIndex] = { status: 'error', message: validation[0].message, name: formFieldConfig.label }
      }

      console.log('form set data', this.formData)

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
        this.formData[formFieldIndex] = { status: 'normal', name: formFieldConfig.label }
      } else {
        this.formData[formFieldIndex] = { status: 'error', message: validation[0].message, name: formFieldConfig.label }
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

      let list = get(this.formValue, fullPath, [])
      if (!Array.isArray(list)) list = []
      list.push(value)
      set(this.formValue, fullPath, list)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData[formFieldIndex] = { status: 'normal', name: formFieldConfig.label }
      } else {
        this.formData[formFieldIndex] = { status: 'error', message: validation[0].message, name: formFieldConfig.label }
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
        this.formData[formFieldIndex] = { status: 'normal', name: formFieldConfig.label }
      } else {
        this.formData[formFieldIndex] = { status: 'error', message: validation[0].message, name: formFieldConfig.label }
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
        this.formData[formFieldIndex] = { status: 'normal', name: formFieldConfig.label }
      } else {
        this.formData[formFieldIndex] = { status: 'error', message: validation[0].message, name: formFieldConfig.label }
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
  renderComponent = (props: IForm) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Form组件。
    </React.Fragment>
  }

  /**
   * 表单项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderItemComponent = (props: IFormItem) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormItem组件。
    </React.Fragment>
  }

  /**
   * modal组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderModalComponent= (props: IFormStepModal) => {
    return new Promise((resolve) => {
          resolve(null)
    })
  }

  render() {
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
      formValue,
      formData
    } = this.state
    
    if (ready) {
      return (
        <React.Fragment>
          {/* 渲染表单 */}
          {this.renderComponent({
            layout,
            onSubmit: this.props.config.hiddenSubmit ? undefined : async () => this.handleSubmit(),
            onCancel: this.props.config.hiddenCancel ? undefined : async () => this.handleCancel(),
            submitText: this.props.config?.submitText?.replace(/(^\s*)|(\s*$)/g, ""),
            cancelText: this.props.config?.cancelText?.replace(/(^\s*)|(\s*$)/g, ""),
            children: fields.map((formFieldConfig, formFieldIndex) => {
              if (!ConditionHelper(formFieldConfig.condition, { record: formValue, data, step })) {
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

              // 隐藏项同时打标录入数据并清空填写项
              if (!hidden) {
                this.formData[formFieldIndex] = { status: 'normal', name: formFieldConfig.label }
              }

              const FormField = this.getALLComponents(formFieldConfig.type) || Field

              const renderData = {
                key: formFieldIndex,
                label: formFieldConfig.label,
                status: formData[formFieldIndex]?.status || 'normal',
                message: formData[formFieldIndex]?.message || '',
                layout,
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
                    formLayout={layout}
                    value={formFieldConfig.field !== undefined ? getValue(formValue, formFieldConfig.field) : undefined}
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
    } else {
      return <></>
    }
  }
}
