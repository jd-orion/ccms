import React from 'react'
import { setValue, getValue, getBoolean } from '../../../util/value'

import { Field, FieldConfig, FieldError, FieldProps, IField } from '../common'
import getALLComponents, { FieldConfigs } from '../'
import { IFormItem } from '../../../steps/form'
import { cloneDeep } from 'lodash'
import ConditionHelper from '../../../util/condition'
import InterfaceHelper, { InterfaceConfig } from '../../../util/interface'

/**
 * 子表单配置项
 * - withConfig: 拓展配置
 * - * - enable: 是否开启
 * - * - dataField: （序列化）数据
 * - * - configField: （序列化）配置
 */
export interface ImportSubformFieldConfig extends FieldConfig {
  type: 'import_subform',
  interface?: InterfaceConfig
  withConfig?: {
    enable: boolean
    dataField: string
    configField: string
  }
}

export interface IImportSubformField {
  children: React.ReactNode[]
}

interface IImportSubformFieldState {
  didMount: boolean
  fields: FieldConfigs[]
  formData: { status: 'normal' | 'error' | 'loading', message?: string }[]
}

export default class ImportSubformField extends Field<ImportSubformFieldConfig, IImportSubformField, any, IImportSubformFieldState> implements IField<string> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any): typeof Field => getALLComponents[type]

  // 用于请求防频的判断条件
  requestConfig: string = ''
  value: string = ''

  formFields: Array<Field<FieldConfigs, {}, any> | null> = []
  formFieldsMounted: Array<boolean> = []

  interfaceHelper = new InterfaceHelper()

  constructor (props: FieldProps<ImportSubformFieldConfig, any>) {
    super(props)

    this.state = {
      didMount: false,
      fields: [],
      formData: []
    }
  }

  getFullpath (field: string, path: string = '') {
    const withConfigPath = this.props.config.withConfig?.enable && this.props.config.withConfig?.dataField ? `${this.props.config.withConfig.dataField}` : ''
    const _fullPath = `${withConfigPath}.${field}.${path}.`
    const fullPath = _fullPath.replace(/(^\.*)|(\.*$)|(\.){2,}/g, '$3')
    return fullPath
  }

  didMount = async () => {
    await this.setState({
      didMount: true
    })
  }

  get = async () => {
    let data: any = {}

    if (Array.isArray(this.state.fields)) {
      for (const formFieldIndex in this.state.fields) {
        const formFieldConfig = this.state.fields[formFieldIndex]
        if (!ConditionHelper(formFieldConfig.condition, { record: this.props.value, data: this.props.data, step: this.props.step })) {
          continue
        }
        const formField = this.formFields[formFieldIndex]
        if (formField) {
          const value = await formField.get()
          data = setValue(data, this.getFullpath(formFieldConfig.field), value)
        }
      }
    }

    if (this.props.config.withConfig?.enable && this.props.config.withConfig?.dataField && this.props.config.withConfig?.configField) {
      const { configField } = this.props.config.withConfig
      return {
        ...data,
        [configField]: this.state.fields
      }
    }
    return data
  }

  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()

    if (defaults === undefined) {
      return {}
    } else {
      return defaults
    }
  }

  validate = async (value: any): Promise<true | FieldError[]> => {
    const errors: FieldError[] = []

    let childrenError = 0

    const formData = cloneDeep(this.state.formData)

    for (const fieldIndex in (this.state.fields || [])) {
      const formItem = this.formFields[fieldIndex]
      if (formItem !== null && formItem !== undefined) {
        const validation = await formItem.validate(getValue(value, this.getFullpath((this.state.fields || [])[fieldIndex].field)))

        if (validation === true || this.formFieldsMounted[fieldIndex] === false) {
          formData[fieldIndex] = { status: 'normal' }
        } else {
          childrenError++
          formData[fieldIndex] = { status: 'error', message: validation[0].message }
        }
      }
    }

    await this.setState({
      formData
    })

    if (childrenError > 0) {
      errors.push(new FieldError('子项中存在错误'))
    }

    return errors.length ? errors : true
  }

  handleMount = async (formFieldIndex: number) => {
    if (this.formFieldsMounted[formFieldIndex]) {
      return true
    }

    this.formFieldsMounted[formFieldIndex] = true

    if (this.formFields[formFieldIndex]) {
      const formField = this.formFields[formFieldIndex]
      if (formField) {
        const formFieldConfig = this.state.fields[formFieldIndex]

        let value = getValue(this.props.value, this.getFullpath(formFieldConfig.field))
        const source = value
        if ((formFieldConfig.defaultValue) && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.props.onValueSet(this.getFullpath(formFieldConfig.field), value, true)
        }

        if (value !== undefined) {
          const validation = await formField.validate(value)
          if (validation === true) {
            await this.setState(({ formData }) => {
              formData[formFieldIndex] = { status: 'normal' }
              return { formData: cloneDeep(formData) }
            })
          } else {
            await this.setState(({ formData }) => {
              formData[formFieldIndex] = { status: 'error', message: validation[0].message }
              return { formData: cloneDeep(formData) }
            })
          }
        }
        await formField.didMount()
      }
    }
  }

  handleChange = async (formFieldIndex: number, value: any) => {
    // const formField = this.formFields[formFieldIndex]
    // const formFieldConfig = this.state.fields[formFieldIndex]

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

  handleValueSet = async (formFieldIndex: number, path: string, value: any, validation: true | FieldError[]) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.getFullpath(formFieldConfig.field, path)
      await this.props.onValueSet(fullPath, value, true)

      const formData = cloneDeep(this.state.formData)
      if (validation === true) {
        formData[formFieldIndex] = { status: 'normal' }
      } else {
        formData[formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formData
      })
    }
  }

  handleValueUnset = async (formFieldIndex: number, path: string, validation: true | FieldError[]) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.getFullpath(formFieldConfig.field, path)
      await this.props.onValueUnset(fullPath, true)

      const formData = cloneDeep(this.state.formData)
      if (validation === true) {
        formData[formFieldIndex] = { status: 'normal' }
      } else {
        formData[formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formData
      })
    }
  }

  handleValueListAppend = async (formFieldIndex: number, path: string, value: any, validation: true | FieldError[]) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.getFullpath(formFieldConfig.field, path)
      await this.props.onValueListAppend(fullPath, value, true)

      const formData = cloneDeep(this.state.formData)
      if (validation === true) {
        formData[formFieldIndex] = { status: 'normal' }
      } else {
        formData[formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formData
      })
    }
  }

  handleValueListSplice = async (formFieldIndex: number, path: string, index: number, count: number, validation: true | FieldError[]) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.getFullpath(formFieldConfig.field, path)
      await this.props.onValueListSplice(fullPath, index, count, true)

      const formData = cloneDeep(this.state.formData)
      if (validation === true) {
        formData[formFieldIndex] = { status: 'normal' }
      } else {
        formData[formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formData
      })
    }
  }

  handleValueListSort = async (formFieldIndex: number, path: string, index: number, sortType: 'up' | 'down', validation: true | FieldError[]) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.getFullpath(formFieldConfig.field, path)
      await this.props.onValueListSort(fullPath, index, sortType, true)

      const formData = cloneDeep(this.state.formData)
      if (validation === true) {
        formData[formFieldIndex] = { status: 'normal' }
      } else {
        formData[formFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        formData
      })
    }
  }

  renderComponent = (props: IImportSubformField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现ImportSubformField组件。
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
      record,
      data,
      step
    } = this.props

    if (config.interface) {
      this.interfaceHelper.request(
        config.interface,
        {},
        { record: this.props.record, data: this.props.data, step: this.props.step },
        { loadDomain: this.props.loadDomain }
      ).then((data: any) => {
        let dataToUnstringfy = data
        let dataToStringfy = JSON.stringify(data)
        if (Object.prototype.toString.call(data) === '[object String]') {
          try {
            dataToStringfy = data
            dataToUnstringfy = JSON.parse(data)
          } catch (e) {
            console.error('当前动态子表单接口响应数据格式不是合格的json字符串')
            dataToUnstringfy = []
            dataToStringfy = '[]'
          }
        }
        (this.props.config.withConfig?.enable && this.props.config.withConfig?.configField) && this.props.onValueSet(this.props.config.withConfig.configField, data, true)
        if (dataToStringfy !== JSON.stringify(this.state.fields)) {
          this.setState({
            fields: dataToUnstringfy
          })
        }
      })
    }

    if (!this.state.fields || this.state.fields.length === 0) {
      return <React.Fragment />
    } else {
      return (
        <React.Fragment>
          {this.renderComponent({
            children: this.state.didMount ? (Array.isArray(this.state.fields) ? this.state.fields : []).map((formFieldConfig, formFieldIndex) => {
              if (!ConditionHelper(formFieldConfig.condition, { record: value, data, step })) {
                this.formFieldsMounted[formFieldIndex] = false
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
                status,
                message: (this.state.formData[formFieldIndex] || {}).message || '',
                extra: (formFieldConfig as any).extra || null,
                required: getBoolean(formFieldConfig.required),
                layout: formLayout,
                visitable: display,
                fieldType: formFieldConfig.type,
                children: (
                    <FormField
                      key={formFieldIndex}
                      ref={(formField: Field<FieldConfigs, any, any> | null) => {
                        if (formField) {
                          this.formFields[formFieldIndex] = formField
                          this.handleMount(formFieldIndex)
                        }
                      }}
                      form={this.props.form}
                      formLayout={formLayout}
                      value={getValue(value, this.getFullpath(formFieldConfig.field))}
                      record={record}
                      data={cloneDeep(data)}
                      step={step}
                      config={formFieldConfig}
                      onChange={async (value: any) => { await this.handleChange(formFieldIndex, value) }}
                      onValueSet={async (path, value, validation) => this.handleValueSet(formFieldIndex, path, value, validation)}
                      onValueUnset={async (path, validation) => this.handleValueUnset(formFieldIndex, path, validation)}
                      onValueListAppend={async (path, value, validation) => this.handleValueListAppend(formFieldIndex, path, value, validation)}
                      onValueListSplice={async (path, index, count, validation) => this.handleValueListSplice(formFieldIndex, path, index, count, validation)}
                      onValueListSort={async (path, index, sortType, validation) => this.handleValueListSort(formFieldIndex, path, index, sortType, validation)}
                      baseRoute={this.props.baseRoute}
                      loadDomain={async (domain: string) => await this.props.loadDomain(domain)}
                    />
                )
              }
              // 渲染表单项容器
              return (
                hidden
                  ? this.renderItemComponent(renderData)
                  : <React.Fragment key={formFieldIndex} />
              )
            }) : []
          })}
        </React.Fragment>
      )
    }
  }
}
