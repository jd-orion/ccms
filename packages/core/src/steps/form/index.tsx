import React from 'react'
import { Field, FieldConfigs, FieldError } from '../../components/formFields/common'
import Step, { StepConfig, StepProps } from '../common'
import getALLComponents from '../../components/formFields'
import { ColumnsConfig, ParamConfig } from '../../interface'
import { getValue, getBoolean } from '../../util/value'
import ParamHelper from '../../util/param'
import { push, splice, sort, set, setValue } from '../../util/produce'
import ConditionHelper, { ConditionConfig } from '../../util/condition'
import StatementHelper, { StatementConfig } from '../../util/statement'
import OperationHelper, { OperationConfig } from '../../util/operation'

/**
 * 表单步骤配置文件格式定义
 * - layout: 表单布局类型
 * - * horizontal: 左侧文本、右侧输入框、纵向排列
 * - * vertical:   顶部文本、底部输入框、纵向排列
 * - * inline:     左侧文本、右侧输入框、横向排列
 * - columns: 分栏设置
 * - * type: 分栏类型
 * - * - * span: 固定分栏
 * - * - * width: 宽度分栏
 * - * value: 分栏相关配置值
 * - * wrap: 分栏后是否换行
 * - * gap: 分栏边距
 * - fields: 表单项配置列表
 * - defaultValue: 默认值
 * - hiddenSubmit: 是否隐藏提交按钮
 * - hiddenCancel: 是否隐藏取消按钮
 * - submitText: 自定义确认按钮文本
 * - cancelText: 自定义取消按钮文本
 * - validations: 全局校验
 * - * - condition: （全局校验子项中）校验条件
 * - * - message: 校验失败提示文本
 * - actions: 表单步骤按钮列表
 */
export interface FormConfig extends StepConfig {
  type: 'form'
  layout?: 'horizontal' | 'vertical' | 'inline'
  columns?: ColumnsConfig
  /**
   * 表单组件配置文件格式定义
   * 参照其它组件定义
   */
  fields?: FieldConfigs[]
  defaultValue?: ParamConfig
  validations?: Array<{
    condition?: ConditionConfig
    message?: StatementConfig
  }>
  actions: Array<ActionConfig> | []
  rightTopActions: Array<ActionConfig> | []
  stringify?: string[] // 序列化字段
  unstringify?: string[] // 反序列化字段
  hiddenSubmit?: boolean // 是否隐藏提交按钮 TODO 待删除
  hiddenCancel?: boolean // 是否隐藏取消按钮   TODO 待删除
  submitText?: string // 自定义确认按钮文本 TODO 待删除
  cancelText?: string //  自定义取消按钮文本 TODO 待删除
}

/**
 * 表单步骤按钮列表按钮项配置
 * - type: 按钮操作类型
 * - * - submit: 提交
 * - * - cancel: 取消
 * - * - ccms: 自定义（搭建页面）
 * - label: 按钮文案
 * - mode: 按钮形式
 * - * -  normal: 普通按钮
 * - * -  primary: 主按钮
 * - * -  link: 链接
 * - condition: 展示条件
 * - callback: 自定义操作 - 回调
 * - * - type: 回调操作类型
 * - * - * - none: 无操作
 * - * - * - submit: 提交表单
 * - * - * - cancel: 取消表单
 */
