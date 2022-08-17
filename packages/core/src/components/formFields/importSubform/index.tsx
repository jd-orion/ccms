import React from 'react'
import { isEqual } from 'lodash'
import { getValue, getBoolean, getChainPath } from '../../../util/value'

import { Field, FieldConfig, FieldError, FieldProps, IField } from '../common'
import getALLComponents, { FieldConfigs } from '..'
import { IFormItem } from '../../../steps/form'
import { set, setValue } from '../../../util/produce'
import ConditionHelper from '../../../util/condition'
import InterfaceHelper, { InterfaceConfig } from '../../../util/interface'
import StatementHelper from '../../../util/statement'
import { ColumnsConfig } from '../../../interface'

/**
 * 子表单配置项
 * - configFrom: 配置来源(get用途)
 * - * - type: 'data' | 'interface' // 来源类型
 * - * - dataField: 值来源字段 // 仅type为data时生效
 * - * - configField: 配置项来源字段 // 仅type为data时生效
 * - * - interface: 来源接口配置 // 仅type为interface时生效
 * - withConfig: 拓展配置(set用途)
 * - * - enable: 是否开启
 * - * - dataField: （序列化）数据
 * - * - configField: （序列化）配置
 */
export interface ImportSubformFieldConfig extends FieldConfig {
  type: 'import_subform'
  interface?: InterfaceConfig
  configFrom?: ImportSubformConfigFromData | ImportSubformConfigFromInterface
  withConfig?: {
    enable: boolean
    dataField: string
    configField: string
  }
  childColumns?: ColumnsConfig
}
interface ImportSubformConfigFromData {
  type: 'data'
  dataField?: string
  configField?: string
}

interface ImportSubformConfigFromInterface {
  type: 'interface'
  interface?: InterfaceConfig
}
export interface IImportSubformField {
  columns?: ColumnsConfig
  children: React.ReactNode[]
}

interface IImportSubformFieldState {
  didMount: boolean
  fields: FieldConfigs[]
  formData: { status: 'normal' | 'error' | 'loading'; message?: string }[]
}

