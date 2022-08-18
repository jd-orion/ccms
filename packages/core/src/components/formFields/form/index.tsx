import React from 'react'
import { Field, FieldConfig, FieldConfigs, FieldError, FieldProps, IField } from '../common'
import getALLComponents from '..'
// import { cloneDeep } from 'lodash'
import { getValue, getBoolean, getChainPath } from '../../../util/value'
import { set, setValue, sort, splice } from '../../../util/produce'
import ConditionHelper from '../../../util/condition'
import StatementHelper from '../../../util/statement'

export interface FormFieldConfig extends FieldConfig {
  type: 'form'
  fields: FieldConfigs[]
  primaryField?: string
  insertText?: string
  removeText?: string
  initialValues?: unknown // 新增子项时的默认值
  mode?: 'show' // 子项仅显示列表
  modeValue?: string
  canInsert?: boolean
  canRemove?: boolean
  canSort?: boolean
  canCollapse?: boolean // 是否用Collapse折叠展示
  stringify?: string[] // 序列号字段
  unstringify?: string[] // 反序列化字段
}

export interface IFormField {
  insertText: string
  onInsert?: () => Promise<void>
  canCollapse?: boolean
  children: React.ReactNode[]
}

export interface IFormFieldItem {
  index: number
  isLastIndex: boolean
  title: string
  removeText: string
  onRemove?: () => Promise<void>
  onSort?: (sortType: 'up' | 'down') => Promise<void>
  canCollapse?: boolean
  children: React.ReactNode[]
}

export interface IFormFieldItemField {
  index: number
  label: string
  subLabel?: React.ReactNode
  required: boolean
  status: 'normal' | 'error' | 'loading'
  description?: string
  message?: string
  extra?: string
  layout: 'horizontal' | 'vertical' | 'inline'
  visitable: boolean
  fieldType: string
  children: React.ReactNode
}

interface FormState {
  didMount: boolean
  formDataList: { status: 'normal' | 'error' | 'loading'; message?: string }[][]
  showItem: boolean
  showIndex: number
}

