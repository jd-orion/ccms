import React from 'react'
import { Field, FieldConfig, FieldConfigs, FieldError, FieldProps, IField } from '../common'
import getALLComponents from '..'
import ConditionHelper from '../../../util/condition'
import { set, setValue } from '../../../util/produce'
import { getValue, getBoolean, getChainPath } from '../../../util/value'
import StatementHelper from '../../../util/statement'

export type TabsFieldConfig = TabsFieldConfigSame | TabsFieldConfigDiff

export interface TabsFieldConfigBasic extends FieldConfig {
  type: 'tabs'
}

export interface TabsFieldConfigSame extends TabsFieldConfigBasic {
  mode: 'same'
  fields: FieldConfigs[]
  tabs: {
    field: string
    label: string
  }[]
}

export interface TabsFieldConfigDiff extends TabsFieldConfigBasic {
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
  formDataList: { status: 'normal' | 'error' | 'loading'; message?: string }[][]
  extra?: S
}

export default class TabsField<S>
  extends Field<TabsFieldConfig, ITabsField, { [key: string]: unknown }, TabsFieldState<S>>
  implements IField<{ [key: string]: unknown }>
{
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: string): typeof Field => getALLComponents[type]

  formFieldsList: Array<Array<Field<FieldConfigs, unknown, unknown> | null>> = []

  formFieldsMountedList: Array<Array<boolean>> = []

  constructor(props: FieldProps<TabsFieldConfig, { [key: string]: unknown }>) {
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
    let data: { [key: string]: unknown } = {}
    for (let index = 0; index < (this.props.config.tabs || []).length; index++) {
      const tab = (this.props.config.tabs || [])[index]
      const fields =
        this.props.config.mode === 'same'
          ? this.props.config.fields || []
          : ((this.props.config.tabs || [])[index] || {}).fields || []

      for (let formFieldIndex = 0; formFieldIndex < fields.length; formFieldIndex++) {
        const formFieldConfig = fields[formFieldIndex]
        if (
          !ConditionHelper(
            formFieldConfig.condition,
            {
              record: getValue(this.props.value, tab.field),
              data: this.props.data,
              step: this.props.step,
              containerPath: this.props.containerPath,
              extraContainerPath: getChainPath(this.props.config.field, tab.field)
            },
            this
          )
        ) {
          continue
        }
        const formField = this.formFieldsList[index] && this.formFieldsList[index][formFieldIndex]
        if (formField && !formFieldConfig.disabled) {
          const value = await formField.get()
          const fullPath =
            tab.field === '' || formFieldConfig.field === ''
              ? `${tab.field}${formFieldConfig.field}`
              : `${tab.field}.${formFieldConfig.field}`
          data = setValue(data, fullPath, value)
        }
      }
    }

    return data
  }

  validate = async (value: { [key: string]: unknown }): Promise<true | FieldError[]> => {
    const errors: FieldError[] = []

    if (this.props.config.required === true && Object.entries(value).length === 0) {
      errors.push(new FieldError('不能为空'))
    }

    let childrenError = 0
    const childrenErrorMsg = {}

    let { formDataList } = this.state

    for (let formItemsIndex = 0; formItemsIndex < this.formFieldsList.length; formItemsIndex++) {
      const formItems = this.formFieldsList[formItemsIndex]
      if (!formDataList[formItemsIndex]) formDataList[formItemsIndex] = []
      const fields =
        this.props.config.mode === 'same'
          ? this.props.config.fields || []
          : ((this.props.config.tabs || [])[formItemsIndex] || {}).fields || []
      const tab = (this.props.config.tabs || [])[formItemsIndex]
      const itemErrorMsg: Array<{ name: string; msg: string }> = []
      for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
        const formItem = formItems[fieldIndex]
        const formFieldConfig = fields[fieldIndex]
        const fullPath =
          tab.field === '' || formFieldConfig.field === ''
            ? `${tab.field}${formFieldConfig.field}`
            : `${tab.field}.${formFieldConfig.field}`
        if (formItem !== null && formItem !== undefined && !formItem.props.config.disabled) {
          const validation = await formItem.validate(getValue(value, fullPath))
          if (validation === true) {
            formDataList = set(formDataList, `[${formItemsIndex}][${fieldIndex}]`, { status: 'normal' })
          } else {
            childrenError++
            formDataList = set(formDataList, `[${formItemsIndex}][${fieldIndex}]`, {
              status: 'error',
              message: validation[0].message
            })
            itemErrorMsg.push({
              name: formFieldConfig?.label,
              msg: validation[0].message
            })
          }
        }
      }
      itemErrorMsg.length > 0 && (childrenErrorMsg[tab.label] = itemErrorMsg)
    }

    await this.setState({
      formDataList
    })
    if (childrenError > 0) {
      let errTips = `${this.props.config.label || ''}选项卡有以下错误项：`
      for (const variable in childrenErrorMsg) {
        if (variable) {
          errTips += `${variable}中${childrenErrorMsg[variable].map(
            (item: { name: string; msg: string }) => `${item.msg}`
          )}；`
        }
      }
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
        const fields =
          this.props.config.mode === 'same'
            ? this.props.config.fields || []
            : ((this.props.config.tabs || [])[index] || {}).fields || []
        const formFieldConfig = fields[formFieldIndex]

        const fullPath =
          tab.field === '' || formFieldConfig.field === ''
            ? `${tab.field}${formFieldConfig.field}`
            : `${tab.field}.${formFieldConfig.field}`

        let value = getValue(this.props.value, fullPath)
        const source = value
        if (formFieldConfig.defaultValue && value === undefined) {
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

  handleChange: (index: number, formFieldIndex: number, value: unknown) => Promise<void> = async () => {
    /* 无逻辑 */
  }

  /**
   * 处理set、unset、append、splice、sort后的操作
   */
  handleValueCallback = async (index: number, formFieldIndex: number, validation: true | FieldError[]) => {
    let { formDataList } = this.state
    // if (!formDataList[index]) formDataList = set(formDataList, `[${index}]`, [])
    if (validation === true) {
      formDataList = set(formDataList, `[${index}][${formFieldIndex}]`, { status: 'normal' })
    } else {
      formDataList = set(formDataList, `[${index}][${formFieldIndex}]`, {
        status: 'error',
        message: validation[0].message
      })
    }

    this.setState({
      formDataList
    })
  }

  handleValueSet = async (
    index: number,
    formFieldIndex: number,
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields =
      this.props.config.mode === 'same'
        ? this.props.config.fields || []
        : ((this.props.config.tabs || [])[index] || {}).fields || []
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      let fieldPath = ''
      if (options && options.noPathCombination) {
        fieldPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fieldPath = `${formFieldConfig.field}${path}`
      } else {
        fieldPath = `${formFieldConfig.field}.${path}`
      }

      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueSet(fullPath, value, true)

      this.handleValueCallback(index, formFieldIndex, validation)
    }
  }

  handleValueUnset = async (
    index: number,
    formFieldIndex: number,
    path: string,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields =
      this.props.config.mode === 'same'
        ? this.props.config.fields || []
        : ((this.props.config.tabs || [])[index] || {}).fields || []
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      let fieldPath = ''
      if (options && options.noPathCombination) {
        fieldPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fieldPath = `${formFieldConfig.field}${path}`
      } else {
        fieldPath = `${formFieldConfig.field}.${path}`
      }

      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueUnset(fullPath, true)

      this.handleValueCallback(index, formFieldIndex, validation)
    }
  }

  handleValueListAppend = async (
    index: number,
    formFieldIndex: number,
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields =
      this.props.config.mode === 'same'
        ? this.props.config.fields || []
        : ((this.props.config.tabs || [])[index] || {}).fields || []
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      let fieldPath = ''
      if (options && options.noPathCombination) {
        fieldPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fieldPath = `${formFieldConfig.field}${path}`
      } else {
        fieldPath = `${formFieldConfig.field}.${path}`
      }

      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueListAppend(fullPath, value, true)

      this.handleValueCallback(index, formFieldIndex, validation)
    }
  }

  handleValueListSplice = async (
    index: number,
    formFieldIndex: number,
    path: string,
    _index: number,
    count: number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields =
      this.props.config.mode === 'same'
        ? this.props.config.fields || []
        : ((this.props.config.tabs || [])[index] || {}).fields || []
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      let fieldPath = ''
      if (options && options.noPathCombination) {
        fieldPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fieldPath = `${formFieldConfig.field}${path}`
      } else {
        fieldPath = `${formFieldConfig.field}.${path}`
      }

      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueListSplice(fullPath, _index, count, true)

      this.handleValueCallback(index, formFieldIndex, validation)
    }
  }

  handleValueListSort = async (
    index: number,
    formFieldIndex: number,
    path: string,
    _index: number,
    sortType: 'up' | 'down' | 'top' | 'bottom' | number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields =
      this.props.config.mode === 'same'
        ? this.props.config.fields || []
        : ((this.props.config.tabs || [])[index] || {}).fields || []
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      let fieldPath = ''
      if (options && options.noPathCombination) {
        fieldPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fieldPath = `${formFieldConfig.field}${path}`
      } else {
        fieldPath = `${formFieldConfig.field}.${path}`
      }

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
  renderComponent: (props: ITabsField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormField组件。</>
  }

  /**
   * 用于展示子表单组件中的每一个子项
   * @param props
   * @returns
   */
  renderItemComponent: (props: ITabsFieldItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormField组件的renderItemComponent方法。</>
  }

  /**
   * 用于展示子表单组件中的每一子项中的每一个子表单项组件
   * @param props
   * @returns
   */
  renderItemFieldComponent: (props: ITabsFieldItemField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormField组件的renderItemFieldComponent方法。</>
  }

  render = () => {
    const { value = {} } = this.props

    return (
      <>
        {this.renderComponent({
          children: this.state.didMount
            ? (this.props.config.tabs || []).map(
                (tab: { field: string; label: string; fields?: FieldConfigs[] }, index: number) => {
                  const fields =
                    this.props.config.mode === 'same'
                      ? this.props.config.fields || []
                      : ((this.props.config.tabs || [])[index] || {}).fields || []
                  return (
                    <React.Fragment key={index}>
                      {this.renderItemComponent({
                        key: index.toString(),
                        label: tab.label,
                        children: fields.map((formFieldConfig, formFieldIndex) => {
                          if (
                            !ConditionHelper(
                              formFieldConfig.condition,
                              {
                                record: getValue(value, tab.field),
                                data: this.props.data,
                                step: this.props.step,
                                containerPath: this.props.containerPath,
                                extraContainerPath: getChainPath(this.props.config.field, tab.field)
                              },
                              this
                            )
                          ) {
                            if (!this.formFieldsMountedList[index])
                              this.formFieldsMountedList = set(this.formFieldsMountedList, `[${index}]`, [])
                            this.formFieldsMountedList = set(
                              this.formFieldsMountedList,
                              `[${index}][${formFieldIndex}]`,
                              false
                            )
                            this.formFieldsList[index] && (this.formFieldsList[index][formFieldIndex] = null)
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

                          let status = ((this.state.formDataList[index] || [])[formFieldIndex] || {}).status || 'normal'

                          if (
                            ['group', 'import_subform', 'object', 'tabs', 'form'].some(
                              (type) => type === formFieldConfig.type
                            )
                          ) {
                            status = 'normal'
                          }

                          // 渲染表单项容器
                          if (hidden) {
                            return (
                              <div
                                key={formFieldIndex}
                                style={display ? { position: 'relative' } : { overflow: 'hidden', width: 0, height: 0 }}
                              >
                                {this.renderItemFieldComponent({
                                  index: formFieldIndex,
                                  label: formFieldConfig.label,
                                  subLabel: this.handleSubLabelContent(formFieldConfig),
                                  status,
                                  message: ((this.state.formDataList[index] || [])[formFieldIndex] || {}).message || '',
                                  required: getBoolean(formFieldConfig.required),
                                  extra: StatementHelper(
                                    formFieldConfig.extra,
                                    {
                                      record: getValue(value, tab.field),
                                      data: this.props.data,
                                      step: this.props.step,
                                      containerPath: this.props.containerPath,
                                      extraContainerPath: getChainPath(this.props.config.field, tab.field)
                                    },
                                    this
                                  ),
                                  layout: this.props.formLayout,
                                  fieldType: formFieldConfig.type,
                                  children: (
                                    <FormField
                                      key={formFieldIndex}
                                      ref={(formField: Field<FieldConfigs, unknown, unknown> | null) => {
                                        if (!this.formFieldsList[index])
                                          this.formFieldsList = set(this.formFieldsList, `[${index}]`, [])
                                        this.formFieldsList = set(
                                          this.formFieldsList,
                                          `[${index}][${formFieldIndex}]`,
                                          formField
                                        )
                                        this.handleMount(index, formFieldIndex)
                                      }}
                                      form={this.props.form}
                                      formLayout={this.props.formLayout}
                                      value={getValue(value, getChainPath(tab.field, formFieldConfig.field))}
                                      record={getValue(value, tab.field)}
                                      data={this.props.data}
                                      step={this.props.step}
                                      config={formFieldConfig}
                                      onChange={(changeValue: unknown) =>
                                        this.handleChange(index, formFieldIndex, changeValue)
                                      }
                                      onValueSet={async (path, valueSet, validation, options) =>
                                        this.handleValueSet(index, formFieldIndex, path, valueSet, validation, options)
                                      }
                                      onValueUnset={async (path, validation, options) =>
                                        this.handleValueUnset(index, formFieldIndex, path, validation, options)
                                      }
                                      onValueListAppend={async (path, valueAppend, validation, options) =>
                                        this.handleValueListAppend(
                                          index,
                                          formFieldIndex,
                                          path,
                                          valueAppend,
                                          validation,
                                          options
                                        )
                                      }
                                      onValueListSplice={async (path, _index, count, validation, options) =>
                                        this.handleValueListSplice(
                                          index,
                                          formFieldIndex,
                                          path,
                                          _index,
                                          count,
                                          validation,
                                          options
                                        )
                                      }
                                      onValueListSort={async (path, _index, sortType, validation, options) =>
                                        this.handleValueListSort(
                                          index,
                                          formFieldIndex,
                                          path,
                                          _index,
                                          sortType,
                                          validation,
                                          options
                                        )
                                      }
                                      checkPageAuth={async (pageID) => this.props.checkPageAuth(pageID)}
                                      loadPageURL={async (pageID) => this.props.loadPageURL(pageID)}
                                      loadPageFrameURL={async (pageID) => this.props.loadPageFrameURL(pageID)}
                                      loadPageConfig={async (pageID) => this.props.loadPageConfig(pageID)}
                                      loadPageList={async () => this.props.loadPageList()}
                                      baseRoute={this.props.baseRoute}
                                      loadDomain={async (domain: string) => this.props.loadDomain(domain)}
                                      containerPath={getChainPath(
                                        this.props.containerPath,
                                        this.props.config.field,
                                        tab.field
                                      )}
                                      onReportFields={async (field: string) => this.handleReportFields(field)}
                                    />
                                  )
                                })}
                              </div>
                            )
                          }
                          return <React.Fragment key={formFieldIndex} />
                        })
                      })}
                    </React.Fragment>
                  )
                }
              )
            : []
        })}
      </>
    )
  }
}
