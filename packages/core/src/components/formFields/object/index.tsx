import { Field, FieldConfig, FieldConfigs, FieldError, FieldProps, IField } from "../common";
import getALLComponents from '../'
import React from "react";
import ConditionHelper from "../../../util/condition";
import { cloneDeep } from "lodash";
import { getValue, setValue } from "../../../util/value";

export interface ObjectFieldConfig extends FieldConfig {
  type: 'object'
  fields: FieldConfigs[]
  insertText?: string
  removeText?: string
}

export interface IObjectField {
  insertText: string
  onInsert: () => Promise<string>
  children: React.ReactNode[]
}


export interface IObjectFieldItem {
  key: string
  removeText: string
  onChange: (key: string) => Promise<void>
  onRemove: () => Promise<void>
  children: React.ReactNode[]
}

export interface IObjectFieldItemField {
  index: number
  label: string
  status: 'normal' | 'error' | 'loading'
  description?: string
  message?: string
  layout: 'horizontal' | 'vertical' | 'inline'
  visitable: boolean
  fieldType: string
  children: React.ReactNode
}

export interface ObjectFieldState<S> {
  formDataList: { [key: string]: { status: 'normal' | 'error' | 'loading', message?: string }[] }
  extra?: S
}

export default class ObjectField<S> extends Field<ObjectFieldConfig, IObjectField, { [key: string]: any }, ObjectFieldState<S>> implements IField<{ [key: string]: any }> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any): typeof Field => getALLComponents[type]

  formFieldsList: { [key: string]: Array<Field<FieldConfigs, {}, any> | null> } = {}
  formFieldsMountedList: { [key: string]: Array<boolean> } = {}

  constructor (props: FieldProps<ObjectFieldConfig, any>) {
    super(props)

    this.state = {
      formDataList: {}
    }
  }

  get = async () => {
    let data: any = {};

    const keys = Object.keys(this.props.value)
    for (const key of keys) {
      let item: any = {}

      if (Array.isArray(this.props.config.fields)) {
        for (const formFieldIndex in this.props.config.fields) {
          const formFieldConfig = this.props.config.fields[formFieldIndex]
          if (!ConditionHelper(formFieldConfig.condition, { record: this.props.value[key], data: this.props.data, step: this.props.step })) {
            continue
          }
          const formField = this.formFieldsList[key] && this.formFieldsList[key][formFieldIndex]
          if (formField) {
            const value = await formField.get()
            item = setValue(item, formFieldConfig.field, value)
          }
        }
      }

      data[key] = item
    }

    return data
  }

  validate = async (value: { [key: string]: any }): Promise<true | FieldError[]> => {
    const errors: FieldError[] = []

    if (this.props.config.required === true && Object.entries(value).length === 0) {
      errors.push(new FieldError('不能为空'))
    }

    let childrenError = 0

    const formDataList = cloneDeep(this.state.formDataList)

    for (const formItemsKey in this.formFieldsList) {
      if (!formDataList[formItemsKey]) formDataList[formItemsKey] = []
      const formItems = this.formFieldsList[formItemsKey]
      for (const fieldIndex in (this.props.config.fields || [])) {
        const formItem = formItems[fieldIndex]
        if (formItem !== null && formItem !== undefined) {
          const validation = await formItem.validate(getValue(value[formItemsKey], (this.props.config.fields || [])[fieldIndex].field))

          if (validation === true) {
            formDataList[formItemsKey][fieldIndex] = { status: 'normal' }
          } else {
            childrenError++
            formDataList[formItemsKey][fieldIndex] = { status: 'error', message: validation[0].message }
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

  handleMount = async (key: string, formFieldIndex: number) => {
    if (!this.formFieldsMountedList[key]) {
      this.formFieldsMountedList[key] = []
    }
    if (this.formFieldsMountedList[key][formFieldIndex]) {
      return true
    }    
    this.formFieldsMountedList[key][formFieldIndex] = true

    if (this.formFieldsList[key] && this.formFieldsList[key][formFieldIndex]) {
      const formField = this.formFieldsList[key][formFieldIndex]
      if (formField) {
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]

        let value = getValue(this.props.value[key], formFieldConfig.field)
        if ((formFieldConfig.defaultValue) && value === undefined) {
          value = await formField.reset()
          this.props.onValueSet(formFieldConfig.field === '' ? key : `${key}.${formFieldConfig.field}`, value, true)
        }
        
        if (value !== undefined) {
          const validation = await formField.validate(value)
          if (validation === true) {
            await this.setState(({ formDataList }) => {
              if (!formDataList[key]) formDataList[key] = []
              formDataList[key][formFieldIndex] = { status: 'normal' }
              return { formDataList: cloneDeep(formDataList) }
            })
          } else {
            await this.setState(({ formDataList }) => {
              if (!formDataList[key]) formDataList[key] = []
              formDataList[key][formFieldIndex] = { status: 'error', message: validation[0].message }
              return { formDataList: cloneDeep(formDataList) }
            })
          }
        }
      }
    }
  }

  handleInsert = async () => {
    const keys = Object.keys(this.props.value || {})
    let i = 1
    while(keys.includes(`item_${i}`)) {
      i++
    }

    const key = `item_${i}`

    this.formFieldsList[key] = []
    this.formFieldsMountedList[key] = []
    await this.setState(({ formDataList }) => {
      formDataList[key] = []
      return { formDataList: cloneDeep(formDataList) }
    })

    this.props.onValueSet(key, {}, true)

    return key
  }

  handleRemove = async (key: string) => {
    delete this.formFieldsList[key]
    delete this.formFieldsMountedList[key]
    await this.setState(({ formDataList }) => {
      delete formDataList[key]
      return { formDataList: cloneDeep(formDataList) }
    })

    this.props.onValueUnset(key, true)
  }

  handleChangeKey = async (prev: string, next: string) => {
    this.formFieldsList[next] = this.formFieldsList[prev]
    delete this.formFieldsList[prev]
    
    this.formFieldsMountedList[next] = this.formFieldsMountedList[prev]
    delete this.formFieldsMountedList[prev]
    
    await this.setState(({ formDataList }) => {
      formDataList[next] = formDataList[prev]
      delete formDataList[prev]
      return { formDataList: cloneDeep(formDataList) }
    })

    this.props.onValueSet(next, this.props.value[prev], true)
    this.props.onValueUnset(prev, true)
  }

  handleChange = async (key: string, formFieldIndex: number, value: any) => {
    // const formField = this.formFieldsList[key] && this.formFieldsList[key][formFieldIndex]
    // const formFieldConfig = this.props.config.fields[formFieldIndex]
    // if (formField && formFieldConfig) {
    //   if (this.props.onChange) {
    //     if (formFieldConfig.field === '') {
    //       await this.props.onChange({ [key]: value })
    //     } else {
    //       await this.props.onChange({ [key]: setValue({}, formFieldConfig.field, value) })
    //     }
    //   }

    //   const validation = await formField.validate(value)
    //   if (validation === true) {
    //     await this.setState(({ formDataList }) => {
    //       if (!formDataList[key]) formDataList[key] = []
    //       formDataList[key][formFieldIndex] = { value, status: 'normal' }
    //       return { formDataList: cloneDeep(formDataList) }
    //     })
    //   } else {
    //     await this.setState(({ formDataList }) => {
    //       if (!formDataList[key]) formDataList[key] = []
    //       formDataList[key][formFieldIndex] = { value, status: 'error', message: validation[0].message }
    //       return { formDataList: cloneDeep(formDataList) }
    //     })
    //   }
    // }
  }

  handleValueSet = async (key: string, formFieldIndex: number, path: string, value: any, validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
      await this.props.onValueSet(fullPath === '' ? key : `${key}.${fullPath}`, value, true)
      
      const formDataList = cloneDeep(this.state.formDataList)
      if (validation === true) {
        formDataList[key][formFieldIndex] = { status: 'normal' }
      } else {
        formDataList[key][formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formDataList
      })
    }
  }

  handleValueUnset = async (key: string, formFieldIndex: number, path: string, validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
      await this.props.onValueUnset(fullPath === '' ? key : `${key}.${fullPath}`, true)
      
      const formDataList = cloneDeep(this.state.formDataList)
      if (validation === true) {
        formDataList[key][formFieldIndex] = { status: 'normal' }
      } else {
        formDataList[key][formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formDataList
      })
    }
  }

  handleValueListAppend = async (key: string, formFieldIndex: number, path: string, value: any, validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
      await this.props.onValueListAppend(fullPath === '' ? key : `${key}.${fullPath}`, value, true)
      
      const formDataList = cloneDeep(this.state.formDataList)
      if (validation === true) {
        formDataList[key][formFieldIndex] = { status: 'normal' }
      } else {
        formDataList[key][formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formDataList
      })
    }
  }

  handleValueListSplice = async (key: string, formFieldIndex: number, path: string, _index: number, count: number, validation: true | FieldError[]) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
      await this.props.onValueListSplice(fullPath === '' ? key : `${key}.${fullPath}`, _index, count, true)
      
      const formDataList = cloneDeep(this.state.formDataList)
      if (validation === true) {
        formDataList[key][formFieldIndex] = { status: 'normal' }
      } else {
        formDataList[key][formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formDataList
      })
    }
  }

  /**
   * 用于展示子表单组件
   * @param _props 
   * @returns 
   */
  renderComponent = (_props: IObjectField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件。
    </React.Fragment>
  }

  /**
   * 用于展示子表单组件中的每一个子项
   * @param props 
   * @returns 
   */
   renderItemComponent = (props: IObjectFieldItem) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件的renderItemComponent方法。
    </React.Fragment>
  }

  /**
   * 用于展示子表单组件中的每一子项中的每一个子表单项组件
   * @param props 
   * @returns 
   */
   renderItemFieldComponent = (props: IObjectFieldItemField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件的renderItemFieldComponent方法。
    </React.Fragment>
  }

  render = () => {
    const {
      value = {},
      config: {
        label,
        fields,
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
              this.props.value && Object.keys(this.props.value).map((key: string) => {
                return (
                  <React.Fragment key={key}>
                    {this.renderItemComponent({
                      key,
                      removeText: removeText === undefined ? `删除 ${label}` : removeText,
                      onChange: async (value) => await this.handleChangeKey(key, value),
                      onRemove: async () => await this.handleRemove(key),
                      children: (Array.isArray(this.props.config.fields) ? this.props.config.fields : []).map((formFieldConfig, formFieldIndex) => {
                        if (!ConditionHelper(formFieldConfig.condition, { record: this.props.record, data: this.props.data, step: this.props.step })) {
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
  
                        // 渲染表单项容器
                        if (hidden) {
                          return (
                              this.renderItemFieldComponent({
                                index: formFieldIndex,
                                label: formFieldConfig.label,
                                status: ((this.state.formDataList[key] || [])[formFieldIndex] || {}).status || 'normal',
                                message: ((this.state.formDataList[key] || [])[formFieldIndex] || {}).message || '',
                                layout: this.props.formLayout,
                                visitable: display,
                                fieldType: formFieldConfig.type,
                                children: (
                                  <FormField
                                    key={formFieldIndex}
                                    ref={(formField: Field<FieldConfigs, any, any> | null) => {
                                      if (!this.formFieldsList[key]) this.formFieldsList[key] = []
                                      this.formFieldsList[key][formFieldIndex] = formField
                                      this.handleMount(key, formFieldIndex)
                                    }}
                                    formLayout={this.props.formLayout}
                                    value={getValue(value[key], formFieldConfig.field)}
                                    record={value[key]}
                                    data={cloneDeep(this.props.data)}
                                    step={this.props.step}
                                    config={formFieldConfig}
                                    onChange={(value: any) => this.handleChange(key, formFieldIndex, value)}
                                    onValueSet={async (path, value, validation) => this.handleValueSet(key, formFieldIndex, path, value, validation)}
                                    onValueUnset={async (path, validation) => this.handleValueUnset(key, formFieldIndex, path, validation)}
                                    onValueListAppend={async (path, value, validation) => this.handleValueListAppend(key, formFieldIndex, path, value, validation)}
                                    onValueListSplice={async (path, _index, count, validation) => this.handleValueListSplice(key, formFieldIndex, path, _index, count, validation)}
                                    loadDomain={async (domain: string) => this.props.loadDomain(domain)}
                                  />
                                )
                              })
                          )
                        } else {
                          return <React.Fragment key={formFieldIndex} />
                        }
                      })
                    })}
                  </React.Fragment>
                )
              })
            )
          })
        }
      </React.Fragment>
    )
  }
}