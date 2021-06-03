import React from 'react'
import { Field, FieldConfig, FieldConfigs, FieldError, IField } from '../common'
import FormFields from '../'
import { getParamText, getValue, setValue } from '../../../util/value'
import { set } from '../../../util/request'

export interface FormFieldConfig extends FieldConfig {
  type: 'form'
  fields: FieldConfigs[]
  insertText?: string
  removeText?: string
  mode?: "show",
  modeValue?: string
}

export interface IFormField {
  insertText: string
  onInsert: () => Promise<void>
  children: React.ReactNode[]
}

export interface IFormFieldItem {
  index: number
  removeText: String
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
  formDataList: Array<{ [field: string]: { value: any, status: 'normal' | 'error' | 'loading', message?: string } }>
  showItem: boolean
  showIndex: number
}

export default class FormField extends Field<FormFieldConfig, IFormField, Array<any>, FormState> implements IField<Array<any>> {
  state: FormState = {
    formDataList: [],
    showItem: false,
    showIndex: 0
  }

  getFormFields = (type: string) => FormFields[type]

  formItemsList: Array<{ [key: string]: Field<FieldConfigs, {}, any> | null }> = []
  formItemsMounted: Array<boolean> = []

  reset: () => Promise<any[]> = async () => {
    const valueList: Array<{ [field: string]: any }> = []
    const formDataList: Array<{ [field: string]: { value: any, status: 'normal' | 'error' | 'loading', message?: string } }> = []

    const defaults = await this.defaultValue()
    if (defaults !== undefined) {
      for (const item of defaults) {
        const value: { [field: string]: any } = {}
        const formData: { [field: string]: { value: any, status: 'normal' | 'error' | 'loading', message?: string } } = {}
        const {
          config: {
            fields = []
          }
        } = this.props
        for (const field of fields) {
          set(value, field.field, getValue(item, field.field))
          set(formDataList, field.field, { value: getValue(item, field.field), status: 'normal' })
        }
        this.formItemsMounted.push(false)
        valueList.push(value)
        formDataList.push(formData)
      }
    }

    await this.setState({
      formDataList
    })

    return valueList
  }

  validate = async (): Promise<true | FieldError[]> => {
    const {
      config: {
        required,
        fields
      },
      value
    } = this.props

    const errors: FieldError[] = []

    if (required) {
      if (value.length === 0) {
        errors.push(new FieldError('不能为空'))
      }
    }

    let childrenError = 0

    for (const formItemsIndex in this.formItemsList) {
      const formItems = this.formItemsList[formItemsIndex]
      for (const field of fields) {
        const formItem = formItems[field.field]
        if (formItem !== null && formItem !== undefined) {
          const validation = await formItem.validate(value[formItemsIndex][field.field])
          if (validation !== true) {
            childrenError++
          }
        }
      }
    }

    if (childrenError > 0) {
      errors.push(new FieldError(`子项中存在${childrenError}个错误。`))
    }

    return errors.length ? errors : true
  }

  handleMount = async (index: number) => {
    if (this.formItemsMounted[index] || !this.formItemsList[index]) {
      return
    }

    const {
      value,
      config: {
        fields
      },
      onChange
    } = this.props

    const {
      formDataList
    } = this.state

    if (!formDataList[index]) formDataList[index] = {}
    if (!value[index]) value[index] = {}

    for (const field of fields) {
      if (this.formItemsList[index]?.[field.field]) {
        const formItem = this.formItemsList[index][field.field]
        if (formItem) {
          let _value: any
          _value = getValue(value[index], field.field)
          if (_value === undefined) {
            _value = await formItem.reset()
          }
          const validation = await formItem.validate(_value)
          set(value[index], field.field, _value)
          if (validation === true) {
            set(formDataList[index], field.field, { value: _value, status: 'normal' })
          } else {
            set(formDataList[index], field.field, { value: _value, status: 'error', message: validation[0].message })
          }
        }
      }
    }

    this.formItemsMounted[index] = true

    await this.setState({
      formDataList
    })

    onChange(value)
  }

  handleInsert = async () => {
    const {
      onChange,
      value = []
    } = this.props

    const {
      formDataList
    } = this.state

    const index = value.length

    this.formItemsMounted[index] = false
    value[index] = {}
    formDataList[index] = {}
    this.setState({
      showItem: true,
      showIndex: index
    })
    if (onChange) {
      await onChange(value)
    }

    // if (this.formItemsList[index]) {
    //   for (const field of fields) {
    //     if (this.formItemsList[index][field.field]) {
    //       const formItem = this.formItemsList[index][field.field]
    //       if (formItem) {
    //         const _value = await formItem.reset()
    //         const validation = await formItem.validate(_value)

    //         set(value[index], field.field, _value)
    //         if (validation === true) {
    //           set(formDataList[index], field.field, { value: _value, status: 'normal' })
    //         } else {
    //           set(formDataList[index], field.field, { value: _value, status: 'error', message: validation[0].message })
    //         }
    //       }
    //     }
    //   }
    // }

    // this.setState({
    //   formDataList
    // })

    // if (onChange) {
    //   onChange(value)
    // }
  }

