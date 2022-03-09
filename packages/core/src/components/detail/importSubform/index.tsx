import React from 'react'
import { getValue } from '../../../util/value'

import { DetailField, DetailFieldConfig, DetailFieldProps, IDetailField } from '../common'
import { Display } from '../../formFields/common'
import { display as getALLComponents, FieldConfigs } from '../../formFields'
import { IDetailItem } from '../../../steps/detail'
import { cloneDeep, isEqual } from 'lodash'
import ConditionHelper from '../../../util/condition'
import InterfaceHelper, { InterfaceConfig } from '../../../util/interface'
import { ColumnsConfig } from '../../../interface'

/**
 * 子表单配置项
 * - withConfig: 拓展配置
 * - * - enable: 是否开启
 * - * - dataField: （序列化）数据
 * - * - configField: （序列化）配置
 */
export interface ImportSubformFieldConfig extends DetailFieldConfig {
  type: 'import_subform',
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
  formData: { status: 'normal' | 'error' | 'loading', message?: string }[]
}

export default class ImportSubformField extends DetailField<ImportSubformFieldConfig, IImportSubformField, any, IImportSubformFieldState> implements IDetailField<string> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any): typeof Display => getALLComponents[type]

  // 用于请求防频的判断条件
  requestConfig: string = ''
  value: string = ''

  formFields: Array<Display<FieldConfigs, {}, any> | null> = []
  formFieldsMounted: Array<boolean> = []

  interfaceHelper = new InterfaceHelper()

  constructor (props: DetailFieldProps<ImportSubformFieldConfig, any>) {
    super(props)

    this.state = {
      didMount: false,
      fields: [],
      formData: []
    }
  }

  getFullpath (field: string, path: string = '') {
    const withConfigPath = this.props.config.configFrom?.type === 'data' && this.props.config.configFrom.dataField ? `${this.props.config.configFrom.dataField}` : ''
    const _fullPath = `${withConfigPath}.${field}.${path}.`
    const fullPath = _fullPath.replace(/(^\.*)|(\.*$)|(\.){2,}/g, '$3')
    return fullPath
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

        let value = getValue(this.props.value, this.getFullpath(formFieldConfig.field))
        const source = value
        if ((formFieldConfig.defaultValue) && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.props.onValueSet(this.getFullpath(formFieldConfig.field), value, true)
        }
        await formField.didMount()
      }
    }
  }

  handleValueSet = async (formFieldIndex: number, path: string, value: any) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.getFullpath(formFieldConfig.field, path)
      await this.props.onValueSet(fullPath, value, true)
    }
  }

  handleValueUnset = async (formFieldIndex: number, path: string) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.getFullpath(formFieldConfig.field, path)
      await this.props.onValueUnset(fullPath, true)
    }
  }

  handleValueListAppend = async (formFieldIndex: number, path: string, value: any) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.getFullpath(formFieldConfig.field, path)
      await this.props.onValueListAppend(fullPath, value, true)
    }
  }

  handleValueListSplice = async (formFieldIndex: number, path: string, index: number, count: number) => {
    const formFieldConfig = (this.state.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.getFullpath(formFieldConfig.field, path)
      await this.props.onValueListSplice(fullPath, index, count, true)
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
  renderItemComponent = (props: IDetailItem) => {
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

    if (config.configFrom && config.configFrom.type === 'interface' && config.configFrom.interface) {
      this.interfaceHelper.request(
        config.configFrom.interface,
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
        if (dataToStringfy !== JSON.stringify(this.state.fields)) {
          this.setState({
            fields: dataToUnstringfy
          })
        }
      })
    }

    let fields = this.state.fields
    if (config.configFrom && config.configFrom.type === 'data') {
      fields = config.configFrom.configField ? getValue(value, config.configFrom.configField) : []
      if (!isEqual(fields, this.state.fields)) {
        this.setState({
          fields
        })
      }
    }
    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return <React.Fragment />
    } else {
      return (
        <React.Fragment>
          {this.renderComponent({
            columns: config?.columns?.enable ? config.columns : undefined,
            children: this.state.didMount
              ? fields.map((formFieldConfig, formFieldIndex) => {
                if (!ConditionHelper(formFieldConfig.condition, { record: value, data, step })) {
                  this.formFieldsMounted[formFieldIndex] = false
                  return null
                }
                let display: boolean = true

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
                    <FormField
                      key={formFieldIndex}
                      ref={(formField: Display<FieldConfigs, any, any> | null) => {
                        if (formField) {
                          this.formFields[formFieldIndex] = formField
                          this.handleMount(formFieldIndex)
                        }
                      }}
                      value={getValue(value, this.getFullpath(formFieldConfig.field))}
                      record={record}
                      data={cloneDeep(data)}
                      step={step}
                      config={formFieldConfig}
                      onValueSet={async (path, value) => this.handleValueSet(formFieldIndex, path, value)}
                      onValueUnset={async (path) => this.handleValueUnset(formFieldIndex, path)}
                      onValueListAppend={async (path, value) => this.handleValueListAppend(formFieldIndex, path, value)}
                      onValueListSplice={async (path, index, count) => this.handleValueListSplice(formFieldIndex, path, index, count)}
                      baseRoute={this.props.baseRoute}
                      loadDomain={async (domain: string) => await this.props.loadDomain(domain)}
                    />
                  )
                }
                // 渲染表单项容器
                return this.renderItemComponent(renderData)
              })
              : []
          })}
        </React.Fragment>
      )
    }
  }
}
