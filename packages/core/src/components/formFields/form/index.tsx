import React from 'react'
import { Field, FieldConfig, FieldConfigs, FieldError, FieldProps, IField } from '../common'
import getALLComponents from '../'
import { getValue, listItemMove, setValue, getBoolean } from '../../../util/value'
import { cloneDeep } from 'lodash'
import ConditionHelper from '../../../util/condition'
import StatementHelper from '../../../util/statement'

export interface FormFieldConfig extends FieldConfig {
  type: 'form'
  fields: FieldConfigs[]
  primaryField?: string
  insertText?: string
  removeText?: string
  initialValues?: any // 新增子项时的默认值
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
  required: boolean
  status: 'normal' | 'error' | 'loading'
  description?: string
  message?: string
  extra?: string
  layout: 'horizontal' | 'vertical' | 'inline'
  fieldType: string
  children: React.ReactNode
}

interface FormState {
  didMount: boolean
  formDataList: { status: 'normal' | 'error' | 'loading', message?: string }[][]
  showItem: boolean
  showIndex: number
}

export default class FormField extends Field<FormFieldConfig, IFormField, Array<any>, FormState> implements IField<Array<any>> {
  getALLComponents = (type: any): typeof Field => getALLComponents[type]

  formFieldsList: Array<Array<Field<FieldConfigs, any, any> | null>> = []
  formFieldsMountedList: Array<Array<boolean>> = []

