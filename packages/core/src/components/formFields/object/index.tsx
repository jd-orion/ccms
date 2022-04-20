import { Field, FieldConfig, FieldConfigs, FieldError, FieldProps, IField } from '../common'
import getALLComponents from '../'
import React from 'react'
import ConditionHelper from '../../../util/condition'
// import { cloneDeep } from 'lodash'
import { set, setValue } from '../../../util/produce'
import { getValue, getBoolean, getChainPath, updateCommonPrefixItem } from '../../../util/value'
import StatementHelper from '../../../util/statement'

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
  extra?: string
  required: boolean
  layout: 'horizontal' | 'vertical' | 'inline'
  visitable: boolean
  fieldType: string
  children: React.ReactNode
}

export interface ObjectFieldState<S> {
  didMount: boolean
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
      didMount: false,
      formDataList: {}
    }
  }

  didMount = async () => {
    await this.setState({
      didMount: true
    })
  }

  get = async () => {
    const data: any = {}

    const keys = Object.keys(this.props.value)
    for (const key of keys) {
      let item: any = {}

      if (Array.isArray(this.props.config.fields)) {
        for (const formFieldIndex in this.props.config.fields) {
          const formFieldConfig = this.props.config.fields[formFieldIndex]
          if (!ConditionHelper(formFieldConfig.condition, { record: this.props.value[key], data: this.props.data, step: this.props.step }, this)) {
            continue
          }
          const formField = this.formFieldsList[key] && this.formFieldsList[key][formFieldIndex]
          if (formField && !formFieldConfig.disabled) {
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

    let formDataList = this.state.formDataList

    for (const formItemsKey in this.formFieldsList) {
      if (!formDataList[formItemsKey]) formDataList = set(formDataList, `[${formItemsKey}]`, [])
      const formItems = this.formFieldsList[formItemsKey]
      for (const fieldIndex in (this.props.config.fields || [])) {
        const formItem = formItems[fieldIndex]
        if (formItem !== null && formItem !== undefined && !formItem.props.config.disabled) {
          const validation = await formItem.validate(getValue(value[formItemsKey], (this.props.config.fields || [])[fieldIndex].field))

          if (validation === true) {
            formDataList = set(formDataList, `[${formItemsKey}][${fieldIndex}]`, { status: 'normal' })
          } else {
            childrenError++
            formDataList = set(formDataList, `[${formItemsKey}][${fieldIndex}]`, { status: 'error', message: validation[0].message })
          }
        }
      }
    }

    await this.setState({
      formDataList
    })

    if (childrenError > 0) {
      errors.push(new FieldError('子项中存在错误。'))
    }

    return errors.length ? errors : true
  }

  handleMount = async (key: string, formFieldIndex: number) => {
    if (!this.formFieldsMountedList[key]) {
      this.formFieldsMountedList = set(this.formFieldsMountedList, `[${key}]`, [])
    }
    if (this.formFieldsMountedList[key][formFieldIndex]) {
      return true
    }
    this.formFieldsMountedList = set(this.formFieldsMountedList, `[${key}][${formFieldIndex}]`, true)

    if (this.formFieldsList[key] && this.formFieldsList[key][formFieldIndex]) {
      const formField = this.formFieldsList[key][formFieldIndex]
      if (formField) {
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
        
        let value = getValue(this.props.value[key], formFieldConfig.field)
        const source = value
        if ((formFieldConfig.defaultValue) && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.props.onValueSet(formFieldConfig.field === '' ? key : `${key}.${formFieldConfig.field}`, value, true)
        }

        if (value !== undefined) {
          const validation = await formField.validate(value)
          if (validation === true) {
            await this.setState(({ formDataList }) => {
              if (!formDataList[key]) formDataList = set(formDataList, `[${key}]`, [])
              formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'normal' })
              return { formDataList: formDataList }
            })
          } else {
            await this.setState(({ formDataList }) => {
              if (!formDataList[key]) formDataList = set(formDataList, `[${key}]`, [])
              formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'error', message: validation[0].message })
              return { formDataList: formDataList }
            })
          }
        }
        await formField.didMount()
      }
    }
  }

  handleInsert = async () => {
    const keys = Object.keys(this.props.value || {})
    let i = 1
    while (keys.includes(`item_${i}`)) {
      i++
    }

    const key = `item_${i}`

    this.formFieldsList = set(this.formFieldsList, `${key}`, [])
    this.formFieldsMountedList = set(this.formFieldsMountedList, `${key}`, [])
    await this.setState(({ formDataList }) => {
      formDataList[key] = []
      return { formDataList: formDataList }
    })

    this.props.onValueSet(key, {}, true)

    return key
  }

  handleRemove = async (key: string) => {
    this.formFieldsList = set(this.formFieldsList, `${this.formFieldsList[key]}`)
    this.formFieldsMountedList = set(this.formFieldsMountedList, `${this.formFieldsMountedList[key]}`)
    await this.setState(({ formDataList }) => {
      formDataList = set(formDataList, `${formDataList[key]}`)
      return { formDataList: formDataList }
    })

    this.props.onValueUnset(key, true)
  }

  handleChangeKey = async (prev: string, next: string) => {
    this.formFieldsList = set(this.formFieldsList, `[${next}]`, this.formFieldsList[prev])
    this.formFieldsList = set(this.formFieldsList, `${this.formFieldsList[prev]}`)

    this.formFieldsMountedList = set(this.formFieldsMountedList, `[${next}]`, this.formFieldsMountedList[prev])
    this.formFieldsMountedList = set(this.formFieldsMountedList, `${this.formFieldsMountedList[prev]}`)

    await this.setState(({ formDataList }) => {
      formDataList = set(formDataList, `[${next}]`, formDataList[prev])
      formDataList = set(formDataList, `${formDataList[prev]}`)
      return { formDataList: formDataList }
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

    //   let validation = await formField.validate(value)
    //   if (validation === true) {
    //     await this.setState(({ formDataList }) => {
    //       if (!formDataList[key]) formDataList = set(formDataList, `[${key}]`, [])
    //       formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'normal' })
    //       return { formDataList: cloneDeep(formDataList) }
    //     })
    //   } else {
    //     await this.setState(({ formDataList }) => {
    //       if (!formDataList[key]) formDataList = set(formDataList, `[${key}]`, [])
    //       formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'error', message: validation[0].message })
    //       return { formDataList: cloneDeep(formDataList) }
    //     })
    //   }
    // }
  }

  handleValueSet = async (key: string, formFieldIndex: number, path: string, value: any, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueSet(fullPath === '' ? key : `${key}.${fullPath}`, value, true)

      let formDataList = this.state.formDataList
      if (validation === true) {
        formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'normal' })
      } else {
        formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'error', message: validation[0].message })
      }

      this.setState({
        formDataList
      })
    }
  }

  handleValueUnset = async (key: string, formFieldIndex: number, path: string, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueUnset(fullPath === '' ? key : `${key}.${fullPath}`, true)

      let formDataList = this.state.formDataList
      if (validation === true) {
        formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'normal' })
      } else {
        formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'error', message: validation[0].message })
      }

      this.setState({
        formDataList
      })
    }
  }

  handleValueListAppend = async (key: string, formFieldIndex: number, path: string, value: any, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueListAppend(fullPath === '' ? key : `${key}.${fullPath}`, value, true)

      let formDataList = this.state.formDataList
      if (validation === true) {
        formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'normal' })
      } else {
        formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'error', message: validation[0].message })
      }

      this.setState({
        formDataList
      })
    }
  }

  handleValueListSplice = async (key: string, formFieldIndex: number, path: string, _index: number, count: number, validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueListSplice(fullPath === '' ? key : `${key}.${fullPath}`, _index, count, true)

      let formDataList = this.state.formDataList
      if (validation === true) {
        formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'normal' })
      } else {
        formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'error', message: validation[0].message })
      }

      this.setState({
        formDataList
      })
    }
  }

  handleValueListSort = async (key: string, formFieldIndex: number, path: string, _index: number, sortType: 'up' | 'down', validation: true | FieldError[], options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = options && options.noPathCombination ? path : (formFieldConfig.field === '' || path === '' ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`)
      await this.props.onValueListSort(fullPath === '' ? key : `${key}.${fullPath}`, _index, sortType, true)

      let formDataList = this.state.formDataList
      if (validation === true) {
        formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'normal' })
      } else {
        formDataList = set(formDataList, `[${key}][${formFieldIndex}]`, { status: 'error', message: validation[0].message })
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
              this.state.didMount
                ? this.props.value && Object.keys(this.props.value).map((key: string) => {
                  return (
                    <React.Fragment key={key}>
                      {this.renderItemComponent({
                        key,
                        removeText: removeText === undefined ? `删除 ${label}` : removeText,
                        onChange: async (value) => await this.handleChangeKey(key, value),
                        onRemove: async () => await this.handleRemove(key),
                        children: (Array.isArray(this.props.config.fields) ? this.props.config.fields : []).map((formFieldConfig, formFieldIndex) => {
                          if (!ConditionHelper(formFieldConfig.condition, { record: this.props.record, data: this.props.data, step: this.props.step }, this)) {
                            if (!this.formFieldsMountedList[key]) this.formFieldsMountedList = set(this.formFieldsMountedList, `[${key}]`, [])
                            this.formFieldsMountedList = set(this.formFieldsMountedList, `[${key}][${formFieldIndex}]`, false)
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

                          let status = ((this.state.formDataList[key] || [])[formFieldIndex] || {}).status || 'normal'

                          if (['group', 'import_subform', 'object', 'tabs', 'form'].some((type) => type === formFieldConfig.type)) {
                            status = 'normal'
                          }

                          // 渲染表单项容器
                          if (hidden) {
                            return (
                              this.renderItemFieldComponent({
                                index: formFieldIndex,
                                label: formFieldConfig.label,
                                status,
                                message: ((this.state.formDataList[key] || [])[formFieldIndex] || {}).message || '',
                                extra: StatementHelper(formFieldConfig.extra, { record: this.props.record, data: this.props.data, step: this.props.step }),
                                required: getBoolean(formFieldConfig.required),
                                layout: this.props.formLayout,
                                visitable: display,
                                fieldType: formFieldConfig.type,
                                children: (
                                    <FormField
                                      key={formFieldIndex}
                                      ref={(formField: Field<FieldConfigs, any, any> | null) => {
                                        if (formField) {
                                          if (!this.formFieldsList[key]) this.formFieldsList = set(this.formFieldsList, `[${key}]`, [])
                                          this.formFieldsList = set(this.formFieldsList, `[${key}][${formFieldIndex}]`, formField)
                                          this.handleMount(key, formFieldIndex)
                                        }
                                      }}
                                      formLayout={this.props.formLayout}
                                      form={this.props.form}
                                      value={getValue(value[key], formFieldConfig.field)}
                                      record={value[key]}
                                      data={this.props.data}
                                      step={this.props.step}
                                      config={formFieldConfig}
                                      onChange={(value: any) => this.handleChange(key, formFieldIndex, value)}
                                      onValueSet={async (path, value, validation, options) => this.handleValueSet(key, formFieldIndex, path, value, validation, options)}
                                      onValueUnset={async (path, validation, options) => this.handleValueUnset(key, formFieldIndex, path, validation, options)}
                                      onValueListAppend={async (path, value, validation, options) => this.handleValueListAppend(key, formFieldIndex, path, value, validation, options)}
                                      onValueListSplice={async (path, _index, count, validation, options) => this.handleValueListSplice(key, formFieldIndex, path, _index, count, validation, options)}
                                      onValueListSort={async (path, _index, sortType, validation, options) => this.handleValueListSort(key, formFieldIndex, path, _index, sortType, validation, options)}
                                      baseRoute={this.props.baseRoute}
                                      loadDomain={async (domain: string) => this.props.loadDomain(domain)}
                                      containerPath={getChainPath(this.props.containerPath, this.props.config.field, key)}
                                      onReportFields={async (field: string) => await this.handleReportFields(field)}
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
                : []
            )
          })
        }
      </React.Fragment>
    )
  }
}