export interface ActionConfig {
  type: 'submit' | 'cancel' | 'ccms'
  label: string
  mode: 'normal' | 'primary' | 'link'
  submitValidate: boolean
  condition?: ConditionConfig
  handle?: OperationConfig
  callback?: {
    type: 'none' | 'submit' | 'cancel'
  }
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
 * - columns: 分栏设置
 * - * type: 分栏类型
 * - * - * span: 固定分栏
 * - * - * width: 宽度分栏
 * - * value: 分栏相关配置值
 * - * wrap: 分栏后是否换行
 * - * gap: 分栏边距
 * - * horizontal: 左侧文本、右侧输入框、纵向排列
 * - * vertical:   顶部文本、底部输入框、纵向排列
 * - * inline:     左侧文本、右侧输入框、横向排列
 * - submit:   表单提交操作事件
 * - cancel:   表单取消操作事件
 * - children: 表单内容
 */
export interface IForm {
  layout: 'horizontal' | 'vertical' | 'inline'
  columns?: ColumnsConfig
  actions?: React.ReactNode[]
  rightTopActions?: React.ReactNode[]
  children: React.ReactNode[]
  onSubmit?: () => Promise<unknown>
  onCancel?: () => Promise<unknown>
  submitText?: string // 自定义确认按钮文本
  cancelText?: string //  自定义取消按钮文本
}

/**
 * 表单步骤按钮config
 * - label: 按钮文案
 * - type: 按钮形式
 * - onClick: 按钮操作
 */
export interface IButtonProps {
  label: string
  mode: 'normal' | 'primary' | 'link'
  onClick: () => void
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
  key: string | number
  label: string
  subLabel?: React.ReactNode
  status: 'normal' | 'error' | 'loading'
  required: boolean
  description?: string
  message?: string
  extra?: string
  layout: 'horizontal' | 'vertical' | 'inline'
  columns?: ColumnsConfig
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
  formValue: { [field: string]: unknown }
  formData: { status: 'normal' | 'error' | 'loading'; message?: string; name: string }[]
}

/**
 * 表单步骤组件
 */
export default class FormStep extends Step<FormConfig, FormState> {
  // ts对class的声明文件报错，临时解决
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: string): typeof Field => getALLComponents[type]

  OperationHelper = OperationHelper

  // 各表单项所使用的UI组件的实例
  formFields: Array<Field<FieldConfigs, Record<string, unknown>, unknown> | null> = []

  formFieldsMounted: Array<boolean> = []

  dependentFields_: string[] = []

  formValue: { [field: string]: unknown } = {}

  formData: { status: 'normal' | 'error' | 'loading'; message?: string; name: string }[] = []

  canSubmit = false

