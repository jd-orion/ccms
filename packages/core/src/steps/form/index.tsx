import React from 'react'
import QueryString from 'query-string'
import { Field, FieldConfigs } from '../../components/formFields/common'
import Step, { StepConfig, StepProps } from '../common'
import getALLComponents from '../../components/formFields'
import { getParamText, getValue, setValue } from '../../util/value'
import * as _ from "lodash";
import { set } from '../../util/request'

/**
 * 表单步骤配置文件格式定义
 * - layout: 表单布局类型
 * - * horizontal: 左侧文本、右侧输入框、纵向排列
 * - * vertical:   顶部文本、底部输入框、纵向排列
 * - * inline:     左侧文本、右侧输入框、横向排列
 * - fields: 表单项配置列表
 */
export interface FormConfig extends StepConfig {
  type: 'form'
  layout?: 'horizontal' | 'vertical' | 'inline'
  /**
   * 表单组件配置文件格式定义
   * 参照其它组件定义
   */
  fields?: FieldConfigs[]
  default?: {
    type: 'static' | 'data' | 'query' | 'hash'
    value?: any
    field?: string
  }
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
  onSubmit: () => Promise<any>
  onCancel: () => Promise<any>
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
export interface IFormItem {
  label: string
  status: 'normal' | 'error' | 'loading'
  description?: string
  message?: string
  layout: 'horizontal' | 'vertical' | 'inline'
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
  formData: { [field: string]: { value: any, status: 'normal' | 'error' | 'loading', message?: string } }
}

/**
 * 表单步骤组件
 */
export default class FormStep extends Step<FormConfig, FormState> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any) => getALLComponents[type]

  // 各表单项所使用的UI组件的实例
  formValue: { [field: string]: any } = {}
  formData: { [field: string]: { value: any, status: 'normal' | 'error' | 'loading', message?: string } } = {}
  formFields: Array<Field<FieldConfigs, {}, any> | null> = []
  formFieldsMounted: Array<boolean> = []

  /**
   * 初始化表单的值
   * @param props
   */
  constructor(props: StepProps<FormConfig>) {
    super(props)
    this.state = {
      ready: false,
      formValue: {},
      formData: {}
    }
  }

  /**
   * 重写表单步骤装载事件
   */
  willMount = async () => {
    // 处理表单步骤配置文件的默认值
    const {
      config: {
        fields: formFieldsConfig = [],
        default: {
          type: defaultType,
          value: defaultValue,
          field: defaultField
        } = {},
        default: defaultConfig
      },
      data,
      step,
      onMount
    } = this.props

    let formDefault: any

    if (defaultConfig) {
      switch (defaultType) {
        case 'static':
          if (defaultValue) {
            formDefault = defaultValue
          }
          break
        case 'data':
          if (data && data[step]) {
            if (defaultField) {
              formDefault = getValue(data[step], defaultField)
            } else {
              formDefault = data[step]
            }
          }
          break
        case 'query':
          if (window.location.search) {
            const query = QueryString.parse(window.location.search)
            if (defaultField) {
              formDefault = getValue(query, defaultField)
            } else {
              formDefault = query
            }
          }
          break
        case 'hash':
          if (window.location.hash) {
            try {
              const hash = JSON.parse(window.location.hash.substr(1))
              if (defaultField) {
                formDefault = getValue(hash, defaultField)
              } else {
                formDefault = hash
              }
            } catch (e) {
            }
          }
          break
      }

      for (const formFieldIndex in formFieldsConfig) {
        const formFieldConfig = formFieldsConfig[formFieldIndex]
        const value = getValue(formDefault, formFieldConfig.field)
        set(this.formValue, formFieldConfig.field, value)
        set(this.formData, formFieldConfig.field, { value, status: 'normal' })
      }
    }

    await this.setState({
      ready: true,
      formValue: _.cloneDeep(this.formValue),
      formData: _.cloneDeep(this.formData)
    })

    // 表单初始化结束，展示表单界面。
    onMount()
  }

  handleFormFieldMount = async (formFieldIndex: number) => {
    if (this.formFieldsMounted[formFieldIndex]) {
      return true
    }

    this.formFieldsMounted[formFieldIndex] = true

    const {
      config: {
        fields: formFieldsConfig = []
      },
      data
    } = this.props

    if (this.formFields[formFieldIndex]) {
      const formField = this.formFields[formFieldIndex]
      if (formField) {
        const formFieldConfig = formFieldsConfig[formFieldIndex]
        let value = getValue(this.formValue, formFieldConfig.field)
        if (formFieldConfig.default) {
          value = await formField.reset()
        }
        const validation = await formField.validate(value)
        set(this.formValue, formFieldConfig.field, value)
        if (validation === true) {
          set(this.formData, formFieldConfig.field, { value, status: 'normal' })
        } else {
          // setValue(this.formData, formFieldConfig.field, { value, status: 'error', message: validation[0].message })
        }
      }
    }
    await this.setState({
      formValue: _.cloneDeep(this.formValue),
      formData: _.cloneDeep(this.formData)
    })
  }

  /**
   * 处理表单提交事件
   */
  handleSubmit = async () => {
    const {
      config: {
        fields: formFieldsConfig = []
      },
      onSubmit
    } = this.props

    const data: { [key: string]: any } = {}
    let canSubmit = true
    for (const formFieldIndex in formFieldsConfig) {
      if (this.formFields[formFieldIndex]) {
        const formField = this.formFields[formFieldIndex]
        const formFieldConfig = formFieldsConfig[formFieldIndex]
        if (formField && formFieldConfig.field) {
          const value = await formField.get()
          const validation = await formField.validate(value)
          const submitFieldFormat = await formField.fieldFormat();
          if (validation !== true) {
            console.warn('表单项中存在问题', value, formFieldConfig)
            set(this.formData, formFieldConfig.field, { value, status: 'error', message: validation[0].message })
            await this.setState({
              formData: _.cloneDeep(this.formData)
            })
            canSubmit === true && (canSubmit = false)
          }
          if (formFieldConfig.readonly !== true) {
            if (Object.keys(submitFieldFormat).length > 0) {
              Object.assign(data, submitFieldFormat)
            } else {
              // data[formFieldConfig.field] = value
              set(data, formFieldConfig.field, value)
            }
          }
        }
      }
    }
    console.info('表单参数信息', data)
    if (canSubmit === false) return;
    onSubmit(data)
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
    const {
      config: {
        fields: formFieldsConfig = []
      },
      onChange
    } = this.props

    const formField = this.formFields[formFieldIndex]
    const formFieldConfig = formFieldsConfig[formFieldIndex]
    if (formField && formFieldConfig.field) {

      const validation = await formField.validate(value)
      set(this.formValue, formFieldConfig.field, value)
      if (validation === true) {
        set(this.formData, formFieldConfig.field, { value, status: 'normal' })
      } else {
        set(this.formData, formFieldConfig.field, { value, status: 'error', message: validation[0].message })
      }

      await this.setState({
        formValue: _.cloneDeep(this.formValue),
        formData: _.cloneDeep(this.formData)
      })
      if (onChange) {
        onChange(this.formValue)
      }
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

  render() {
    const {
      data,
      step,
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
            onSubmit: async () => this.handleSubmit(),
            onCancel: async () => this.handleCancel(),
            children: fields.map((formFieldConfig, formFieldIndex) => {
              let hidden: boolean = true
              let display: boolean = true
              if (formFieldConfig.condition && formFieldConfig.condition.statement) {
                let statement = formFieldConfig.condition.statement
                if (formFieldConfig.condition.params && Array.isArray(formFieldConfig.condition.params)) {
                  statement = getParamText(formFieldConfig.condition.statement, formFieldConfig.condition.params, { record: formValue, data, step })
                }
                try {
                  // eslint-disable-next-line no-eval
                  const result = eval(statement)
                  if (!result) {
                    hidden = false
                  }
                } catch (e) {
                  console.error('表单项展示条件语句执行错误。', statement)
                  hidden = false
                }
              }

              if (formFieldConfig.type === 'hidden') {
                hidden = false
              }

              if (formFieldConfig.display === 'none') {
                hidden = true
                display = false
              }

              const FormField = this.getALLComponents(formFieldConfig.type) || React.Fragment




              const renderData = {
                  label: formFieldConfig.label,
                  status: formFieldConfig.field ? getValue(formData, formFieldConfig.field, {}).status || 'normal' : 'normal',
                  message: formFieldConfig.field ? getValue(formData, formFieldConfig.field, {}).message || '' : '',
                  layout,
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
                      value={formFieldConfig.field ? getValue(formValue, formFieldConfig.field) : undefined}
                      record={formValue}
                      data={data}
                      step={step}
                      config={formFieldConfig}
                      onChange={async (value: any) => { await this.handleChange(formFieldIndex, value) }}
                    />
                  )
                }
              // 渲染表单项容器
              return (
                hidden ? <div key={formFieldIndex} style={display ? { position: 'relative' } : {
                  overflow: 'hidden',
                  height: 0,
                  width: 0
                }}>
                  <span style={{ color: '#ff7070', float: 'left', width: '9px', paddingTop: '5px' }}>{`${formFieldConfig.required ? '*' : ''}`}</span>
                  {
                    this.renderItemComponent(renderData)
                  }
                </div> : <></>
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
