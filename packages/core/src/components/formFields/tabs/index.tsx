import { Field, FieldConfig, FieldConfigs, FieldError, FieldProps, IField } from '../common'
import getALLComponents from '../'
import React from 'react'
import ConditionHelper from '../../../util/condition'
import { set, setValue } from '../../../util/produce'
import { getValue, getBoolean, getChainPath } from '../../../util/value'
import StatementHelper from '../../../util/statement'

export type TabsFieldConfig = TabsFieldConfig_Same | TabsFieldConfig_Diff

export interface TabsFieldConfig_Basic extends FieldConfig {
  type: 'tabs'
}

export interface TabsFieldConfig_Same extends TabsFieldConfig_Basic {
  mode: 'same'
  fields: FieldConfigs[]
  tabs: {
    field: string
    label: string
  }[]
}

export interface TabsFieldConfig_Diff extends TabsFieldConfig_Basic {
  mode: 'diff'
  tabs: {
    field: string
    label: string
    fields: FieldConfigs[]
  }[]
}

export interface ITabsField {
  children: React.ReactNode[]
}

export interface ITabsFieldItem {
  key: string
  label: string
  children: React.ReactNode[]
}

export interface ITabsFieldItemField {
  index: number
  label: string
  subLabel?: React.ReactNode
  required: boolean
  status: 'normal' | 'error' | 'loading'
  description?: string
  message?: string
  extra?: string
  layout: 'horizontal' | 'vertical' | 'inline'
  fieldType: string
  children: React.ReactNode
}

export interface TabsFieldState<S> {
  didMount: boolean
  formDataList: { status: 'normal' | 'error' | 'loading', message?: string }[][]
  extra?: S
}