  constructor (props: FieldProps<FormFieldConfig, any>) {
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

  // reset: () => Promise<any[]> = async () => {
  //   const defaults = await this.defaultValue()

  //   if (!Array.isArray(defaults)) {
  //     await this.setState({
  //       formDataList: []
  //     })
  //     return []
  //   } else {
  //     const valueList: Array<{ [field: string]: any }> = []
  //     const formDataList: Array<Array<{ value: any, status: 'normal' | 'error' | 'loading', message?: string }>> = []

  //     for (const itemIndex in defaults) {
  //       const itemDefault = defaults[itemIndex]

  //       let value: any = {}
  //       const formData: Array<{ value: any, status: 'normal' | 'error' | 'loading', message?: string }> = []

  //       for (const fieldIndex in this.props.config.fields) {
  //         const fieldConfig = this.props.config.fields[fieldIndex]
  //         value = setValue(value, fieldConfig.field, getValue(itemDefault, fieldConfig.field))
  //         formData[fieldIndex] = { value: getValue(itemDefault, fieldConfig.field), status: 'normal' }
  //       }
  //       this.formItemsMounted.push(false)
  //       valueList.push(value)
  //       formDataList.push(formData)
  //     }
  //     await this.setState({
  //       formDataList
  //     })
  //     return valueList
  //   }

  // }

  validate = async (value: Array<any>): Promise<true | FieldError[]> => {
    const errors: FieldError[] = []

    if (this.props.config.required === true && value.length === 0) {
      errors.push(new FieldError('不能为空'))
    }

    let childrenError = 0

    const formDataList = cloneDeep(this.state.formDataList)

    for (const formItemsIndex in this.formFieldsList) {
      if (!formDataList[formItemsIndex]) formDataList[formItemsIndex] = []
      const formItems = this.formFieldsList[formItemsIndex]
      for (const fieldIndex in (this.props.config.fields || [])) {
        const formItem = formItems[fieldIndex]
        if (formItem !== null && formItem !== undefined && !formItem.props.config.disabled) {
          const validation = await formItem.validate(getValue(value[formItemsIndex], (this.props.config.fields || [])[fieldIndex].field))

          if (validation === true) {
            formDataList[formItemsIndex][fieldIndex] = { status: 'normal' }
          } else {
            childrenError++
            formDataList[formItemsIndex][fieldIndex] = { status: 'error', message: validation[0].message }
          }
        }
      }
    }

    await this.setState({
      formDataList
    })

    if (childrenError > 0) {
      errors.push(new FieldError(`子项中存在${childrenError}个错误。`))
    }

    return errors.length ? errors : true
  }

  set = async (value: any) => {
    if (this.props.config.unstringify && this.props.config.unstringify.length > 0 && Array.isArray(value)) {
      for (let index = 0; index < value.length; index++) {
        if (value[index]) {
          for (const field of this.props.config.unstringify) {
            const info = getValue(value[index], field)
            try {
              value[index] = setValue(value[index], field, JSON.parse(info))
            } catch (e) {}
          }
        }
      }
    }

    return value
  }

  get = async () => {
    const data: any[] = []

    for (let index = 0; index < this.formFieldsList.length; index++) {
      if (this.formFieldsList[index]) {
        let item: any = {}

        if (Array.isArray(this.props.config.fields)) {
          for (const formFieldIndex in this.props.config.fields) {
            const formFieldConfig = this.props.config.fields[formFieldIndex]
            if (!ConditionHelper(formFieldConfig.condition, { record: this.props.value[index], data: this.props.data, step: this.props.step })) {
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
      this.formFieldsMountedList[index] = []
    }
    if (this.formFieldsMountedList[index][formFieldIndex]) {
      return true
    }
    this.formFieldsMountedList[index][formFieldIndex] = true

    const formDataList = cloneDeep(this.state.formDataList)
    if (!formDataList[index]) formDataList[index] = []

    if (this.formFieldsList[index] && this.formFieldsList[index][formFieldIndex]) {
      const formField = this.formFieldsList[index][formFieldIndex]
      if (formField) {
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]

        let value = getValue(this.props.value[index] === undefined ? {} : this.props.value[index], formFieldConfig.field)
        const source = value
        if ((formFieldConfig.defaultValue) && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.props.onValueSet(`[${index}]${formFieldConfig.field}`, value, true)
        }

        if (value !== undefined) {
          const validation = await formField.validate(value)
          if (validation === true) {
            formDataList[index][formFieldIndex] = { status: 'normal' }
          } else {
            formDataList[index][formFieldIndex] = { status: 'error', message: validation[0].message }
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

    const formDataList = cloneDeep(this.state.formDataList)
    formDataList[index] = []
    this.setState({
      formDataList
    })

    this.formFieldsList[index] = []
    this.formFieldsMountedList[index] = []

    await this.props.onValueListAppend('', this.props.config.initialValues === undefined ? {} : cloneDeep(this.props.config.initialValues), true)
  }

  handleRemove = async (index: number) => {
    const formDataList = cloneDeep(this.state.formDataList)
    formDataList.splice(index, 1)
    this.setState({
      formDataList
    })

    this.formFieldsList.splice(index, 1)
    this.formFieldsMountedList.splice(index, 1)

    await this.props.onValueListSplice('', index, 1, true)
  }

  handleSort = async (index: number, sortType: 'up' | 'down') => {
    const formDataList = listItemMove(cloneDeep(this.state.formDataList), index, sortType)
    this.setState({
      formDataList
    })
    this.formFieldsList = listItemMove(this.formFieldsList, index, sortType)
    this.formFieldsMountedList = listItemMove(this.formFieldsMountedList, index, sortType)
    await this.props.onValueListSort('', index, sortType, true)
  }

  handleChange = async (index: number, formFieldIndex: number, value: any) => {
    // const formField = this.formItemsList[index][formFieldIndex]
    // const formFieldConfig = this.props.config.fields[formFieldIndex]

    // const formDataList = cloneDeep(this.state.formDataList)
    // const formValueList = cloneDeep(this.props.value) || []

    // if (!formDataList[index]) formDataList[index] = []

    // if (formField && formFieldConfig) {
    //   formValueList[index] = setValue(formValueList[index] || {}, formFieldConfig.field, value)

    //   const validation = await formField.validate(value)
    //   if (validation === true) {
    //     formDataList[index][formFieldIndex] = { status: 'normal' }
    //   } else {
    //     formDataList[index][formFieldIndex] = { status: 'error', message: validation[0].message }
    //   }

    //   this.setState({
    //     formDataList
    //   })
    //   if (this.props.onChange) {
    //     this.props.onChange(formValueList)
    //   }
    // }
  }

  handleValueSet = async (index: number, formFieldIndex: number, path: string, value: any, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueSet(`[${index}]${fullPath}`, value, true)

      const formDataList = cloneDeep(this.state.formDataList)
      if (validation === true) {
        formDataList[index][formFieldIndex] = { status: 'normal' }
      } else {
        formDataList[index][formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formDataList
      })
    }
  }

  handleValueUnset = async (index: number, formFieldIndex: number, path: string, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueUnset(`[${index}]${fullPath}`, true)

      const formDataList = cloneDeep(this.state.formDataList)
      if (validation === true) {
        formDataList[index][formFieldIndex] = { status: 'normal' }
      } else {
        formDataList[index][formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formDataList
      })
    }
  }

  handleValueListAppend = async (index: number, formFieldIndex: number, path: string, value: any, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueListAppend(`[${index}]${fullPath}`, value, true)

      const formDataList = cloneDeep(this.state.formDataList)
      if (validation === true) {
        formDataList[index][formFieldIndex] = { status: 'normal' }
      } else {
        formDataList[index][formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formDataList
      })
    }
  }

  handleValueListSplice = async (index: number, formFieldIndex: number, path: string, _index: number, count: number, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueListSplice(`[${index}]${fullPath}`, _index, count, true)

      const formDataList = cloneDeep(this.state.formDataList)
      if (validation === true) {
        formDataList[index][formFieldIndex] = { status: 'normal' }
      } else {
        formDataList[index][formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formDataList
      })
    }
  }

  handleValueListSort = async (index: number, formFieldIndex: number, path: string, _index: number, sortType: 'up' | 'down', validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueListSort(`[${index}]${fullPath}`, _index, sortType, true)

      const formDataList = cloneDeep(this.state.formDataList)
      if (validation === true) {
        formDataList[index][formFieldIndex] = { status: 'normal' }
      } else {
        formDataList[index][formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formDataList
      })
    }
  }

  /**
   * 用于展示子表单组件中的每一子项中的每一个子表单项组件
   * @param props
   * @returns
   */
  renderItemFieldComponent = (props: IFormFieldItemField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件的renderItemFieldComponent方法。
    </React.Fragment>
  }

  /**
   * 用于展示子表单组件中的每一个子项
   * @param props
   * @returns
   */
  renderItemComponent = (props: IFormFieldItem) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件的renderItemComponent方法。
    </React.Fragment>
  }

  /**
   * 用于展示子表单组件
   * @param _props
   * @returns
   */
  renderComponent = (_props: IFormField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件。
    </React.Fragment>
  }

  render = () => {
    const {
      value = [],
      formLayout,
      data,
      step,
      config: {
        label,
        fields,
        primaryField,
        insertText,
        removeText,
        canInsert,
        canRemove,
        canSort,
        canCollapse
      }
    } = this.props

    return (
      <React.Fragment>
        {
          this.renderComponent({
            insertText: insertText === undefined ? `插入 ${label}` : insertText,
            onInsert: canInsert ? async () => await this.handleInsert() : undefined,
            canCollapse,
            children: (
              this.state.didMount
                ? (Array.isArray(value) ? value : []).map((itemValue: any, index: number) => {
                    return <React.Fragment key={index} >
                      {this.renderItemComponent({
                        index,
                        isLastIndex: value.length - 1 === index,
                        title: primaryField !== undefined ? getValue(itemValue, primaryField, '').toString() : index.toString(),
                        removeText: removeText === undefined
                          ? `删除 ${label}`
                          : removeText,
                        onRemove: canRemove ? async () => await this.handleRemove(index) : undefined,
                        onSort: canSort ? async (sortType: 'up' | 'down') => await this.handleSort(index, sortType) : undefined,
                        canCollapse,
                        children: (fields || []).map((formFieldConfig, fieldIndex) => {
                          if (!ConditionHelper(formFieldConfig.condition, { record: itemValue, data: this.props.data, step: this.props.step })) {
                            if (!this.formFieldsMountedList[index]) this.formFieldsMountedList[index] = []
                            this.formFieldsMountedList[index][fieldIndex] = false
                            return null
                          }
                          const FormField = this.getALLComponents(formFieldConfig.type) || Field

                          let status = ((this.state.formDataList[index] || [])[fieldIndex] || {}).status || 'normal'

                          if (['group', 'import_subform', 'object', 'tabs', 'form'].some((type) => type === formFieldConfig.type)) {
                            status = 'normal'
                          }
                          // 渲染表单项容器
                          return (
                            <div key={fieldIndex}>
                              {
                                this.renderItemFieldComponent({
                                  index: fieldIndex,
                                  label: formFieldConfig.label,
                                  status,
                                  message: ((this.state.formDataList[index] || [])[fieldIndex] || {}).message || '',
                                  extra: StatementHelper(formFieldConfig.extra, { record: this.props.record, data: this.props.data, step: this.props.step }),
                                  required: getBoolean(formFieldConfig.required),
                                  layout: formLayout,
                                  fieldType: formFieldConfig.type,
                                  children: (
                                    <FormField
                                      ref={(fieldRef: Field<FieldConfigs, any, any> | null) => {
                                        if (fieldRef) {
                                          if (!this.formFieldsList[index]) this.formFieldsList[index] = []
                                          this.formFieldsList[index][fieldIndex] = fieldRef
                                          this.handleMount(index, fieldIndex)
                                        }
                                      }}
                                      form={this.props.form}
                                      formLayout={formLayout}
                                      value={getValue(value[index], formFieldConfig.field)}
                                      record={value[index]}
                                      data={cloneDeep(data)}
                                      step={step}
                                      config={formFieldConfig}
                                      onChange={(value: any) => this.handleChange(index, fieldIndex, value)}
                                      onValueSet={async (path, value, validation, options) => this.handleValueSet(index, fieldIndex, path, value, validation, options)}
                                      onValueUnset={async (path, validation, options) => this.handleValueUnset(index, fieldIndex, path, validation, options)}
                                      onValueListAppend={async (path, value, validation, options) => this.handleValueListAppend(index, fieldIndex, path, value, validation, options)}
                                      onValueListSplice={async (path, _index, count, validation, options) => this.handleValueListSplice(index, fieldIndex, path, _index, count, validation, options)}
                                      onValueListSort={async (path, _index, sortType, validation, options) => await this.handleValueListSort(index, fieldIndex, path, _index, sortType, validation, options)}
                                      baseRoute={this.props.baseRoute}
                                      loadDomain={async (domain: string) => await this.props.loadDomain(domain)}
                                    />
                                  )
                                })
                              }
                            </div>
                          )
                        })
                      })
                      }
                    </React.Fragment >
                  }
                  )
                : []
            )
          })
        }
      </React.Fragment >
    )
  }
}
