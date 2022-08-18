import React from 'react'
import { getValue, getBoolean, getChainPath } from '../../../util/value'
import { Field, FieldConfig, FieldError, FieldProps, IField } from '../common'
import getALLComponents, { FieldConfigs } from '..'
import { IFormItem } from '../../../steps/form'
// import { cloneDeep } from 'lodash'
import { set, setValue } from '../../../util/produce'
import ConditionHelper from '../../../util/condition'
import StatementHelper from '../../../util/statement'
import { ColumnsConfig } from '../../../interface'

export interface GroupFieldConfig extends FieldConfig {
  type: 'group'
  fields: FieldConfigs[]
  childColumns?: ColumnsConfig
}

/**
 * 表单步骤组件 - UI渲染方法 - 入参格式
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
export interface IGroupField {
  columns?: ColumnsConfig
  children: React.ReactNode[]
}

interface IGroupFieldState {
  didMount: boolean
  formData: { status: 'normal' | 'error' | 'loading'; message?: string; name?: string }[]
}

export default class GroupField
  extends Field<GroupFieldConfig, IGroupField, { [key: string]: unknown }, IGroupFieldState>
  implements IField<{ [key: string]: unknown }>
{
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: string): typeof Field => getALLComponents[type]

  formFields: Array<Field<FieldConfigs, unknown, unknown> | null> = []

  formFieldsMounted: Array<boolean> = []

  constructor(props: FieldProps<GroupFieldConfig, { [key: string]: unknown }>) {
    super(props)

    this.state = {
      didMount: false,
      formData: []
    }
  }

  didMount = async () => {
    await this.setState({
      didMount: true
    })
  }

  validate = async (value: unknown): Promise<true | FieldError[]> => {
    const errors: FieldError[] = []

    let childrenError = 0
    const childrenErrorMsg: Array<{ name: string; msg: string }> = []

    let { formData } = this.state

    for (let fieldIndex = 0; fieldIndex < (this.props.config.fields || []).length; fieldIndex++) {
      const formItem = this.formFields[fieldIndex]
      const formConfig = this.props.config.fields?.[fieldIndex]
      if (formItem !== null && formItem !== undefined && !formItem.props.config.disabled) {
        const validation = await formItem.validate(getValue(value, (this.props.config.fields || [])[fieldIndex].field))

        if (validation === true || this.formFieldsMounted[fieldIndex] === false) {
          formData = set(formData, `[${fieldIndex}]`, { status: 'normal' })
        } else {
          childrenError++
          formData = set(formData, `[${fieldIndex}]`, { status: 'error', message: validation[0].message })
          childrenErrorMsg.push({
            name: formConfig?.label,
            msg: validation[0].message
          })
        }
      }
    }

    await this.setState({
      formData
    })

    if (childrenError > 0) {
      const errTips = `${this.props.config.label || ''}${childrenErrorMsg.map((err) => `${err.msg}`).join('; ')}`
      errors.push(new FieldError(errTips))
    }

    return errors.length ? errors : true
  }

  get = async () => {
    let data: { [key: string]: unknown } = {}

    if (Array.isArray(this.props.config.fields)) {
      for (let formFieldIndex = 0; formFieldIndex < this.props.config.fields.length; formFieldIndex++) {
        const formFieldConfig = this.props.config.fields[formFieldIndex]
        if (
          !ConditionHelper(
            formFieldConfig.condition,
            {
              record: this.props.value,
              data: this.props.data,
              step: this.props.step,
              containerPath: this.props.containerPath,
              extraContainerPath: this.props.config.field
            },
            this
          )
        ) {
          continue
        }
        const formField = this.formFields[formFieldIndex]
        if (formField && !formFieldConfig.disabled) {
          const value = await formField.get()
          data = setValue(data, formFieldConfig.field, value)
        }
      }
    }
    return data
  }

  handleMount = async (formFieldIndex: number) => {
    if (this.formFieldsMounted[formFieldIndex]) {
      return true
    }
    this.formFieldsMounted = set(this.formFieldsMounted, `[${formFieldIndex}]`, true)

    if (this.formFields[formFieldIndex]) {
      const formField = this.formFields[formFieldIndex]
      if (formField) {
        const formFieldConfig = this.props.config.fields[formFieldIndex]
        let value = getValue(this.props.value, formFieldConfig.field)
        const source = value
        if (formFieldConfig.defaultValue && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.props.onValueSet(formFieldConfig.field, value, true)
        }

        if (value !== undefined) {
          const validation = await formField.validate(value)
          this.handleValueCallback(formFieldIndex, validation)
        }
        await formField.didMount()
      }
    }
  }

  handleChange: (formFieldIndex: number, value: unknown) => Promise<void> = async () => {
    /* 无逻辑 */
  }

  /**
   * 处理set、unset、append、splice、sort后的操作
   */
  handleValueCallback = async (formFieldIndex: number, validation: true | FieldError[]) => {
    let { formData } = this.state
    if (validation === true) {
      formData = set(formData, `[${formFieldIndex}]`, { status: 'normal' })
    } else {
      formData = set(formData, `[${formFieldIndex}]`, { status: 'error', message: validation[0].message })
    }

    await this.setState({
      formData
    })
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

      await this.props.onValueSet(fullPath, value, true)
      this.handleValueCallback(formFieldIndex, validation)
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

      await this.props.onValueUnset(fullPath, true)
      this.handleValueCallback(formFieldIndex, validation)
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

      await this.props.onValueListAppend(fullPath, value, true)
      this.handleValueCallback(formFieldIndex, validation)
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

      await this.props.onValueListSplice(fullPath, index, count, true)
      this.handleValueCallback(formFieldIndex, validation)
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
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      await this.props.onValueListSort(fullPath, index, sortType, true)
      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  renderComponent: (props: IGroupField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现GroupField组件。</>
  }

  /**
   * 表单项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderItemComponent: (props: IFormItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormItem组件。</>
  }

  render = () => {
    const { config, formLayout, value, data, step } = this.props

    return (
      <>
        {this.renderComponent({
          columns: config?.columns?.enable ? config.columns : undefined,
          children: this.state.didMount
            ? (this.props.config.fields || []).map((formFieldConfig, formFieldIndex) => {
                if (
                  !ConditionHelper(
                    formFieldConfig.condition,
                    {
                      record: value,
                      data: this.props.data,
                      step: this.props.step,
                      containerPath: this.props.containerPath,
                      extraContainerPath: this.props.config.field
                    },
                    this
                  )
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

                const FormField = this.getALLComponents(formFieldConfig.type) || Field

                let status = (this.state.formData[formFieldIndex] || {}).status || 'normal'
                if (
                  ['group', 'import_subform', 'object', 'tabs', 'form'].some((type) => type === formFieldConfig.type)
                ) {
                  status = 'normal'
                }

                const renderData = {
                  key: formFieldIndex,
                  label: formFieldConfig.label,
                  subLabel: this.handleSubLabelContent(formFieldConfig),
                  columns: config.columns?.enable
                    ? {
                        type: formFieldConfig.columns?.type || config.childColumns?.type || 'span',
                        value: formFieldConfig.columns?.value || config.childColumns?.value || 1,
                        wrap: formFieldConfig.columns?.wrap || config.childColumns?.wrap || false,
                        gap: config.columns?.gap || 0,
                        rowGap: config.columns?.rowGap || 0
                      }
                    : undefined,
                  styles: formFieldConfig.styles,
                  status,
                  message: (this.state.formData[formFieldIndex] || {}).message || '',
                  extra: StatementHelper(
                    formFieldConfig.extra,
                    {
                      record: this.props.value,
                      data: this.props.data,
                      step: this.props.step,
                      containerPath: this.props.containerPath,
                      extraContainerPath: this.props.config.field
                    },
                    this
                  ),
                  required: getBoolean(formFieldConfig.required),
                  layout: formLayout,
                  visitable: display,
                  fieldType: formFieldConfig.type,
                  children: (
                    <FormField
                      key={formFieldIndex}
                      ref={(formField: Field<FieldConfigs, unknown, unknown> | null) => {
                        if (formField) {
                          this.formFields = set(this.formFields, `[${formFieldIndex}]`, formField)
                          this.handleMount(formFieldIndex)
                        }
                      }}
                      form={this.props.form}
                      formLayout={formLayout}
                      value={getValue(value, formFieldConfig.field)}
                      record={value}
                      data={data}
                      step={step}
                      config={formFieldConfig}
                      onChange={async (valueChange: unknown) => {
                        await this.handleChange(formFieldIndex, valueChange)
                      }}
                      onValueSet={async (path, valueSet, validation, options) =>
                        this.handleValueSet(formFieldIndex, path, valueSet, validation, options)
                      }
                      onValueUnset={async (path, validation, options) =>
                        this.handleValueUnset(formFieldIndex, path, validation, options)
                      }
                      onValueListAppend={async (path, valueAppend, validation, options) =>
                        this.handleValueListAppend(formFieldIndex, path, valueAppend, validation, options)
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
                      containerPath={getChainPath(this.props.containerPath, this.props.config.field)}
                      onReportFields={async (field: string) => this.handleReportFields(field)}
                    />
                  )
                }
                // 渲染表单项容器
                return hidden ? this.renderItemComponent(renderData) : <React.Fragment key={formFieldIndex} />
              })
            : []
        })}
      </>
    )
  }
}