  handleRemove = async (index: number) => {
    const {
      onChange,
      value = []
    } = this.props

    const {
      formDataList
    } = this.state

    this.formItemsMounted.splice(index, 1)
    value.splice(index, 1)
    formDataList.splice(index, 1)
    this.formItemsList.splice(index, 1)

    this.setState({
      formDataList,
      showItem: false
    })

    if (onChange) {
      onChange(value)
    }
  }

  showItemFn(index: number) {
    const { showItem, showIndex } = this.state;
    this.setState({
      showItem: index === showIndex ? !showItem : true,
      showIndex: index
    })
  }

  handleChange = async (index: number, field: FieldConfigs, value: any) => {
    const {
      onChange,
      value: _value
    } = this.props

    const {
      formDataList
    } = this.state

    const fieldRef = this.formItemsList[index][field.field]
    if (fieldRef) {
      const validation = await fieldRef.validate(value)
      set(_value[index], field.field, value)
      if (!formDataList[index]) formDataList[index] = {}
      if (validation === true) {
        set(formDataList[index], field.field, { value, status: 'normal' })
      } else {
        set(formDataList[index], field.field, { value, status: 'error', message: validation[0].message })
      }
      this.setState({
        formDataList
      })
      if (onChange) {
        onChange(_value)
      }
    }
  }

  renderItemFieldComponent = (props: IFormFieldItemField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件的renderItemFieldComponent方法。
    </React.Fragment>
  }

  renderItemComponent = (props: IFormFieldItem) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件的renderItemComponent方法。
    </React.Fragment>
  }

  renderComponent = (props: IFormField) => {
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
        mode,
        modeValue,
        fields,
        insertText,
        removeText
      }
    } = this.props

    const {
      formDataList,
      showItem,
      showIndex
    } = this.state

    return (
      <React.Fragment>
        {
          this.renderComponent({
            insertText: insertText === undefined ? `插入 ${label}` : insertText,
            onInsert: async () => await this.handleInsert(),
            children: (
              value && value.map((itemValue: any, index: number) => {
                return <div ref={(e) => this.handleMount(index)} key={index} >

                  {mode === "show" &&
                    <div onClick={() => this.showItemFn(index)} style={{ height: "30px", cursor: "pointer", background: "#f1f1f1", padding: "5px", marginBottom: showItem && index === showIndex ? "10px" : 0 }}>
                      {itemValue.label || (modeValue && itemValue[modeValue]) || (index + 1)}
                      <div style={{ float: "right" }}>
                        <span onClick={() => this.handleRemove(index)} style={{ textDecoration: "underline", color: "#7e93a9" }}>删除</span>
                      </div>
                    </div>
                  }

                  {(showItem && index === showIndex && mode === "show") || mode !== "show" ?
                    this.renderItemComponent({
                      index,
                      removeText: removeText === undefined ? `删除 ${label}` : removeText,
                      onRemove: async () => await this.handleRemove(index),
                      children: (fields.map((formFieldConfig, fieldIndex) => {
                        let display: boolean = true
                        if (formFieldConfig.condition && formFieldConfig.condition.statement) {
                          let statement = formFieldConfig.condition.statement
                          if (formFieldConfig.condition.params && Array.isArray(formFieldConfig.condition.params)) {
                            statement = getParamText(formFieldConfig.condition.statement, formFieldConfig.condition.params, { record: itemValue, data, step })
                          }
                          try {
                            // eslint-disable-next-line no-eval
                            const result = eval(statement)
                            if (!result) {
                              display = false
                            }
                          } catch (e) {
                            console.error('表单项展示条件语句执行错误。', statement)
                            display = false
                          }
                        }

                        const FormField = this.getFormFields(formFieldConfig.type)

                        // 渲染表单项容器
                        return (
                          <div key={fieldIndex} style={{ display: display ? 'block' : 'none' }}>
                            {
                              this.renderItemFieldComponent({
                                index: fieldIndex,
                                label: formFieldConfig.label,
                                status: getValue(formDataList[index], formFieldConfig.field, {}).status || 'normal',
                                message: getValue(formDataList[index], formFieldConfig.field, {}).message,
                                layout: formLayout,
                                fieldType: formFieldConfig.type,
                                children: (
                                  <FormField
                                    ref={(fieldRef: Field<FieldConfigs, any, any> | null) => {
                                      if (!this.formItemsList[index]) this.formItemsList[index] = {}
                                      this.formItemsList[index][formFieldConfig.field] = fieldRef
                                    }}
                                    formLayout={formLayout}
                                    value={getValue(value[index], formFieldConfig.field)}
                                    record={value[index]}
                                    data={data}
                                    step={step}
                                    config={formFieldConfig}
                                    onChange={(value: any) => this.handleChange(index, formFieldConfig, value)}
                                  />
                                )
                              })
                            }
                          </div>
                        )
                      }))
                    }) : null
                  }
                </div>
              }
              )
            )
          })
        }
      </React.Fragment >
    )
  }
}
