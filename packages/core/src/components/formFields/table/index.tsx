import React from 'react'
import { set } from 'lodash'
import { Display, Field, FieldConfig, FieldConfigs, FieldError, FieldProps, IField } from '../common'
import getALLComponents, { display } from '..'
import OperationsHelper, { OperationsConfig } from '../../../util/operations'
import OperationHelper from '../../../util/operation'

export interface TableFieldConfig extends FieldConfig {
  type: 'table'
  primary: string
  width?: number
  tableColumns: FieldConfigs[]
  operations?: {
    tableOperations?: {
      topLeft?: OperationsConfig
      topRight?: OperationsConfig
      bottomLeft?: OperationsConfig
      bottomRight?: OperationsConfig
    }
    multirowOperations?: {
      topLeft?: OperationsConfig
      topRight?: OperationsConfig
      bottomLeft?: OperationsConfig
      bottomRight?: OperationsConfig
    }
    rowOperations?: OperationsConfig
  }
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
      config,
      data,
      step,
      checkPageAuth,
      loadPageURL,
      loadPageFrameURL,
      loadPageConfig,
      loadPageList,
      baseRoute,
      loadDomain
    } = this.props

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
        render: (_, record: { [field: string]: unknown }) => {
          return (
            <this.OperationsHelper
              config={config.operations?.rowOperations || []}
              onClick={(config, datas) => {
                return function (children) {
                  return (
                    <this.OperationHelper
                      config={config}
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
                    </this.OperationHelper>
                  )
                }
              }}
              datas={{
                data: this.props.data,
                step: this.props.step,
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

    return (
      <>
        {this.renderComponent({
          title: config.label,
          width: config.width || 0,
          primary: config.primary,
          data: this.props.value,
          tableColumns
        })}
      </>
    )
  }
}