export default class TabsField<S> extends Field<TabsFieldConfig, ITabsField, { [key: string]: any }, TabsFieldState<S>> implements IField<{ [key: string]: any }> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any): typeof Field => getALLComponents[type]

  formFieldsList: Array<Array<Field<FieldConfigs, {}, any> | null>> = []
  formFieldsMountedList: Array<Array<boolean>> = []

  constructor (props: FieldProps<TabsFieldConfig, any>) {
    super(props)

    this.state = {
      didMount: false,
      formDataList: []
    }
  }

  didMount = async () => {
    await this.setState({
      didMount: true
    })
  }

  get = async () => {
    let data: any = {}

    for (const index in (this.props.config.tabs || [])) {
      const tab = (this.props.config.tabs || [])[index]
      const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])

      for (const formFieldIndex in fields) {
        const formFieldConfig = fields[formFieldIndex]
        if (!ConditionHelper(formFieldConfig.condition, { record: getValue(this.props.value, tab.field), data: this.props.data, step: this.props.step, extraContainerPath: getChainPath(this.props.config.field, tab.field) }, this)) {
          continue
        }
        const formField = this.formFieldsList[index] && this.formFieldsList[index][formFieldIndex]
        if (formField && !formFieldConfig.disabled) {
          const value = await formField.get()
          const fullPath = tab.field === '' || formFieldConfig.field === '' ? `${tab.field}${formFieldConfig.field}` : `${tab.field}.${formFieldConfig.field}`
          data = setValue(data, fullPath, value)
        }
      }
    }

    return data
  }

  validate = async (value: { [key: string]: any }): Promise<true | FieldError[]> => {
    const errors: FieldError[] = []

    if (this.props.config.required === true && Object.entries(value).length === 0) {
      errors.push(new FieldError('不能为空'))
    }

    let childrenError = 0
    const childrenErrorMsg: Array<{name:string, msg:string}> = []

    let formDataList = this.state.formDataList

    for (const formItemsIndex in this.formFieldsList) {
      if (!formDataList[formItemsIndex]) formDataList[formItemsIndex] = []
      const formItems = this.formFieldsList[formItemsIndex]
      const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[formItemsIndex] || {}).fields || [])
      const tab = (this.props.config.tabs || [])[formItemsIndex]
      for (const fieldIndex in fields) {
        const formItem = formItems[fieldIndex]
        const formFieldConfig = fields[fieldIndex]
        const fullPath = tab.field === '' || formFieldConfig.field === '' ? `${tab.field}${formFieldConfig.field}` : `${tab.field}.${formFieldConfig.field}`
        if (formItem !== null && formItem !== undefined && !formItem.props.config.disabled) {
          const validation = await formItem.validate(getValue(value, fullPath))
          if (validation === true) {
            formDataList = set(formDataList, `[${formItemsIndex}][${fieldIndex}]`, { status: 'normal' })
          } else {
            childrenError++
            formDataList = set(formDataList, `[${formItemsIndex}][${fieldIndex}]`, { status: 'error', message: validation[0].message })
            childrenErrorMsg.push({
              name: formFieldConfig?.label,
              msg: validation[0].message
            })
          }
        }
      }
    }

    await this.setState({
      formDataList
    })
    if (childrenError > 0) {
      const errTips = `${this.props.config.label || ''}子项中存在错误。\n ${childrenErrorMsg.map(err => `${err.name}:${err.msg}`).join('; ')}`
      errors.push(new FieldError(errTips))
    }

    return errors.length ? errors : true
  }

  handleMount = async (index: number, formFieldIndex: number) => {
    if (!this.formFieldsMountedList[index]) {
      this.formFieldsMountedList = set(this.formFieldsMountedList, `[${index}]`, [])
    }
    if (this.formFieldsMountedList[index][formFieldIndex]) {
      return true
    }
    this.formFieldsMountedList = set(this.formFieldsMountedList, `[${index}][${formFieldIndex}]`, true)

    const tab = (this.props.config.tabs || [])[index]

    if (this.formFieldsList[index] && this.formFieldsList[index][formFieldIndex]) {
      const formField = this.formFieldsList[index][formFieldIndex]
      if (formField) {
        const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
        const formFieldConfig = fields[formFieldIndex]

        const fullPath = tab.field === '' || formFieldConfig.field === '' ? `${tab.field}${formFieldConfig.field}` : `${tab.field}.${formFieldConfig.field}`

        let value = getValue(this.props.value, fullPath)
        const source = value
        if ((formFieldConfig.defaultValue) && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.props.onValueSet(fullPath, value, true)
        }

        if (value !== undefined) {
          const validation = await formField.validate(value)
          this.handleValueCallback(index, formFieldIndex, validation)
        }
        await formField.didMount()
      }
    }
  }

  handleChange = async (index: number, formFieldIndex: number, value: any) => {
  }

  /**
 * 处理set、unset、append、splice、sort后的操作
 */
  handleValueCallback = async (index: number, formFieldIndex: number, validation: true | FieldError[]) => {
    let formDataList = this.state.formDataList
    // if (!formDataList[index]) formDataList = set(formDataList, `[${index}]`, [])
    if (validation === true) {
      formDataList = set(formDataList, `[${index}][${formFieldIndex}]`, { status: 'normal' })
    } else {
      formDataList = set(formDataList, `[${index}][${formFieldIndex}]`, { status: 'error', message: validation[0].message })
    }

    this.setState({
      formDataList
    })
  }

  handleValueSet = async (index: number, formFieldIndex: number, path: string, value: any, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      const fieldPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueSet(fullPath, value, true)

      this.handleValueCallback(index, formFieldIndex, validation)
    }
  }

  handleValueUnset = async (index: number, formFieldIndex: number, path: string, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      const fieldPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueUnset(fullPath, true)

      this.handleValueCallback(index, formFieldIndex, validation)
    }
  }

  handleValueListAppend = async (index: number, formFieldIndex: number, path: string, value: any, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      const fieldPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueListAppend(fullPath, value, true)

      this.handleValueCallback(index, formFieldIndex, validation)
    }
  }

  handleValueListSplice = async (index: number, formFieldIndex: number, path: string, _index: number, count: number, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      const fieldPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueListSplice(fullPath, _index, count, true)

      this.handleValueCallback(index, formFieldIndex, validation)
    }
  }

  handleValueListSort = async (index: number, formFieldIndex: number, path: string, _index: number, sortType: 'up' | 'down', validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      const fieldPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueListSort(fullPath, _index, sortType, true)

      this.handleValueCallback(index, formFieldIndex, validation)
    }
  }

  /**
   * 用于展示子表单组件
   * @param _props
   * @returns
   */
  renderComponent = (_props: ITabsField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件。
    </React.Fragment>
  }

  /**
   * 用于展示子表单组件中的每一个子项
   * @param props
   * @returns
   */
  renderItemComponent = (props: ITabsFieldItem) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件的renderItemComponent方法。
    </React.Fragment>
  }

  /**
  * 用于展示子表单组件中的每一子项中的每一个子表单项组件
  * @param props
  * @returns
  */
  renderItemFieldComponent = (props: ITabsFieldItemField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件的renderItemFieldComponent方法。
    </React.Fragment>
  }

  render = () => {
    const {
      value = {}
    } = this.props

    return (
      <React.Fragment>
        {
          this.renderComponent({
            children: (
              this.state.didMount
                ? (this.props.config.tabs || []).map((tab: any, index: number) => {
                    const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
                    return (
                    <React.Fragment key={index}>
                      {this.renderItemComponent({
                        key: index.toString(),
                        label: tab.label,
                        children: fields.map((formFieldConfig, formFieldIndex) => {
                          if (!ConditionHelper(formFieldConfig.condition, { record: getValue(value, tab.field), data: this.props.data, step: this.props.step, extraContainerPath: getChainPath(this.props.config.field, tab.field) }, this)) {
                            if (!this.formFieldsMountedList[index]) this.formFieldsMountedList = set(this.formFieldsMountedList, `[${index}]`, [])
                            this.formFieldsMountedList = set(this.formFieldsMountedList, `[${index}][${formFieldIndex}]`, false)
                            this.formFieldsList[index] && (this.formFieldsList[index][formFieldIndex] = null)
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

                          let status = ((this.state.formDataList[index] || [])[formFieldIndex] || {}).status || 'normal'

                          if (['group', 'import_subform', 'object', 'tabs', 'form'].some((type) => type === formFieldConfig.type)) {
                            status = 'normal'
                          }

                          // 渲染表单项容器
                          if (hidden) {
                            return (
                              <div key={formFieldIndex} style={display ? { position: 'relative' } : { overflow: 'hidden', width: 0, height: 0 }}>
                                {this.renderItemFieldComponent({
                                  index: formFieldIndex,
                                  label: formFieldConfig.label,
                                  subLabel: this.handleSubLabelContent(formFieldConfig),
                                  status,
                                  message: ((this.state.formDataList[index] || [])[formFieldIndex] || {}).message || '',
                                  required: getBoolean(formFieldConfig.required),
                                  extra: StatementHelper(formFieldConfig.extra, { record: getValue(value, tab.field), data: this.props.data, step: this.props.step, extraContainerPath: getChainPath(this.props.config.field, tab.field) }, this),
                                  layout: this.props.formLayout,
                                  fieldType: formFieldConfig.type,
                                  children: (
                                    <FormField
                                      key={formFieldIndex}
                                      ref={(formField: Field<FieldConfigs, any, any> | null) => {
                                        if (!this.formFieldsList[index]) this.formFieldsList = set(this.formFieldsList, `[${index}]`, [])
                                        this.formFieldsList = set(this.formFieldsList, `[${index}][${formFieldIndex}]`, formField)
                                        this.handleMount(index, formFieldIndex)
                                      }}
                                      form={this.props.form}
                                      formLayout={this.props.formLayout}
                                      value={getValue(value, getChainPath(tab.field, formFieldConfig.field))}
                                      record={getValue(value, tab.field)}
                                      data={this.props.data}
                                      step={this.props.step}
                                      config={formFieldConfig}
                                      onChange={(value: any) => this.handleChange(index, formFieldIndex, value)}
                                      onValueSet={async (path, value, validation, options) => this.handleValueSet(index, formFieldIndex, path, value, validation, options)}
                                      onValueUnset={async (path, validation, options) => this.handleValueUnset(index, formFieldIndex, path, validation, options)}
                                      onValueListAppend={async (path, value, validation, options) => this.handleValueListAppend(index, formFieldIndex, path, value, validation, options)}
                                      onValueListSplice={async (path, _index, count, validation, options) => this.handleValueListSplice(index, formFieldIndex, path, _index, count, validation, options)}
                                      onValueListSort={async (path, _index, sortType, validation, options) => this.handleValueListSort(index, formFieldIndex, path, _index, sortType, validation, options)}
                                      baseRoute={this.props.baseRoute}
                                      loadDomain={async (domain: string) => await this.props.loadDomain(domain)}
                                      containerPath={getChainPath(this.props.containerPath, this.props.config.field, tab.field)}
                                      onReportFields={async (field: string) => await this.handleReportFields(field)}
                                      loadPageList={async () => await this.props.loadPageList()}
                                    />
                                  )
                                })}
                              </div>
                            )
                          } else {
                            return <React.Fragment key={formFieldIndex} />
                          }
                        })
                      })}
                    </React.Fragment>
                    )
                  })
                : []
            )
          })
        }
      </React.Fragment>
    )
  }
}
