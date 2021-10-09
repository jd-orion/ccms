import React from 'react'
import { Field, FieldConfig, FieldConfigs, FieldError, FieldProps, IField } from '../common'
import getALLComponents from '../'
import { getValue } from '../../../util/value'
import { cloneDeep } from 'lodash'
import ConditionHelper from '../../../util/condition'

class DefaultFormField extends React.Component {
  render () {
    return (
      <React.Fragment>当前UI库未实现该表单类型</React.Fragment>
    )
  }
}

export interface FormFieldConfig extends FieldConfig {
  type: 'form'
  fields: FieldConfigs[]
  primaryField?: string
  insertText?: string
  removeText?: string
  initialValues?: any // 新增子项时的默认值
  mode?: 'show' // 子项仅显示列表
  modeValue?: string
}

export interface IFormField {
  insertText: string
  onInsert: () => Promise<void>
  children: React.ReactNode[]
}

export interface IFormFieldItem {
  index: number
  title: string
  removeText: string
  onRemove: () => Promise<void>
  children: React.ReactNode[]
}

export interface IFormFieldItemField {
  index: number
  label: string
  status: 'normal' | 'error' | 'loading'
  description?: string
  message?: string
  layout: 'horizontal' | 'vertical' | 'inline'
  fieldType: string
  children: React.ReactNode
}

interface FormState {
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
      formDataList: [],
      showItem: false,
      showIndex: 0
    }
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

  // validate = async (): Promise<true | FieldError[]> => {
  //   const {
  //     config: {
  //       required,
  //       fields
  //     },
  //     value
  //   } = this.props

  //   const errors: FieldError[] = []

  //   if (getBoolean(required)) {
  //     if (value.length === 0) {
  //       errors.push(new FieldError('不能为空'))
  //     }
  //   }

  //   let childrenError = 0

  //   for (const formItemsIndex in this.formItemsList) {
  //     const formItems = this.formItemsList[formItemsIndex]
  //     for (const fieldIndex in fields) {
  //       const formItem = formItems[fieldIndex]
  //       if (formItem !== null && formItem !== undefined) {
  //         const validation = await formItem.validate(getValue(value[formItemsIndex], fields[fieldIndex].field))
  //         if (validation !== true) {
  //           childrenError++
  //         }
  //       }
  //     }
  //   }

  //   if (childrenError > 0) {
  //     errors.push(new FieldError(`子项中存在${childrenError}个错误。`))
  //   }

  //   return errors.length ? errors : true
  // }

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

        let value = getValue(this.props.value[index] || {}, formFieldConfig.field)
        if ((formFieldConfig.defaultValue) && value === undefined) {
          value = await formField.reset()
          this.props.onValueSet(`[${index}]${formFieldConfig.field}`, value, true)
        }

        const validation = await formField.validate(value)
        if (validation === true) {
          formDataList[index][formFieldIndex] = { status: 'normal' }
        } else {
          formDataList[index][formFieldIndex] = { status: 'error', message: validation[0].message }
        }
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

    this.formFieldsMountedList[index] = []

    await this.props.onValueListAppend('', cloneDeep(this.props.config.initialValues) || {}, true)
  }

  handleRemove = async (index: number) => {
    const formDataList = cloneDeep(this.state.formDataList)
    formDataList.splice(index, 1)
    this.setState({
      formDataList
    })

    this.formFieldsMountedList.splice(index, 1)

    await this.props.onValueListSplice('', index, 1, true)
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

  handleValueSet = async (index: number, formFieldIndex: number, path: string, value: any, validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
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

  handleValueUnset = async (index: number, formFieldIndex: number, path: string, validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
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

  handleValueListAppend = async (index: number, formFieldIndex: number, path: string, value: any, validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
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

  handleValueListSplice = async (index: number, formFieldIndex: number, path: string, _index: number, count: number, validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
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
        removeText
      }
    } = this.props

    return (
      <React.Fragment>
        {
          this.renderComponent({
            insertText: insertText === undefined ? `插入 ${label}` : insertText,
            onInsert: async () => await this.handleInsert(),
            children: (
              (Array.isArray(value) ? value : []).map((itemValue: any, index: number) => {
                return <React.Fragment key={index} >
                  {this.renderItemComponent({
                    index,
                    title: primaryField !== undefined ? getValue(itemValue, primaryField) : index.toString(),
                    removeText: removeText === undefined
                      ? `删除 ${label}`
                      : removeText,
                    onRemove: async () => await this.handleRemove(index),
                    children: (fields || []).map((formFieldConfig, fieldIndex) => {
                      if (!ConditionHelper(formFieldConfig.condition, { record: itemValue, data: this.props.data, step: this.props.step })) {
                        return null
                      }
                      const FormField = this.getALLComponents(formFieldConfig.type) || DefaultFormField

                      // 渲染表单项容器
                      return (
                        <div key={fieldIndex}>
                          {
                            this.renderItemFieldComponent({
                              index: fieldIndex,
                              label: formFieldConfig.label,
                              status: ((this.state.formDataList[index] || [])[fieldIndex] || {}).status || 'normal',
                              message: ((this.state.formDataList[index] || [])[fieldIndex] || {}).message || '',
                              layout: formLayout,
                              fieldType: formFieldConfig.type,
                              children: (
                                <FormField
                                  ref={(fieldRef: Field<FieldConfigs, any, any> | null) => {
                                    if (!this.formFieldsList[index]) this.formFieldsList[index] = []
                                    this.formFieldsList[index][fieldIndex] = fieldRef
                                    this.handleMount(index, fieldIndex)
                                  }}
                                  formLayout={formLayout}
                                  value={getValue(value[index], formFieldConfig.field)}
                                  record={value[index]}
                                  data={cloneDeep(data)}
                                  step={step}
                                  config={formFieldConfig}
                                  onChange={(value: any) => this.handleChange(index, fieldIndex, value)}
                                  onValueSet={async (path, value, validation) => this.handleValueSet(index, fieldIndex, path, value, validation)}
                                  onValueUnset={async (path, validation) => this.handleValueUnset(index, fieldIndex, path, validation)}
                                  onValueListAppend={async (path, value, validation) => this.handleValueListAppend(index, fieldIndex, path, value, validation)}
                                  onValueListSplice={async (path, _index, count, validation) => this.handleValueListSplice(index, fieldIndex, path, _index, count, validation)}
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
            )
          })
        }
      </React.Fragment >
    )
  }
}