export default class FormField
  extends Field<FormFieldConfig, IFormField, Array<unknown>, FormState>
  implements IField<Array<unknown>>
{
  getALLComponents = (type: string): typeof Field => getALLComponents[type]

  formFieldsList: Array<Array<Field<FieldConfigs, unknown, unknown> | null>> = []

  formFieldsMountedList: Array<Array<boolean>> = []

  constructor(props: FieldProps<FormFieldConfig, unknown[]>) {
    super(props)

    this.state = {
      didMount: false,
      formDataList: [],
      showItem: false,
      showIndex: 0
    }
  }

  didMount = async () => {
    await this.setState({
      didMount: true
    })
  }

  validate = async (value: Array<unknown>): Promise<true | FieldError[]> => {
    const errors: FieldError[] = []

    if (this.props.config.required === true && value.length === 0) {
      errors.push(new FieldError('不能为空'))
    }

    let childrenError = 0
    let childrenErrorMsg = {}
    let { formDataList } = this.state

    for (let formItemsIndex = 0; formItemsIndex < this.formFieldsList.length; formItemsIndex++) {
      if (!formDataList[formItemsIndex]) formDataList[formItemsIndex] = []
      const formItems = this.formFieldsList[formItemsIndex]
      const itemErrorMsg: Array<{ name: string; msg: string }> = []
      for (let fieldIndex = 0; fieldIndex < (this.props.config.fields || []).length; fieldIndex++) {
        const formItem = formItems[fieldIndex]
        if (formItem !== null && formItem !== undefined && !formItem.props.config.disabled) {
          const validation = await formItem.validate(
            getValue(value[formItemsIndex], (this.props.config.fields || [])[fieldIndex].field)
          )

          if (validation === true) {
            formDataList = set(formDataList, `[${formItemsIndex}][${fieldIndex}]`, { status: 'normal' })
          } else {
            childrenError++
            formDataList = set(formDataList, `[${formItemsIndex}][${fieldIndex}]`, {
              status: 'error',
              message: validation[0].message
            })
            itemErrorMsg.push({
              name: this.props.config.fields[fieldIndex].label,
              msg: validation[0].message
            })
          }
        }
      }

      itemErrorMsg.length > 0 && (childrenErrorMsg[formItemsIndex] = itemErrorMsg)
    }

    await this.setState({
      formDataList
    })

    if (childrenError > 0) {
      let errTips = `${this.props.config.label || ''}表单有以下错误项：`
      for (const variable in childrenErrorMsg) {
        if (variable) {
          errTips += `第${Number(variable) + 1}项中${childrenErrorMsg[variable].map(
            (item: { name: string; msg: string }) => `${item.msg}`
          )}`
        }
      }
      childrenErrorMsg = {}
      errors.push(new FieldError(errTips))
    }

    return errors.length ? errors : true
  }

  set = async (value: unknown) => {
    const _value = value
    if (this.props.config.unstringify && this.props.config.unstringify.length > 0 && Array.isArray(_value)) {
      for (let index = 0; index < _value.length; index++) {
        if (_value[index]) {
          for (const field of this.props.config.unstringify) {
            const info = getValue(_value[index], field)
            try {
              _value[index] = setValue(_value[index], field, JSON.parse(info))
            } catch (e) {
              /* 无逻辑 */
            }
          }
        }
      }
    }

    return _value
  }

  get = async () => {
    const data: { [key: string]: unknown }[] = []

    for (let index = 0; index < this.formFieldsList.length; index++) {
      if (this.formFieldsList[index]) {
        let item: { [key: string]: unknown } = {}

        if (Array.isArray(this.props.config.fields)) {
          for (let formFieldIndex = 0; formFieldIndex < this.props.config.fields.length; formFieldIndex++) {
            const formFieldConfig = this.props.config.fields[formFieldIndex]
            if (
              !ConditionHelper(
                formFieldConfig.condition,
                {
                  record: this.props.value[index] as { [field: string]: unknown },
                  data: this.props.data,
                  step: this.props.step,
                  containerPath: this.props.containerPath,
                  extraContainerPath: getChainPath(this.props.config.field, index)
                },
                this
              )
            ) {
              continue
            }
            const formField = this.formFieldsList[index] && this.formFieldsList[index][formFieldIndex]
            if (formField && !formFieldConfig.disabled) {
              const value = await formField.get()
              item = setValue(item, formFieldConfig.field, value)
            }
          }
        }

        if (this.props.config.stringify) {
          for (const field of this.props.config.stringify) {
            const info = getValue(item, field)
            item = setValue(item, field, JSON.stringify(info))
          }
        }

        data[index] = item
      }
    }

    return data
  }

  handleMount = async (index: number, formFieldIndex: number) => {
    if (!this.formFieldsMountedList[index]) {
      this.formFieldsMountedList = set(this.formFieldsMountedList, `[${index}]`, [])
    }
    if (this.formFieldsMountedList[index][formFieldIndex]) {
      return true
    }
    // this.formFieldsMountedList[index][formFieldIndex] = true
    this.formFieldsMountedList = set(this.formFieldsMountedList, `[${index}][${formFieldIndex}]`, true)

    let { formDataList } = this.state
    if (!formDataList[index]) formDataList = set(formDataList, `[${index}]`, [])

    if (this.formFieldsList[index] && this.formFieldsList[index][formFieldIndex]) {
      const formField = this.formFieldsList[index][formFieldIndex]
      if (formField) {
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]

        let value = getValue(
          this.props.value[index] === undefined ? {} : this.props.value[index],
          formFieldConfig.field
        )
        const source = value
        if (formFieldConfig.defaultValue && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.props.onValueSet(`[${index}].${formFieldConfig.field}`, value, true)
          // this.props.onValueSet(`${index}.${formFieldConfig.field}`, value, true)
        }

        if (value !== undefined) {
          const validation = await formField.validate(value)
          if (validation === true) {
            formDataList = set(formDataList, `[${index}][${formFieldIndex}]`, { status: 'normal' })
          } else {
            formDataList = set(formDataList, `[${index}][${formFieldIndex}]`, {
              status: 'error',
              message: validation[0].message
            })
          }
        }

        await formField.didMount()
      }
    }

    await this.setState({
      formDataList
    })
  }

  handleInsert = async () => {
    const index = (this.props.value || []).length

    const formDataList = set(this.state.formDataList, `[${index}]`, [])
    this.setState({
      formDataList
    })

    this.formFieldsList = set(this.formFieldsList, `${index}`, [])
    this.formFieldsMountedList = set(this.formFieldsMountedList, `${index}`, [])

    await this.props.onValueListAppend(
      '',
      this.props.config.initialValues === undefined ? {} : this.props.config.initialValues,
      true
    )
  }

  handleRemove = async (index: number) => {
    const formDataList = splice(this.state.formDataList, '', index, 1)
    this.setState({
      formDataList
    })
    this.formFieldsList = splice(this.formFieldsList, '', index, 1)
    this.formFieldsMountedList = splice(this.formFieldsMountedList, '', index, 1)
    await this.props.onValueListSplice('', index, 1, true)
  }

  handleSort = async (index: number, sortType: 'up' | 'down') => {
    const list = this.state.formDataList
    const formDataList = sort(list, '', index, sortType)
    this.setState({
      formDataList
    })
    this.formFieldsList = sort(this.formFieldsList, '', index, sortType)
    this.formFieldsMountedList = sort(this.formFieldsMountedList, '', index, sortType)
    await this.props.onValueListSort('', index, sortType, true)
  }

  handleChange: (index: number, formFieldIndex: number, value: unknown) => Promise<void> = async () => {
    /* 无逻辑 */
  }

  /**
   * 处理set、unset、append、splice、sort后的操作
   */
  handleValueCallback = async (index: number, formFieldIndex: number, validation: true | FieldError[]) => {
    let { formDataList } = this.state
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

      await this.props.onValueSet(`[${index}].${fullPath}`, value, true)

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

      await this.props.onValueUnset(`[${index}]${fullPath}`, true)

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

      await this.props.onValueListAppend(`[${index}]${fullPath}`, value, true)

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

      await this.props.onValueListSplice(`[${index}]${fullPath}`, _index, count, true)

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

      await this.props.onValueListSort(`[${index}]${fullPath}`, _index, sortType, true)

      this.handleValueCallback(index, formFieldIndex, validation)
    }
  }

  /**
   * 用于展示子表单组件中的每一子项中的每一个子表单项组件
   * @param props
   * @returns
   */
  renderItemFieldComponent: (props: IFormFieldItemField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormField组件的renderItemFieldComponent方法。</>
  }

  /**
   * 用于展示子表单组件中的每一个子项
   * @param props
   * @returns
   */
  renderItemComponent: (props: IFormFieldItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormField组件的renderItemComponent方法。</>
  }

  /**
   * 用于展示子表单组件
   * @param _props
   * @returns
   */
  renderComponent: (props: IFormField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormField组件。</>
  }

  render = () => {
    const {
      value = [],
      formLayout,
      data,
      config: { label, fields, primaryField, insertText, removeText, canInsert, canRemove, canSort, canCollapse }
    } = this.props

    return (
      <>
        {this.renderComponent({
          insertText: insertText === undefined ? `插入 ${label}` : insertText,
          onInsert: canInsert ? async () => this.handleInsert() : undefined,
          canCollapse,
          children: this.state.didMount
            ? (Array.isArray(value) ? value : []).map((itemValue: unknown, index: number) => {
                return (
                  <React.Fragment key={index}>
                    {this.renderItemComponent({
                      index,
                      isLastIndex: value.length - 1 === index,
                      title:
                        primaryField !== undefined
                          ? getValue(itemValue, primaryField, '').toString()
                          : index.toString(),
                      removeText: removeText === undefined ? `删除 ${label}` : removeText,
                      onRemove: canRemove ? async () => this.handleRemove(index) : undefined,
                      onSort: canSort ? async (sortType: 'up' | 'down') => this.handleSort(index, sortType) : undefined,
                      canCollapse,
                      children: (fields || []).map((formFieldConfig, fieldIndex) => {
                        if (
                          !ConditionHelper(
                            formFieldConfig.condition,
                            {
                              record: itemValue as { [field: string]: unknown },
                              data: this.props.data,
                              step: this.props.step,
                              containerPath: this.props.containerPath,
                              extraContainerPath: getChainPath(this.props.config.field, index)
                            },
                            this
                          )
                        ) {
                          if (!this.formFieldsMountedList[index])
                            this.formFieldsMountedList = set(this.formFieldsMountedList, `${index}`, [])
                          this.formFieldsMountedList = set(
                            this.formFieldsMountedList,
                            `${[index]}.${fieldIndex}`,
                            false
                          )
                          this.formFieldsList[index] && (this.formFieldsList[index][fieldIndex] = null)
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

                        const SubFormField = this.getALLComponents(formFieldConfig.type) || Field

                        let status = ((this.state.formDataList[index] || [])[fieldIndex] || {}).status || 'normal'

                        if (
                          ['group', 'import_subform', 'object', 'tabs', 'form'].some(
                            (type) => type === formFieldConfig.type
                          )
                        ) {
                          status = 'normal'
                        }

                        const renderData: IFormFieldItemField = {
                          index: fieldIndex,
                          label: formFieldConfig.label,
                          subLabel: this.handleSubLabelContent(formFieldConfig),
                          status,
                          message: ((this.state.formDataList[index] || [])[fieldIndex] || {}).message || '',
                          extra: StatementHelper(
                            formFieldConfig.extra,
                            {
                              record: itemValue as { [field: string]: unknown },
                              data: this.props.data,
                              step: this.props.step,
                              containerPath: this.props.containerPath,
                              extraContainerPath: getChainPath(this.props.config.field, index)
                            },
                            this
                          ),
                          required: getBoolean(formFieldConfig.required),
                          layout: formLayout,
                          visitable: display,
                          fieldType: formFieldConfig.type,
                          children: (
                            <SubFormField
                              ref={(fieldRef: Field<FieldConfigs, unknown, unknown> | null) => {
                                if (fieldRef) {
                                  if (!this.formFieldsList[index])
                                    this.formFieldsList = set(this.formFieldsList, `[${index}]`, [])
                                  this.formFieldsList = set(this.formFieldsList, `[${index}][${fieldIndex}]`, fieldRef)
                                  this.handleMount(index, fieldIndex)
                                }
                              }}
                              form={this.props.form}
                              formLayout={formLayout}
                              value={getValue(value[index], formFieldConfig.field)}
                              record={value[index]}
                              step={this.props.step}
                              data={data}
                              config={formFieldConfig}
                              onChange={(valueChange: unknown) => this.handleChange(index, fieldIndex, valueChange)}
                              onValueSet={async (path, valueSet, validation, options) =>
                                this.handleValueSet(index, fieldIndex, path, valueSet, validation, options)
                              }
                              onValueUnset={async (path, validation, options) =>
                                this.handleValueUnset(index, fieldIndex, path, validation, options)
                              }
                              onValueListAppend={async (path, valueAppend, validation, options) =>
                                this.handleValueListAppend(index, fieldIndex, path, valueAppend, validation, options)
                              }
                              onValueListSplice={async (path, indexSplict, count, validation, options) =>
                                this.handleValueListSplice(
                                  index,
                                  fieldIndex,
                                  path,
                                  indexSplict,
                                  count,
                                  validation,
                                  options
                                )
                              }
                              onValueListSort={async (path, indexSort, sortType, validation, options) =>
                                this.handleValueListSort(
                                  index,
                                  fieldIndex,
                                  path,
                                  indexSort,
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
                              containerPath={getChainPath(this.props.containerPath, this.props.config.field, index)}
                              onReportFields={async (field: string) => this.handleReportFields(field)}
                            />
                          )
                        }
                        // 渲染表单项容器
                        return hidden ? (
                          <div key={fieldIndex}>{this.renderItemFieldComponent(renderData)}</div>
                        ) : (
                          <React.Fragment key={fieldIndex} />
                        )
                      })
                    })}
                  </React.Fragment>
                )
              })
            : []
        })}
      </>
    )
  }
}
