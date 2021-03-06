import React from 'react'
import { getValue, getBoolean, getChainPath } from '../../../util/value'
import { Field, FieldConfig, FieldError, FieldProps, IField } from '../common'
import getALLComponents, { FieldConfigs } from '../'
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
  formData: { status: 'normal' | 'error' | 'loading', message?: string, name?: string }[]
}

export default class GroupField extends Field<GroupFieldConfig, IGroupField, any, IGroupFieldState> implements IField<string> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any): typeof Field => getALLComponents[type]

  formFields: Array<Field<FieldConfigs, {}, any> | null> = []
  formFieldsMounted: Array<boolean> = []

  constructor (props: FieldProps<GroupFieldConfig, any>) {
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

  validate = async (value: any): Promise<true | FieldError[]> => {
    const errors: FieldError[] = []

    let childrenError = 0
    const childrenErrorMsg: Array<{name:string, msg:string}> = []

    let formData = this.state.formData

    for (const fieldIndex in (this.props.config.fields || [])) {
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
      const errTips = `${this.props.config.label || ''}子项中存在错误。\n ${childrenErrorMsg.map(err => `${err.name}:${err.msg}`).join('; ')}。`
      errors.push(new FieldError(errTips))
    }

    return errors.length ? errors : true
  }

  get = async () => {
    let data: any = {}

    if (Array.isArray(this.props.config.fields)) {
      for (const formFieldIndex in this.props.config.fields) {
        const formFieldConfig = this.props.config.fields[formFieldIndex]
        if (!ConditionHelper(formFieldConfig.condition, { record: this.props.value, data: this.props.data, step: this.props.step, extraContainerPath: this.props.config.field }, this)) {
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
        if ((formFieldConfig.defaultValue) && value === undefined) {
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

  handleChange = async (formFieldIndex: number, value: any) => {
    // const formField = this.formFields[formFieldIndex]
    // const formFieldConfig = this.props.config.fields[formFieldIndex]

    // const formData = cloneDeep(this.state.formData)

    // if (formField && formFieldConfig) {
    //   if (this.props.onChange) {
    //     if (formFieldConfig.field === '') {
    //       await this.props.onChange(value)
    //     } else {
    //       const changeValue = setValue({}, formFieldConfig.field, value)
    //       await this.props.onChange(changeValue)
    //     }
    //   }

    //   const validation = await formField.validate(value)
    //   if (validation === true) {
    //     formData[formFieldIndex] = { value, status: 'normal' }
    //   } else {
    //     formData[formFieldIndex] = { value, status: 'error', message: validation[0].message }
    //   }

    //   await this.setState({
    //     formData
    //   })
    // }
  }

  /**
   * 处理set、unset、append、splice、sort后的操作
   */
  handleValueCallback = async (formFieldIndex: number, validation: true | FieldError[]) => {
    let formData = this.state.formData
    if (validation === true) {
      formData = set(formData, `[${formFieldIndex}]`, { status: 'normal' })
    } else {
      formData = set(formData, `[${formFieldIndex}]`, { status: 'error', message: validation[0].message })
    }

    await this.setState({
      formData
    })
  }

  handleValueSet = async (formFieldIndex: number, path: string, value: any, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueSet(fullPath, value, true)
      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  handleValueUnset = async (formFieldIndex: number, path: string, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueUnset(fullPath, true)
      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  handleValueListAppend = async (formFieldIndex: number, path: string, value: any, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueListAppend(fullPath, value, true)
      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  handleValueListSplice = async (formFieldIndex: number, path: string, index: number, count: number, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueListSplice(fullPath, index, count, true)
      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  handleValueListSort = async (formFieldIndex: number, path: string, index: number, sortType: 'up' | 'down', validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueListSort(fullPath, index, sortType, true)
      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  renderComponent = (props: IGroupField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现GroupField组件。
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

  render = () => {
    const {
      config,
      formLayout,
      value,
      data,
      step
    } = this.props

    return (
      <React.Fragment>
        {this.renderComponent({
          columns: config?.columns?.enable ? config.columns : undefined,
          children: this.state.didMount
            ? (this.props.config.fields || []).map((formFieldConfig, formFieldIndex) => {
                if (!ConditionHelper(formFieldConfig.condition, { record: value, data: this.props.data, step: this.props.step, extraContainerPath: this.props.config.field }, this)) {
                  this.formFieldsMounted = set(this.formFieldsMounted, `[${formFieldIndex}]`, false)
                  this.formFields && (this.formFields[formFieldIndex] = null)
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

                let status = (this.state.formData[formFieldIndex] || {}).status || 'normal'

                if (['group', 'import_subform', 'object', 'tabs', 'form'].some((type) => type === formFieldConfig.type)) {
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
                  extra: StatementHelper(formFieldConfig.extra, { record: this.props.value, data: this.props.data, step: this.props.step, extraContainerPath: this.props.config.field }, this),
                  required: getBoolean(formFieldConfig.required),
                  layout: formLayout,
                  visitable: display,
                  fieldType: formFieldConfig.type,
                  children: (
                      <FormField
                        key={formFieldIndex}
                        ref={(formField: Field<FieldConfigs, any, any> | null) => {
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
                        onChange={async (value: any) => { await this.handleChange(formFieldIndex, value) }}
                        onValueSet={async (path, value, validation, options) => this.handleValueSet(formFieldIndex, path, value, validation, options)}
                        onValueUnset={async (path, validation, options) => this.handleValueUnset(formFieldIndex, path, validation, options)}
                        onValueListAppend={async (path, value, validation, options) => this.handleValueListAppend(formFieldIndex, path, value, validation, options)}
                        onValueListSplice={async (path, index, count, validation, options) => this.handleValueListSplice(formFieldIndex, path, index, count, validation, options)}
                        onValueListSort={async (path, index, sortType, validation, options) => this.handleValueListSort(formFieldIndex, path, index, sortType, validation, options)}
                        baseRoute={this.props.baseRoute}
                        loadDomain={async (domain: string) => await this.props.loadDomain(domain)}
                        loadPageList={async () => await this.props.loadPageList()}
                        containerPath={getChainPath(this.props.containerPath, this.props.config.field)}
                        onReportFields={async (field: string) => await this.handleReportFields(field)}
                      />
                  )
                }
                // 渲染表单项容器
                return (
                  hidden
                    ? this.renderItemComponent(renderData)
                    : <React.Fragment key={formFieldIndex} />
                )
              })
            : []
        })}
      </React.Fragment>
    )
  }
}
