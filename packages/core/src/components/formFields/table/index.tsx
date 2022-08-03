import React from 'react'
import { set } from 'lodash'
import { Display, Field, FieldConfig, FieldConfigs, FieldError, FieldProps, IField } from '../common'
import getALLComponents, { display } from '..'
import OperationsHelper, { OperationsConfig } from '../../../util/operations'
import OperationHelper, { OperationConfig } from '../../../util/operation'
import TableFieldForm from './common/form'
import { getChainPath } from '../../../util/value'

export interface TableFieldConfig extends FieldConfig {
  type: 'table'
  primary: string
  width?: number
  tableColumns: FieldConfigs[]
  operations?: {
    tableOperations?: {
      topLeft?: OperationsConfig<OperationConfig | TableFieldCreateConfig>
      topRight?: OperationsConfig<OperationConfig | TableFieldCreateConfig>
      bottomLeft?: OperationsConfig<OperationConfig | TableFieldCreateConfig>
      bottomRight?: OperationsConfig<OperationConfig | TableFieldCreateConfig>
    }
    rowOperations?: OperationsConfig<OperationConfig | TableFieldUpdateConfig | TableFieldRemoveConfig>
  }
}

export interface TableFieldCreateConfig {
  type: 'form-table-create'
  fields: FieldConfigs[]
}

export interface TableFieldUpdateConfig {
  type: 'form-table-update'
  fields: FieldConfigs[]
}

export interface TableFieldRemoveConfig {
  type: 'form-table-remove'
}

/**
 * 表格步骤组件 - 列 - UI渲染方法 - 入参
 */
export interface ITableColumn {
  field: string
  label: string
  align: 'left' | 'center' | 'right'
  render: (value: unknown, record: { [type: string]: unknown }, index: number) => React.ReactNode
}

interface TableState {
  didMount: boolean
  formDataList: { status: 'normal' | 'error' | 'loading'; message?: string }[][]
  showItem: boolean
  showIndex: number
}

/**
 * 表格步骤组件 - UI渲染方法 - 入参
 * - data: 数据
 */
export interface ITableField {
  title: string | null
  primary: string
  width?: number
  data: unknown[]
  tableColumns: ITableColumn[]
  tableOperations?: {
    topLeft?: React.ReactNode
    topRight?: React.ReactNode
    bottomLeft?: React.ReactNode
    bottomRight?: React.ReactNode
  }
  description?: {
    type: 'text' | 'tooltip' | 'modal'
    label: string | undefined
    content: React.ReactNode
    showIcon: boolean
  }
}