export default class ImportSubformField
  extends Field<ImportSubformFieldConfig, IImportSubformField, { [key: string]: unknown }, IImportSubformFieldState>
  implements IField<{ [key: string]: unknown }>
{
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: string): typeof Field => getALLComponents[type]

  // 用于请求防频的判断条件
  requestConfig = ''

  value = ''

  formFields: Array<Field<FieldConfigs, unknown, unknown> | null> = []

  formFieldsMounted: Array<boolean> = []

  interfaceHelper = new InterfaceHelper()

  constructor(props: FieldProps<ImportSubformFieldConfig, { [key: string]: unknown }>) {
    super(props)

    this.state = {
      didMount: false,
      fields: [],
      formData: []
    }
  }

  didMount = async () => {
    await this.setState({
      didMount: true
    })
  }

  get = async () => {
    let data: { [key: string]: unknown } = {}

    if (Array.isArray(this.state.fields)) {
      for (let formFieldIndex = 0; formFieldIndex < this.state.fields.length; formFieldIndex++) {
        const formFieldConfig = this.state.fields[formFieldIndex]
        if (
          !ConditionHelper(
            formFieldConfig.condition,
            {
              record: this.props.value,
              data: this.props.data,
              step: this.props.step,
              containerPath: this.props.containerPath,
              extraContainerPath: this.props.config.field
            },
            this
          )
        ) {
          continue
        }
        const formField = this.formFields[formFieldIndex]
        if (formField && !formFieldConfig.disabled) {
          const withConfigPath =
            this.props.config.withConfig?.enable && this.props.config.withConfig?.dataField
              ? `${this.props.config.withConfig.dataField}`
              : ''
          const value = await formField.get()
          data = setValue(data, getChainPath(withConfigPath, formFieldConfig.field), value)
        }
      }
    }

    if (
      this.props.config.withConfig?.enable &&
      this.props.config.withConfig?.dataField &&
      this.props.config.withConfig?.configField
    ) {
      const { configField } = this.props.config.withConfig
      return {
        ...data,
        [configField]: this.state.fields
      }
    }
    return data
  }

  reset: () => Promise<{ [key: string]: unknown }> = async () => {
    const defaults = await this.defaultValue()

    if (defaults === undefined) {
      return {}
    }
    return defaults
  }

  validate = async (value: unknown): Promise<true | FieldError[]> => {
    const errors: FieldError[] = []

    let childrenError = 0
    const childrenErrorMsg: Array<{ name: string; msg: string }> = []

    let { formData } = this.state

    for (let fieldIndex = 0; fieldIndex < (this.state.fields || []).length; fieldIndex++) {
      const formItem = this.formFields[fieldIndex]
      const formConfig = this.state.fields?.[fieldIndex]
      if (formItem !== null && formItem !== undefined) {
        const withConfigPath =
          this.props.config.withConfig?.enable && this.props.config.withConfig?.dataField
            ? `${this.props.config.withConfig.dataField}`
            : ''
        const validation = await formItem.validate(
          getValue(value, getChainPath(withConfigPath, (this.state.fields || [])[fieldIndex].field))
        )

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
      const errTips = `${this.props.config.label || ''}${childrenErrorMsg.map((err) => `${err.msg}`).join('; ')}`
      errors.push(new FieldError(errTips))
    }

    return errors.length ? errors : true
  }

  handleMount = async (formFieldIndex: number) => {
    if (this.formFieldsMounted[formFieldIndex]) {
      return true
    }

    this.formFieldsMounted = set(this.formFieldsMounted, `[${formFieldIndex}]`, true)

    if (this.formFields[formFieldIndex]) {
      const formField = this.formFields[formFieldIndex]
      if (formField) {
        const withConfigPath =
          this.props.config.withConfig?.enable && this.props.config.withConfig?.dataField
            ? `${this.props.config.withConfig.dataField}`
            : ''
        const formFieldConfig = this.state.fields[formFieldIndex]

        let value = getValue(this.props.value, getChainPath(withConfigPath, formFieldConfig.field))
        const source = value
        if (formFieldConfig.defaultValue && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.props.onValueSet(getChainPath(withConfigPath, formFieldConfig.field), value, true)
        }

        if (value !== undefined) {
          const validation = await formField.validate(value)
          this.handleValueCallback(formFieldIndex, validation)
        }
        await formField.didMount()
      }
    }
  }

  handleChange: (formFieldIndex: number, value: unknown) => Promise<void> = async () => {
    /* 无逻辑 */
  }

  /**
   * 处理set、unset、append、splice、sort后的操作
   */
  handleValueCallback = async (formFieldIndex: number, validation: true | FieldError[]) => {
    let { formData } = this.state
    if (validation === true) {
      formData = set(formData, `[${formFieldIndex}]`, { status: 'normal' })
    } else {
      formData = set(formData, `[${formFieldIndex}]`, { status: 'error', message: validation[0].message })
    }
    await this.setState({
      formData
    })
  }

  handleValueSet = async (
    formFieldIndex: number,
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const withConfigPath =
        this.props.config.withConfig?.enable && this.props.config.withConfig?.dataField
          ? `${this.props.config.withConfig.dataField}`
          : ''
      const fullPath =
        options && options.noPathCombination ? path : getChainPath(withConfigPath, formFieldConfig.field, path)
      await this.props.onValueSet(fullPath, value, true)

      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  handleValueUnset = async (
    formFieldIndex: number,
    path: string,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const withConfigPath =
        this.props.config.withConfig?.enable && this.props.config.withConfig?.dataField
          ? `${this.props.config.withConfig.dataField}`
          : ''
      const fullPath =
        options && options.noPathCombination ? path : getChainPath(withConfigPath, formFieldConfig.field, path)
      await this.props.onValueUnset(fullPath, true)

      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  handleValueListAppend = async (
    formFieldIndex: number,
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const withConfigPath =
        this.props.config.withConfig?.enable && this.props.config.withConfig?.dataField
          ? `${this.props.config.withConfig.dataField}`
          : ''
      const fullPath =
        options && options.noPathCombination ? path : getChainPath(withConfigPath, formFieldConfig.field, path)
      await this.props.onValueListAppend(fullPath, value, true)

      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  handleValueListSplice = async (
    formFieldIndex: number,
    path: string,
    index: number,
    count: number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const withConfigPath =
        this.props.config.withConfig?.enable && this.props.config.withConfig?.dataField
          ? `${this.props.config.withConfig.dataField}`
          : ''
      const fullPath =
        options && options.noPathCombination ? path : getChainPath(withConfigPath, formFieldConfig.field, path)
      await this.props.onValueListSplice(fullPath, index, count, true)

      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  handleValueListSort = async (
    formFieldIndex: number,
    path: string,
    index: number,
    sortType: 'up' | 'down' | 'top' | 'bottom' | number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const withConfigPath =
        this.props.config.withConfig?.enable && this.props.config.withConfig?.dataField
          ? `${this.props.config.withConfig.dataField}`
          : ''
      const fullPath =
        options && options.noPathCombination ? path : getChainPath(withConfigPath, formFieldConfig.field, path)
      await this.props.onValueListSort(fullPath, index, sortType, true)

      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  /**
   * 处理data 兼容非法json的情况
   * @param  {any} data 待处理数据
   * @returns 返回data反序列化形式
   */
  handleDataToUnstringfy = (data: FieldConfigs[] | string) => {
    let dataToUnstringfy: FieldConfigs[] = []
    if (typeof data === 'string') {
      try {
        dataToUnstringfy = JSON.parse(data)
      } catch (e) {
        dataToUnstringfy = []
      }
    } else {
      dataToUnstringfy = data
    }
    return dataToUnstringfy
  }

  renderComponent: (props: IImportSubformField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现ImportSubformField组件。</>
  }

  /**
   * 表单项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderItemComponent: (props: IFormItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormItem组件。</>
  }

  getConfigData = () => {
    const { config, value } = this.props
    let { fields } = this.state
    let interfaceConfig: InterfaceConfig | undefined
    if (config.configFrom) {
      if (config.configFrom.type === 'interface') {
        if (config.configFrom.interface) {
          interfaceConfig = config.configFrom.interface
        }
      } else if (config.configFrom.type === 'data') {
        fields = config.configFrom.configField ? getValue(value, config.configFrom.configField) : []
        const dataToUnstringfy = this.handleDataToUnstringfy(fields)
        if (!isEqual(dataToUnstringfy, this.state.fields)) {
          this.setState({
            fields: dataToUnstringfy
          })
        }
      }
    } else if (config.interface) {
      interfaceConfig = config.interface
    }

    if (interfaceConfig) {
      this.interfaceHelper
        .request(
          interfaceConfig,
          {},
          {
            record: this.props.record,
            data: this.props.data,
            step: this.props.step,
            containerPath: this.props.containerPath
          },
          { loadDomain: this.props.loadDomain },
          this
        )
        .then((data) => {
          const dataToUnstringfy = this.handleDataToUnstringfy(data as FieldConfigs[] | string)
          if (this.props.config.withConfig?.enable && this.props.config.withConfig?.configField)
            this.props.onValueSet(this.props.config.withConfig.configField, data, true)
          if (!isEqual(dataToUnstringfy, this.state.fields)) {
            this.setState({
              fields: dataToUnstringfy
            })
          }
        })
    }
  }

  componentDidMount() {
    this.getConfigData()
  }

  componentDidUpdate() {
    this.getConfigData()
  }

  render = () => {
    const { config, formLayout, value, data, step, containerPath } = this.props

    const { fields } = this.state

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return <></>
    }
    const withConfigPath =
      this.props.config.withConfig?.enable && this.props.config.withConfig?.dataField
        ? `${this.props.config.withConfig.dataField}`
        : ''
    return (
      <>
        {this.renderComponent({
          columns: config.columns,
          children: this.state.didMount
            ? (Array.isArray(this.state.fields) ? this.state.fields : []).map((formFieldConfig, formFieldIndex) => {
                if (
                  !ConditionHelper(
                    formFieldConfig.condition,
                    { record: value, data, step, containerPath, extraContainerPath: this.props.config.field },
                    this
                  )
                ) {
                  this.formFieldsMounted = set(this.formFieldsMounted, `[${formFieldIndex}]`, false)
                  this.formFields && (this.formFields[formFieldIndex] = null)
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

                let status = (this.state.formData[formFieldIndex] || {}).status || 'normal'

                if (
                  ['group', 'import_subform', 'object', 'tabs', 'form'].some((type) => type === formFieldConfig.type)
                ) {
                  status = 'normal'
                }

                const renderData = {
                  key: formFieldIndex,
                  label: formFieldConfig.label,
                  subLabel: this.handleSubLabelContent(formFieldConfig),
                  status,
                  columns: config.columns?.enable
                    ? {
                        type: formFieldConfig.columns?.type || config.childColumns?.type || 'span',
                        value: formFieldConfig.columns?.value || config.childColumns?.value || 1,
                        wrap: formFieldConfig.columns?.wrap || config.childColumns?.wrap || false,
                        gap: config.columns?.gap || 0,
                        rowGap: config.columns?.rowGap || 0
                      }
                    : undefined,
                  message: (this.state.formData[formFieldIndex] || {}).message || '',
                  extra: StatementHelper(
                    formFieldConfig.extra,
                    {
                      record: this.props.value,
                      data: this.props.data,
                      step: this.props.step,
                      containerPath: this.props.containerPath,
                      extraContainerPath: this.props.config.field
                    },
                    this
                  ),
                  required: getBoolean(formFieldConfig.required),
                  layout: formLayout,
                  visitable: display,
                  fieldType: formFieldConfig.type,
                  children: (
                    <FormField
                      key={formFieldIndex}
                      ref={(formField: Field<FieldConfigs, unknown, unknown> | null) => {
                        if (formField) {
                          this.formFields = set(this.formFields, `[${formFieldIndex}]`, formField)
                          this.handleMount(formFieldIndex)
                        }
                      }}
                      form={this.props.form}
                      formLayout={formLayout}
                      value={getValue(value, getChainPath(withConfigPath, formFieldConfig.field))}
                      record={value}
                      step={this.props.step}
                      data={data}
                      config={formFieldConfig}
                      onChange={async (valueChange: unknown) => {
                        await this.handleChange(formFieldIndex, valueChange)
                      }}
                      onValueSet={async (path, valueSet, validation, options) =>
                        this.handleValueSet(formFieldIndex, path, valueSet, validation, options)
                      }
                      onValueUnset={async (path, validation, options) =>
                        this.handleValueUnset(formFieldIndex, path, validation, options)
                      }
                      onValueListAppend={async (path, valueAppend, validation, options) =>
                        this.handleValueListAppend(formFieldIndex, path, valueAppend, validation, options)
                      }
                      onValueListSplice={async (path, index, count, validation, options) =>
                        this.handleValueListSplice(formFieldIndex, path, index, count, validation, options)
                      }
                      onValueListSort={async (path, index, sortType, validation, options) =>
                        this.handleValueListSort(formFieldIndex, path, index, sortType, validation, options)
                      }
                      checkPageAuth={this.props.checkPageAuth}
                      loadPageURL={this.props.loadPageURL}
                      loadPageFrameURL={this.props.loadPageFrameURL}
                      loadPageConfig={this.props.loadPageConfig}
                      baseRoute={this.props.baseRoute}
                      loadDomain={async (domain: string) => this.props.loadDomain(domain)}
                      loadPageList={async () => this.props.loadPageList()}
                      containerPath={getChainPath(this.props.containerPath, this.props.config.field)}
                      onReportFields={async (field: string) => this.handleReportFields(field)}
                    />
                  )
                }
                // 渲染表单项容器
                return hidden ? this.renderItemComponent(renderData) : <React.Fragment key={formFieldIndex} />
              })
            : []
        })}
      </>
    )
  }
}
