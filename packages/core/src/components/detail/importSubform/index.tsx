import React from 'react'
import { cloneDeep, isEqual } from 'lodash'
import { getValue, getChainPath } from '../../../util/value'

import { DetailField, DetailFieldConfig, DetailFieldProps, IDetailField } from '../common'
import { Display } from '../../formFields/common'
import { display as getALLComponents, FieldConfigs } from '../../formFields'
import { IDetailItem } from '../../../steps/detail'
import ConditionHelper from '../../../util/condition'
import InterfaceHelper, { InterfaceConfig } from '../../../util/interface'
import { ColumnsConfig } from '../../../interface'

/**
 * 子表单配置项
 * - configFrom: 配置来源(get用途)
 * - * - type: 'data' | 'interface' // 来源类型
 * - * - dataField: 值来源字段 // 仅type为data时生效
 * - * - configField: 配置来源字段 // 仅type为data时生效
 * - * - interface: 来源接口配置 // 仅type为interface时生效
 */
export interface ImportSubformFieldConfig extends DetailFieldConfig {
  type: 'import_subform'
  configFrom?: ImportSubformConfigFromData | ImportSubformConfigFromInterface
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

export default class DetailImportSubformField
  extends DetailField<
    ImportSubformFieldConfig,
    IImportSubformField,
    { [key: string]: unknown },
    IImportSubformFieldState
  >
  implements IDetailField<{ [key: string]: unknown }>
{
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: string): typeof Display => getALLComponents[type]

  // 用于请求防频的判断条件
  requestConfig = ''

  value = ''

  formFields: Array<Display<FieldConfigs, unknown, unknown> | null> = []

  formFieldsMounted: Array<boolean> = []

  interfaceHelper = new InterfaceHelper()

  constructor(props: DetailFieldProps<ImportSubformFieldConfig, { [key: string]: unknown }>) {
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

  handleMount = async (formFieldIndex: number) => {
    if (this.formFieldsMounted[formFieldIndex]) {
      return true
    }
    this.formFieldsMounted[formFieldIndex] = true
    if (this.formFields[formFieldIndex]) {
      const formField = this.formFields[formFieldIndex]
      if (formField) {
        const formFieldConfig = this.state.fields[formFieldIndex]
        const withConfigPath =
          this.props.config.configFrom?.type === 'data' && this.props.config.configFrom.dataField
            ? `${this.props.config.configFrom.dataField}`
            : ''

        let value = getValue(this.props.value, getChainPath(withConfigPath, formFieldConfig.field))
        const source = value
        if (formFieldConfig.defaultValue && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.props.onValueSet(getChainPath(withConfigPath, formFieldConfig.field), value)
        }
        await formField.didMount()
      }
    }
  }

  handleValueSet = async (
    formFieldIndex: number,
    path: string,
    value: unknown,
    options?: { noPathCombination?: boolean }
  ) => {
    const withConfigPath =
      this.props.config.configFrom?.type === 'data' && this.props.config.configFrom.dataField
        ? `${this.props.config.configFrom.dataField}`
        : ''
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath =
        options && options.noPathCombination ? path : getChainPath(withConfigPath, formFieldConfig.field, path)
      await this.props.onValueSet(fullPath, value)
    }
  }