export default class TableField
  extends Field<TableFieldConfig, ITableField, unknown[], TableState>
  implements IField<unknown[]>
{
  getALLComponents = (type: string): typeof Field => getALLComponents[type]

  display = (type: string): typeof Display => display[type]

  OperationsHelper = OperationsHelper

  OperationHelper = OperationHelper

  TableFieldForm = TableFieldForm

  formFieldsList: Array<Array<Field<FieldConfigs, unknown, unknown> | null>> = []

  formFieldsMountedList: Array<Array<boolean>> = []

  constructor(props: FieldProps<TableFieldConfig, unknown[]>) {
    super(props)

    this.state = {
      didMount: false,
      formDataList: [],
      showItem: false,
      showIndex: 0
    }
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

  fullPath = (field: string, path: string, options?: { noPathCombination?: boolean }) => {
    let fullPath = ''
    if (options && options.noPathCombination) {
      fullPath = path
    } else if (field === '' || path === '') {
      fullPath = `${field}${path}`
    } else {
      fullPath = `${field}.${path}`
    }
    return fullPath
  }

  handleValueSet = async (
    index: number,
    formFieldIndex: number,
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.columns || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.fullPath(formFieldConfig.field, path, options)
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
    const formFieldConfig = (this.props.config.columns || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.fullPath(formFieldConfig.field, path, options)
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
    const formFieldConfig = (this.props.config.columns || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.fullPath(formFieldConfig.field, path, options)
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
    const formFieldConfig = (this.props.config.columns || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.fullPath(formFieldConfig.field, path, options)
      await this.props.onValueListSplice(`[${index}]${fullPath}`, _index, count, true)

      this.handleValueCallback(index, formFieldIndex, validation)
    }
  }

  handleValueListSort = async (
    index: number,
    formFieldIndex: number,
    path: string,
    _index: number,
    sortType: 'up' | 'down',
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.columns || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath = this.fullPath(formFieldConfig.field, path, options)
      await this.props.onValueListSort(`[${index}]${fullPath}`, _index, sortType, true)

      this.handleValueCallback(index, formFieldIndex, validation)
    }
  }

  /**
   * 渲染 表格
   * @param props
   * @returns
   */
  renderComponent: (props: ITableField) => JSX.Element = () => {
    return (
      <>
        您当前使用的UI版本没有实现Table组件。
        <div style={{ display: 'none' }} />
      </>
    )
  }

  render = () => {
    const {
      form,
      formLayout,
      config,
      data,
      step,
      onValueSet,
      onValueListAppend,
      onValueListSplice,
      checkPageAuth,
      loadPageURL,
      loadPageFrameURL,
      loadPageConfig,
      loadPageList,
      baseRoute,
      loadDomain,
      containerPath
    } = this.props

    const {
      OperationsHelper: CurrentOperationsHelper,
      OperationHelper: CurrentOperationHelper,
      TableFieldForm: CurrentTableFieldForm
    } = this

    const tableColumns: ITableColumn[] = (config.tableColumns || [])
      .filter((column) => column.field !== undefined && column.field !== '')
      .map((column, fieldIndex) => {
        const field = column.field.split('.')[0]
        return {
          field,
          label: column.label,
          align: 'left',
          render: (value: unknown, record: { [field: string]: unknown }, index) => {
            const Column = this.display(column.type)
            if (Column) {
              return (
                <Column
                  ref={() => {
                    /* TODO */
                  }}
                  value={value}
                  record={record}
                  data={data}
                  step={step}
                  config={column}
                  onValueSet={async (path, setValue, options) =>
                    this.handleValueSet(index, fieldIndex, path, setValue, true, options)
                  }
                  onValueUnset={async (path, options) => this.handleValueUnset(index, fieldIndex, path, true, options)}
                  onValueListAppend={async (path, appendValue, options) =>
                    this.handleValueListAppend(index, fieldIndex, path, appendValue, true, options)
                  }
                  onValueListSplice={async (path, _index, count, options) =>
                    this.handleValueListSplice(index, fieldIndex, path, _index, count, true, options)
                  }
                  baseRoute={this.props.baseRoute}
                  loadDomain={async (domain: string) => this.props.loadDomain(domain)}
                  containerPath={getChainPath(this.props.containerPath, config.field, index)}
                />
              )
            }
          }
        }
      })

    if (config.operations && config.operations.rowOperations && config.operations.rowOperations.length > 0) {
      tableColumns.push({
        field: 'ccms-form-table-rowOperation',
        label: '操作',
        align: 'left',
        render: (_, record: { [field: string]: unknown }, index) => {
          return (
            <CurrentOperationsHelper
              config={config.operations?.rowOperations || []}
              onClick={(operationConfig, datas) => {
                return function operationRender(children) {
                  if (operationConfig) {
                    if (operationConfig.type === 'ccms') {
                      return (
                        <CurrentOperationHelper
                          config={operationConfig}
                          datas={datas}
                          checkPageAuth={checkPageAuth}
                          loadPageURL={loadPageURL}
                          loadPageFrameURL={loadPageFrameURL}
                          loadPageConfig={loadPageConfig}
                          loadPageList={loadPageList}
                          baseRoute={baseRoute}
                          loadDomain={loadDomain}
                        >
                          {children}
                        </CurrentOperationHelper>
                      )
                    }
                    if (operationConfig.type === 'form-table-update') {
                      return (
                        <CurrentTableFieldForm
                          form={form}
                          formLayout={formLayout}
                          config={operationConfig}
                          data={record}
                          datas={datas}
                          onSubmit={(value) => onValueSet(`[${index}]`, value, true)}
                          checkPageAuth={checkPageAuth}
                          loadPageURL={loadPageURL}
                          loadPageFrameURL={loadPageFrameURL}
                          loadPageConfig={loadPageConfig}
                          loadPageList={loadPageList}
                          baseRoute={baseRoute}
                          loadDomain={loadDomain}
                          containerPath={getChainPath(containerPath, config.field, index)}
                        >
                          {children}
                        </CurrentTableFieldForm>
                      )
                    }
                    if (operationConfig.type === 'form-table-remove') {
                      return children(() => onValueListSplice('', index, 1, true))
                    }
                  }
                  return <></>
                }
              }}
              datas={{
                data: this.props.data,
                step: this.props.step,
                containerPath: this.props.containerPath,
                record
              }}
              checkPageAuth={checkPageAuth}
              loadPageURL={loadPageURL}
              loadPageFrameURL={loadPageFrameURL}
              loadPageConfig={loadPageConfig}
              loadPageList={loadPageList}
              baseRoute={baseRoute}
              loadDomain={loadDomain}
            />
          )
        }
      })
    }

    const option: ITableField = {
      title: config.label,
      width: config.width || 0,
      primary: config.primary,
      data: this.props.value,
      tableColumns
    }

    if (config.operations && config.operations.tableOperations) {
      option.tableOperations = {}
      for (const position of ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']) {
        if (config.operations.tableOperations[position]) {
          option.tableOperations[position] = (
            <CurrentOperationsHelper<OperationConfig | TableFieldCreateConfig>
              config={config.operations.tableOperations[position]}
              onClick={(operationConfig, datas) => {
                return function operationRender(children) {
                  if (operationConfig) {
                    if (operationConfig.type === 'ccms') {
                      return (
                        <CurrentOperationHelper
                          config={operationConfig}
                          datas={datas}
                          checkPageAuth={checkPageAuth}
                          loadPageURL={loadPageURL}
                          loadPageFrameURL={loadPageFrameURL}
                          loadPageConfig={loadPageConfig}
                          loadPageList={loadPageList}
                          baseRoute={baseRoute}
                          loadDomain={loadDomain}
                        >
                          {children}
                        </CurrentOperationHelper>
                      )
                    }
                    if (operationConfig.type === 'form-table-create') {
                      return (
                        <CurrentTableFieldForm
                          form={form}
                          formLayout={formLayout}
                          config={operationConfig}
                          data={{}}
                          datas={datas}
                          onSubmit={(value) => onValueListAppend(``, value, true)}
                          checkPageAuth={checkPageAuth}
                          loadPageURL={loadPageURL}
                          loadPageFrameURL={loadPageFrameURL}
                          loadPageConfig={loadPageConfig}
                          loadPageList={loadPageList}
                          baseRoute={baseRoute}
                          loadDomain={loadDomain}
                          containerPath={getChainPath(containerPath, config.field, data.length)}
                        >
                          {children}
                        </CurrentTableFieldForm>
                      )
                    }
                  }
                  return <></>
                }
              }}
              datas={{
                data: this.props.data,
                step: this.props.step,
                containerPath: this.props.containerPath,
                record: {}
              }}
              checkPageAuth={checkPageAuth}
              loadPageURL={loadPageURL}
              loadPageFrameURL={loadPageFrameURL}
              loadPageConfig={loadPageConfig}
              loadPageList={loadPageList}
              baseRoute={baseRoute}
              loadDomain={loadDomain}
            />
          )
        }
      }
    }

    return <>{this.renderComponent(option)}</>
  }
}