  submitData: object = {}

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
      config: { fields: formFieldsConfig = [] },
      data,
      step,
      onMount
    } = this.props

    this.formValue = {}
    this.formData = []

    if (this.props.config.defaultValue) {
      let formDefault = ParamHelper(this.props.config.defaultValue, {
        record: this.formValue,
        data,
        step,
        containerPath: ''
      })

      if (this.props.config.unstringify) {
        for (const field of this.props.config.unstringify) {
          const info = getValue(formDefault, field)
          try {
            formDefault = setValue(formDefault, field, JSON.parse(info))
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(`CCMS warning: 字段反序列化失败 - ${field}`)
          }
        }
      }

      for (let formFieldIndex = 0; formFieldIndex < formFieldsConfig.length; formFieldIndex++) {
        const formFieldConfig = formFieldsConfig[formFieldIndex]
        const value = getValue(formDefault, formFieldConfig.field)

        this.formValue = setValue(this.formValue, formFieldConfig.field, value)
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal', name: formFieldConfig.label })
      }
    }

    await this.setState({
      ready: true,
      formValue: this.formValue,
      formData: this.formData
    })

    // 表单初始化结束，展示表单界面。
    onMount()
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
        value = await formField.set(value)
        this.formValue = setValue(this.formValue, formFieldConfig.field, value)

        if (value !== undefined) {
          const validation = await formField.validate(value)
          if (validation === true) {
            this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal', name: formFieldConfig.label })
          } else {
            this.formData = set(this.formData, `[${formFieldIndex}]`, {
              status: 'error',
              message: validation[0].message,
              name: formFieldConfig.label
            })
          }
        }
        await formField.didMount()
      }
    }

    await this.setState({
      formValue: this.formValue,
      formData: this.formData
    })
  }

  /**
   * 触发表单校验
   */
  handleValidations = async () => {
    this.canSubmit = true
    this.submitData = {}
    if (this.props.config.validations) {
      for (const validation of this.props.config.validations) {
        if (
          !ConditionHelper(validation.condition, {
            record: this.state.formValue,
            data: this.props.data,
            step: this.formValue,
            containerPath: ''
          })
        ) {
          this.canSubmit = false
          const message =
            StatementHelper(validation.message, {
              record: this.state.formValue,
              data: this.props.data,
              step: this.formValue,
              containerPath: ''
            }) || '未填写失败文案或失败文案配置异常'
          this.renderModalComponent({ message })
          return
        }
      }
      if (!this.canSubmit) return
    }

    for (const formFieldIndex in this.props.config.fields || []) {
      if (this.formFields[formFieldIndex]) {
        const formField = this.formFields[formFieldIndex]
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
        if (formField && formFieldConfig && !formFieldConfig.disabled) {
          const value = await formField.get()
          const validation = await formField.validate(value)
          if (validation !== true) {
            // eslint-disable-next-line no-console
            console.warn('表单项中存在问题', value, formFieldConfig)
            this.formData = set(this.formData, `[${formFieldIndex}]`, {
              status: 'error',
              message: validation[0].message,
              name: formFieldConfig.label
            })
            this.canSubmit = false
          }
          this.submitData = setValue(this.submitData, formFieldConfig.field, value)
        }
      }
    }

    if (this.props.config.stringify) {
      for (const field of this.props.config.stringify) {
        const info = getValue(this.submitData, field)
        this.submitData = setValue(this.submitData, field, JSON.stringify(info))
      }
    }

    await this.setState({
      formData: this.formData
    })
  }

  /**
   * 处理表单提交事件
   */
  handleSubmit = async () => {
    await this.handleValidations()

    if (this.canSubmit && this.props.onSubmit) {
      this.props.onSubmit(this.submitData)
    }
  }

  /**
   * 处理表单返回事件
   */
  handleCancel = async () => {
    const { onUnmount } = this.props

    onUnmount()
  }

  /**
   * 处理表单项change事件
   * @param field 表单项配置
   * @param value 目标值
   */
  handleChange = async (formFieldIndex: number, value: unknown) => {
    const formField = this.formFields[formFieldIndex]
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formField && formFieldConfig) {
      this.formValue = setValue(this.formValue, formFieldConfig.field, value)

      const validation = await formField.validate(value)
      if (validation === true) {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal', name: formFieldConfig.label })
      } else {
        this.formData = set(this.formData, `[${formFieldIndex}]`, {
          status: 'error',
          message: validation[0].message,
          name: formFieldConfig.label
        })
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
      const fullPath = (() => {
        if (options && options.noPathCombination) {
          return path
        }
        if (formFieldConfig.field === '' || path === '') {
          return `${formFieldConfig.field}${path}`
        }
        return `${formFieldConfig.field}.${path}`
      })()

      this.formValue = setValue(this.formValue, fullPath, value)
      this.setState({
        formValue: this.formValue
      })

      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal', name: formFieldConfig.label })
      } else {
        this.formData = set(this.formData, `[${formFieldIndex}]`, {
          status: 'error',
          message: validation[0].message,
          name: formFieldConfig.label
        })
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
      const fullPath = (() => {
        if (options && options.noPathCombination) {
          return path
        }
        if (formFieldConfig.field === '' || path === '') {
          return `${formFieldConfig.field}${path}`
        }
        return `${formFieldConfig.field}.${path}`
      })()

      // unset(this.formValue, fullPath)
      this.formValue = set(this.formValue, fullPath)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal', name: formFieldConfig.label })
      } else {
        this.formData = set(this.formData, `[${formFieldIndex}]`, {
          status: 'error',
          message: validation[0].message,
          name: formFieldConfig.label
        })
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
      const fullPath = (() => {
        if (options && options.noPathCombination) {
          return path
        }
        if (formFieldConfig.field === '' || path === '') {
          return `${formFieldConfig.field}${path}`
        }
        return `${formFieldConfig.field}.${path}`
      })()

      this.formValue = push(this.formValue, fullPath, value) // 向this.formValue的fullPath下的值添加value
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal', name: formFieldConfig.label })
      } else {
        this.formData = set(this.formData, `[${formFieldIndex}]`, {
          status: 'error',
          message: validation[0].message,
          name: formFieldConfig.label
        })
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
      const fullPath = (() => {
        if (options && options.noPathCombination) {
          return path
        }
        if (formFieldConfig.field === '' || path === '') {
          return `${formFieldConfig.field}${path}`
        }
        return `${formFieldConfig.field}.${path}`
      })()

      this.formValue = splice(this.formValue, fullPath, index, count)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal', name: formFieldConfig.label })
      } else {
        this.formData = set(this.formData, `[${formFieldIndex}]`, {
          status: 'error',
          message: validation[0].message,
          name: formFieldConfig.label
        })
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
    sortType: 'up' | 'down' | 'top' | 'bottom' | number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = (() => {
        if (options && options.noPathCombination) {
          return path
        }
        if (formFieldConfig.field === '' || path === '') {
          return `${formFieldConfig.field}${path}`
        }
        return `${formFieldConfig.field}.${path}`
      })()

      this.formValue = sort(this.formValue, fullPath, index, sortType)
      this.setState({
        formValue: this.formValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.formValue)
      }

      if (validation === true) {
        this.formData = set(this.formData, `[${formFieldIndex}]`, { status: 'normal', name: formFieldConfig.label })
      } else {
        this.formData = set(this.formData, `[${formFieldIndex}]`, {
          status: 'error',
          message: validation[0].message,
          name: formFieldConfig.label
        })
      }

      await this.setState({
        formData: this.formData
      })
    }
  }

  /**
   * 处理表单步骤按钮列表按钮项回调
   * @param action 按钮项配置
   */
  handleCallback = async (action: ActionConfig, success: boolean) => {
    if (success) {
      const callbackType = action.callback?.type
      if (callbackType) {
        if (callbackType === 'submit') {
          this.handleSubmit()
        } else if (callbackType === 'cancel') {
          this.handleCancel()
        }
      }
    }
  }

  /**
   * 表单步骤组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderComponent: (props: IForm) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现Form组件。</>
  }

  /**
   * 表单步骤按钮项button组件
   * @param props
   */
  renderButtonComponent: (props: IButtonProps) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormButton组件。</>
  }

  /**
   * 表单项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderItemComponent: (props: IFormItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormItem组件。</>
  }

  /**
   * modal组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderModalComponent: (props: IFormStepModal) => Promise<void> = () => {
    return new Promise((resolve) => {
      resolve()
    })
  }

  getActios = (actions: Array<ActionConfig> | [], formValue: { [field: string]: unknown }, data: object[]) => {
    let actions_
    if (Object.prototype.toString.call(actions) === '[object Array]') {
      actions_ = []
      for (let index = 0, len = actions.length; index < len; index++) {
        if (
          !ConditionHelper(actions[index].condition, { record: formValue, data, step: formValue, containerPath: '' })
        ) {
          continue
        }
        if (actions[index].type === 'submit') {
          actions_.push(
            this.renderButtonComponent({
              label: actions[index].label || '',
              mode: actions[index].mode,
              onClick: () => this.handleSubmit()
            })
          )
        } else if (actions[index].type === 'cancel') {
          actions_.push(
            this.renderButtonComponent({
              label: actions[index].label || '',
              mode: actions[index].mode,
              onClick: () => this.handleCancel()
            })
          )
        } else {
          const { submitValidate } = actions[index]
          const OperationHelperWrapper = (
            <this.OperationHelper
              key={index}
              config={actions[index].handle}
              datas={{ record: formValue, data: this.props.data, step: this.props.step }}
              checkPageAuth={this.props.checkPageAuth}
              loadPageURL={this.props.loadPageURL}
              loadPageFrameURL={this.props.loadPageFrameURL}
              loadPageConfig={this.props.loadPageConfig}
              loadPageList={this.props.loadPageList}
              baseRoute={this.props.baseRoute}
              loadDomain={this.props.loadDomain}
              handlePageRedirect={this.props.handlePageRedirect}
              callback={async (success) => {
                await this.handleCallback(actions[index], success)
              }}
            >
              {(onClick) =>
                this.renderButtonComponent({
                  label: actions[index].label || '',
                  mode: actions[index].mode,
                  onClick: submitValidate
                    ? async () => {
                        await this.handleValidations()
                        if (this.canSubmit) {
                          onClick()
                        }
                      }
                    : onClick
                })
              }
            </this.OperationHelper>
          )
          actions_.push(OperationHelperWrapper)
        }
      }
    }
    return actions_
  }

  render() {
    const {
      data,
      config: {
        columns,
        // layout = 'horizontal',
        // fields = []
        actions,
        rightTopActions
      }
    } = this.props

    const layout = this.props.config?.layout || 'horizontal'
    const fields = this.props.config?.fields || []

    const { ready, formValue, formData } = this.state

    const actions_ = this.getActios(actions, formValue, data)

    const rightTopActions_ = this.getActios(rightTopActions, formValue, data)

    if (ready) {
      return (
        <>
          {/* 渲染表单 */}
          {this.renderComponent({
            layout,
            columns: columns?.enable ? columns : undefined,
            actions: actions_,
            rightTopActions: rightTopActions_,
            onSubmit: this.props.config.hiddenSubmit ? undefined : async () => this.handleSubmit(), // TODO 待删除
            onCancel: this.props.config.hiddenCancel ? undefined : async () => this.handleCancel(), // TODO 待删除
            submitText: this.props.config?.submitText?.replace(/(^\s*)|(\s*$)/g, ''), // TODO 待删除
            cancelText: this.props.config?.cancelText?.replace(/(^\s*)|(\s*$)/g, ''), // TODO 待删除
            children: fields.map((formFieldConfig, formFieldIndex) => {
              if (
                !ConditionHelper(formFieldConfig.condition, {
                  record: formValue,
                  data,
                  step: formValue,
                  containerPath: ''
                })
              ) {
                this.formFieldsMounted = set(this.formFieldsMounted, `[${formFieldIndex}]`, false)
                this.formFields && (this.formFields[formFieldIndex] = null)
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

              // 隐藏项同时打标录入数据并清空填写项
              if (!hidden) {
                this.formData = set(this.formData, `[${formFieldIndex}]`, {
                  status: 'normal',
                  name: formFieldConfig.label
                })
              }

              const FormField = this.getALLComponents(formFieldConfig.type) || Field

              let status = formData[formFieldIndex]?.status || 'normal'

              if (['group', 'import_subform', 'object', 'tabs', 'form'].some((type) => type === formFieldConfig.type)) {
                status = 'normal'
              }

              const renderData = {
                key: formFieldIndex,
                label: formFieldConfig.label,
                subLabel: this.handleSubLabelContent(formFieldConfig),
                columns: columns?.enable
                  ? {
                      type: formFieldConfig.columns?.type || columns?.type || 'span',
                      value: formFieldConfig.columns?.value || columns?.value || 1,
                      wrap: formFieldConfig.columns?.wrap || columns?.wrap || false,
                      gap: columns?.gap || 0,
                      rowGap: columns?.rowGap || 0
                    }
                  : undefined,
                status,
                message: formData[formFieldIndex]?.message || '',
                extra: StatementHelper(formFieldConfig.extra, {
                  record: formValue,
                  data: this.props.data,
                  step: formValue,
                  containerPath: ''
                }),
                required: getBoolean(formFieldConfig.required),
                layout,
                visitable: display,
                fieldType: formFieldConfig.type,
                children: (
                  <React.Suspense fallback={<>Loading</>}>
                    <FormField
                      key={formFieldIndex}
                      ref={(formField: Field<FieldConfigs, unknown, unknown> | null) => {
                        if (formField !== null) {
                          this.formFields = set(this.formFields, `[${formFieldIndex}]`, formField)
                          this.handleFormFieldMount(formFieldIndex)
                        }
                      }}
                      formLayout={layout}
                      value={
                        formFieldConfig.field !== undefined ? getValue(formValue, formFieldConfig.field) : undefined
                      }
                      record={formValue}
                      form={this}
                      data={data}
                      step={formValue}
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
                      checkPageAuth={async (pageID) => this.props.checkPageAuth(pageID)}
                      loadPageURL={async (pageID) => this.props.loadPageURL(pageID)}
                      loadPageFrameURL={async (pageID) => this.props.loadPageFrameURL(pageID)}
                      loadPageConfig={async (pageID) => this.props.loadPageConfig(pageID)}
                      loadPageList={async () => this.props.loadPageList()}
                      baseRoute={this.props.baseRoute}
                      loadDomain={async (domain: string) => this.props.loadDomain(domain)}
                      containerPath=""
                    />
                  </React.Suspense>
                )
              }
              // 渲染表单项容器
              return hidden ? (
                <React.Fragment key={formFieldIndex}>{this.renderItemComponent(renderData)}</React.Fragment>
              ) : (
                <React.Fragment key={formFieldIndex} />
              )
            })
          })}
        </>
      )
    }
    return <></>
  }
}