  handleValueUnset = async (formFieldIndex: number, path: string, options?: { noPathCombination?: boolean }) => {
    const withConfigPath =
      this.props.config.configFrom?.type === 'data' && this.props.config.configFrom.dataField
        ? `${this.props.config.configFrom.dataField}`
        : ''
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath =
        options && options.noPathCombination ? path : getChainPath(withConfigPath, formFieldConfig.field, path)
      await this.props.onValueUnset(fullPath)
    }
  }

  handleValueListAppend = async (
    formFieldIndex: number,
    path: string,
    value: unknown,
    options?: { noPathCombination?: boolean }
  ) => {
    const withConfigPath =
      this.props.config.configFrom?.type === 'data' && this.props.config.configFrom.dataField
        ? `${this.props.config.configFrom.dataField}`
        : ''
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath =
        options && options.noPathCombination ? path : getChainPath(withConfigPath, formFieldConfig.field, path)
      await this.props.onValueListAppend(fullPath, value)
    }
  }

  handleValueListSplice = async (
    formFieldIndex: number,
    path: string,
    index: number,
    count: number,
    options?: { noPathCombination?: boolean }
  ) => {
    const withConfigPath =
      this.props.config.configFrom?.type === 'data' && this.props.config.configFrom.dataField
        ? `${this.props.config.configFrom.dataField}`
        : ''
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath =
        options && options.noPathCombination ? path : getChainPath(withConfigPath, formFieldConfig.field, path)
      await this.props.onValueListSplice(fullPath, index, count)
    }
  }

  renderComponent: (props: IImportSubformField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现ImportSubformField组件。</>
  }

  /**
   * 表单项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderItemComponent: (props: IDetailItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormItem组件。</>
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

  getConfigData = () => {
    const { config, value } = this.props
    if (config.configFrom && config.configFrom.type === 'interface' && config.configFrom.interface) {
      this.interfaceHelper
        .request(
          config.configFrom.interface,
          {},
          {
            record: this.props.record,
            data: this.props.data,
            step: this.props.step,
            containerPath: this.props.containerPath
          },
          { loadDomain: this.props.loadDomain }
        )
        .then((data) => {
          const dataToUnstringfy = this.handleDataToUnstringfy(data as FieldConfigs[] | string)
          if (!isEqual(dataToUnstringfy, this.state.fields)) {
            this.setState({
              fields: dataToUnstringfy
            })
          }
        })
    }

    let { fields } = this.state
    if (config.configFrom && config.configFrom.type === 'data') {
      fields = config.configFrom.configField ? getValue(value, config.configFrom.configField) : []
      const dataToUnstringfy = this.handleDataToUnstringfy(fields)
      if (!isEqual(dataToUnstringfy, this.state.fields)) {
        this.setState({
          fields: dataToUnstringfy
        })
      }
    }
  }

  componentDidMount() {
    this.getConfigData()
  }

  componentDidUpdate() {
    this.getConfigData()
  }

  render = () => {
    const { config, formLayout, value, record, data, step, containerPath } = this.props

    const { fields } = this.state

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return <></>
    }
    const withConfigPath =
      this.props.config.configFrom?.type === 'data' && this.props.config.configFrom.dataField
        ? `${this.props.config.configFrom.dataField}`
        : ''
    return (
      <>
        {this.renderComponent({
          columns: config?.columns?.enable ? config.columns : undefined,
          children: this.state.didMount
            ? fields.map((formFieldConfig, formFieldIndex) => {
                if (!ConditionHelper(formFieldConfig.condition, { record: value, data, step, containerPath })) {
                  this.formFieldsMounted[formFieldIndex] = false
                  return null
                }
                let display = true

                if (formFieldConfig.type === 'hidden' || formFieldConfig.display === 'none') {
                  display = false
                }

                const FormField = this.getALLComponents(formFieldConfig.type) || Display

                const renderData: IDetailItem = {
                  key: formFieldIndex,
                  label: formFieldConfig.label,
                  columns: config.columns?.enable
                    ? {
                        type: formFieldConfig.columns?.type || config.childColumns?.type || 'span',
                        value: formFieldConfig.columns?.value || config.childColumns?.value || 1,
                        wrap: formFieldConfig.columns?.wrap || config.childColumns?.wrap || false,
                        gap: config.columns?.gap || 0,
                        rowGap: config.columns?.rowGap || 0
                      }
                    : undefined,
                  layout: formLayout,
                  visitable: display,
                  fieldType: formFieldConfig.type,
                  children: (
                    <React.Suspense fallback={<>Loading</>}>
                      <FormField
                        key={formFieldIndex}
                        ref={(formField: Display<FieldConfigs, unknown, unknown> | null) => {
                          if (formField) {
                            this.formFields[formFieldIndex] = formField
                            this.handleMount(formFieldIndex)
                          }
                        }}
                        value={getValue(value, getChainPath(withConfigPath, formFieldConfig.field))}
                        record={record}
                        data={cloneDeep(data)}
                        step={step}
                        config={formFieldConfig}
                        onValueSet={async (path, valueSet, options) =>
                          this.handleValueSet(formFieldIndex, path, valueSet, options)
                        }
                        onValueUnset={async (path, options) => this.handleValueUnset(formFieldIndex, path, options)}
                        onValueListAppend={async (path, valueAppend, options) =>
                          this.handleValueListAppend(formFieldIndex, path, valueAppend, options)
                        }
                        onValueListSplice={async (path, index, count, options) =>
                          this.handleValueListSplice(formFieldIndex, path, index, count, options)
                        }
                        baseRoute={this.props.baseRoute}
                        loadDomain={async (domain: string) => this.props.loadDomain(domain)}
                        containerPath={getChainPath(this.props.containerPath, this.props.config.field)}
                      />
                    </React.Suspense>
                  )
                }
                // 渲染表单项容器
                return this.renderItemComponent(renderData)
              })
            : []
        })}
      </>
    )
  }
}
