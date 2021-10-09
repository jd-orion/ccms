import React from 'react'
import queryString from 'query-string'
import { getParam, getParamText, getValue } from '../../util/value'
import getALLComponents, { ColumnConfigs } from '../../components/tableColumns'
import Step, { StepConfig, StepProps } from '../common'
import { ParamConfig } from '../../interface'
import ColumnStyleComponent from './common/columnStyle'
import CCMS, { CCMSConfig } from '../../main'
import { get, set } from 'lodash'
import InterfaceHelper, { InterfaceConfig } from '../../util/interface'

/**
 * 表格步骤配置文件格式定义
 * - field:   表格列表数据来源字段
 * - columns: 表格列配置列表
 */
export interface TableConfig extends StepConfig {
  type: 'table'
  width: string
  field: string
  label: string
  primary: string
  columns: ColumnConfigs[]
  operations?: {
    tableOperations?: Array<TableOperationConfig | TableOperationGroupConfig>
    rowOperations?: Array<TableOperationConfig | TableOperationGroupConfig>
    multirowOperations?: Array<TableOperationConfig | TableOperationGroupConfig>
  }
  pagination?: {
    mode: 'none' | 'client' | 'server'
    current?: string
    pageSize?: string
    total?: string
  }
}

/**
 * 表格步骤-操作配置文件格式
 */
export interface TableOperationGroupConfig {
  type: 'group'
  label?: string
  level?: 'normal' | 'primary' | 'danger'
  operations: Array<TableOperationConfig>
}

/**
 * 表格步骤-操作配置文件格式
 */
export interface TableOperationConfig {
  type: 'button'
  label: string
  level?: 'normal' | 'primary' | 'danger'
  check?: { enable: false } | TableOperationCheckConfig
  confirm?: { enable: false } | TableOperationConfirmConfig
  handle: TableCCMSOperationConfig
  condition?: {
    statement?: string
    params?: Array<{
      field?: string
      data?: ParamConfig
    }>
  }
}

export interface TableCCMSOperationConfig {
  type: 'ccms'
  page: any
  target: 'current' | 'page' | 'open' | 'handle'
  targetURL: string
  data: { [key: string]: ParamConfig }
  callback?: boolean
}

interface TableOperationCheckConfig {
  enable: true
  interface: InterfaceConfig
}

interface TableOperationConfirmConfig {
  enable: true
  titleText: string
  titleParams?: Array<{ field: string, data: ParamConfig }>
  okText: string
  cancelText: string
}

/**
 * 表格步骤组件 - UI渲染方法 - 入参
 * - data: 数据
 */
export interface ITable {
  title: string | null
  primary: string
  data: { [field: string]: any }[]
  columns: ITableColumn[]
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  tableOperations: React.ReactNode | null
  multirowOperations: React.ReactNode | null
}

/**
 * 表格步骤组件 - 列 - UI渲染方法 - 入参
 */
export interface ITableColumn {
  field: string
  label: string
  render: (value: any, record: { [type: string]: any }, index: number) => React.ReactNode
}

/**
 * 表格步骤组件 - 操作 - UI渲染方法 - 入参
 */
export interface ITableStepRowOperation {
  children: (React.ReactNode | undefined)[]
}

/**
 * 表格步骤组件 - 操作 - UI渲染方法 - 入参
 */
 export interface ITableStepTableOperation {
  children: (React.ReactNode | undefined)[]
}

/**
 * 表格步骤组件 - 操作按钮 - UI渲染方法 - 入参
 */
export interface ITableStepRowOperationButton {
  label: string
  level: 'normal' | 'primary' | 'danger'
  disabled?: boolean
  onClick: () => Promise<void>
}

/**
 * 表格步骤组件 - 操作按钮组 - UI渲染方法 - 入参
 */
export interface ITableStepRowOperationGroup {
  label?: string
  children: React.ReactNode[]
}

/**
 * 表格步骤组件 - 操作按钮组元素 - UI渲染方法 - 入参
 */
export interface ITableStepRowOperationGroupItem {
  label: string
  level: 'normal' | 'primary' | 'danger'
  disabled?: boolean
  onClick: () => Promise<void>
}

/**
 * 表格步骤组件 - 操作按钮 - UI渲染方法 - 入参
 */
export interface ITableStepTableOperationButton {
  label: string
  level: 'normal' | 'primary' | 'danger'
  disabled?: boolean
  onClick: () => Promise<void>
}

/**
 * 表格步骤组件 - 操作按钮组 - UI渲染方法 - 入参
 */
export interface ITableStepTableOperationGroup {
  label?: string
  children: React.ReactNode[]
}

/**
 * 表格步骤组件 - 操作按钮组元素 - UI渲染方法 - 入参
 */
export interface ITableStepTableOperationGroupItem {
  label: string
  level: 'normal' | 'primary' | 'danger'
  disabled?: boolean
  onClick: () => Promise<void>
}

/**
 * 表格步骤组件 - 操作 - 二次确认 - UI渲染方法 - 入参
 */
export interface ITableStepOperationConfirm {
  title: string
  okText: string
  cancelText: string
  onOk: () => void
  onCancel: () => void
}

export interface ITableStepOperationModal {
  title: string
  visible: boolean
  width: string
  children: React.ReactNode
  onClose: () => void
}

interface TableState {
  operation: {
    enable: boolean
    target: 'current' | 'handle'
    title: string
    visible: boolean
    config: CCMSConfig
    data: any
    callback?: boolean
  }

}

/**
 * 表格步骤组件
 */
export default class TableStep extends Step<TableConfig, TableState> {
  CCMS = CCMS
  getALLComponents = (type: any) => getALLComponents[type]
  interfaceHelper = new InterfaceHelper()

  constructor (props: StepProps<TableConfig>) {
    super(props)

    this.state = {
      operation: {
        enable: false,
        target: 'current',
        title: '',
        visible: false,
        config: {},
        data: {},
        callback: false
      }
    }
  }

  /**
   * 执行操作
   * @param operation 
   * @param record 
   * @returns 
   */
  handleRowOperation = async (operation: TableOperationConfig, record: { [field: string]: any }) => {
    const {
      data,
      step
    } = this.props
    if (operation.check && operation.check.enable) {
      const checkResult = await this.interfaceHelper.request(
        operation.check.interface,
        {},
        { record, data, step },
        { loadDomain: this.props.loadDomain }
      )
      if (!checkResult) {
        return false
      }
    }

    if (operation.confirm && operation.confirm.enable) {
      const title = operation.confirm.titleParams ? (await getParamText(operation.confirm.titleText, operation.confirm.titleParams, { record, data, step })) : operation.confirm.titleText
      const showConfirm = () => {
        return new Promise((resolve, reject) => {
          if (operation.confirm && operation.confirm.enable) {
            this.renderOperationConfirm({
              title,
              okText: operation.confirm.okText,
              cancelText: operation.confirm.cancelText,
              onOk: () => { resolve(true) },
              onCancel: () => { reject(new Error('用户取消')) }
            })
          }
        })
      }
      try {
        await showConfirm()
      } catch (e) {
        return false
      }
    }

    if (operation.handle.type === 'ccms') {
      const params = {}
      for (const [field, param] of Object.entries(operation.handle.data || {})) {
        set(params, field, getParam(param, { record, data, step }))
      }
      if (operation.handle.target === 'current' || operation.handle.target === 'handle') {
        const operationConfig = await this.props.loadPageConfig(operation.handle.page)

        this.setState({
          operation: {
            enable: true,
            target: operation.handle.target,
            title: operation.label,
            visible: true,
            config: operationConfig,
            data: params,
            callback: operation.handle.callback
          }
        })
      } else if (operation.handle.target === 'page') {
        const sourceURL = await this.props.loadPageURL(operation.handle.page)
        const { url, query } = queryString.parseUrl(sourceURL, { arrayFormat: 'bracket' })
        const targetURL = operation.handle.targetURL || ''
        const targetKey = queryString.stringifyUrl({ url, query: { ...query, ...params } }, { arrayFormat: 'bracket' }) || ''
        window.location.href = `${targetURL}${targetKey}`
      } else if (operation.handle.target === 'open') {
        const sourceURL = await this.props.loadPageFrameURL(operation.handle.page)
        const { url, query } = queryString.parseUrl(sourceURL, { arrayFormat: 'bracket' })
        const targetURL = operation.handle.targetURL || ''
        const targetKey = queryString.stringifyUrl({ url, query: { ...query, ...params } }, { arrayFormat: 'bracket' }) || ''
        window.open(`${targetURL}${targetKey}`)
      }
    }
  }

  /**
   * 渲染 操作二次确认弹窗
   * @param props 
   */
  renderOperationConfirm = (props: ITableStepOperationConfirm) => {
    const mask = document.createElement('DIV')
    mask.style.position = 'fixed'
    mask.style.left = '0px'
    mask.style.top = '0px'
    mask.style.width = '100%'
    mask.style.height = '100%'
    mask.style.backgroundColor = 'white'
    mask.innerText = '您当前使用的UI版本没有实现Table的OperationConfirm组件。'
    mask.onclick = () => {
      mask.remove()
      props.onOk()
    }

    document.body.appendChild(mask)
  }

  /**
   * 渲染 表格
   * @param props 
   * @returns 
   */
  renderComponent = (props: ITable) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Table组件。
    </React.Fragment>
  }

  renderRowOperationComponent = (props: ITableStepRowOperation) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Table组件的OperationButton部分。
    </React.Fragment>
  }

  renderRowOperationButtonComponent = (props: ITableStepRowOperationButton) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Table组件的OperationButton部分。
    </React.Fragment>
  }

  renderRowOperationGroupComponent = (props: ITableStepRowOperationGroup) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Table组件的OperationGroup部分。
    </React.Fragment>
  }

  renderRowOperationGroupItemComponent = (props: ITableStepRowOperationGroupItem) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Table组件的OperationGroupItem部分。
    </React.Fragment>
  }

  renderTableOperationComponent = (props: ITableStepTableOperation) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Table组件的OperationButton部分。
    </React.Fragment>
  }

  renderTableOperationButtonComponent = (props: ITableStepTableOperationButton) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Table组件的OperationButton部分。
    </React.Fragment>
  }

  renderTableOperationGroupComponent = (props: ITableStepTableOperationGroup) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Table组件的OperationGroup部分。
    </React.Fragment>
  }

  renderTableOperationGroupItemComponent = (props: ITableStepTableOperationGroupItem) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Table组件的OperationGroupItem部分。
    </React.Fragment>
  }

  renderOperationModal = (props: ITableStepOperationModal) => {
    const mask = document.createElement('DIV')
    mask.style.position = 'fixed'
    mask.style.left = '0px'
    mask.style.top = '0px'
    mask.style.width = props.width || '100%'
    mask.style.height = '100%'
    mask.style.backgroundColor = 'white'
    mask.innerText = '您当前使用的UI版本没有实现Table的OperationModal组件。'
    mask.onclick = () => {
      mask.remove()
      props.onClose()
    }

    document.body.appendChild(mask)
  }

  render () {
    const {
      config: {
        field,
        label,
        width,
        primary,
        columns,
        operations,
        pagination
      },
      data,
      step,
      onUnmount
    } = this.props

    const {
      operation: {
        enable: operationEnable,
        target: operationTarget,
        title: operationTitle,
        visible: operationVisible,
        config: operationConfig,
        data: operationData,
        callback: operationCallback
      }
    } = this.state

    let getDate = field ? getValue(data[step], field) : data[step]
    if (Object.prototype.toString.call(getDate) !== '[object Array]') {
      getDate = []
    }

    const props: ITable = {
      title: label,
      primary,
      data: getDate,
      columns: (columns || []).filter((column) => column.field !== undefined && column.field !== '').map((column, index) => {
        const field = column.field.split('.')[0]

        return {
          field,
          label: column.label,
          render: (value: any, record: { [field: string]: any }) => {
            if (value && Object.prototype.toString.call(value) === '[object Object]') {
              value = getValue(value, column.field.replace(field, '').slice(1))
            }

            const Column = this.getALLComponents(column.type)
            if (Column) {
              const addfix = ['multirowText'].some((val) => val !== column.field)
              return <ColumnStyleComponent key={index} style={column.style} addfix={addfix} >
              <Column
                record={record}
                value={value}
                data={data}
                step={step}
                config={column}
              />
            </ColumnStyleComponent>
            }
          }
        }
      }),
      tableOperations: operations && operations.tableOperations ? this.renderTableOperationComponent({ children: operations.tableOperations.map((operation, index) => {
        if (operation.type === 'button') {
          return (
            <React.Fragment key={index}>
              {this.renderTableOperationButtonComponent({
                label: operation.label,
                level: operation.level || 'normal',
                onClick: async () => {
                  await this.handleRowOperation(operation, getDate)
                }
              })}
            </React.Fragment>
          )
        } else if (operation.type === 'group') {
          return (
            <React.Fragment key={index}>
              {this.renderTableOperationGroupComponent({
                label: operation.label,
                children: (operation.operations || []).map((operation) => {
                  return this.renderTableOperationGroupItemComponent({
                    label: operation.label,
                    level: operation.level || 'normal',
                    onClick: async () => { await this.handleRowOperation(operation, getDate) }
                  })
                })
              })}
            </React.Fragment>
          )
        } else {
          return <React.Fragment key={index} />
        }
      }) }) : null,
      multirowOperations: null
    }

    if (pagination && pagination.mode === 'server') {
      const paginationCurrent = Number((pagination.current === undefined || pagination.current === '') ? data[step] : get(data[step], pagination.current, 1))
      const paginationPageSize = Number((pagination.pageSize === undefined || pagination.pageSize === '') ? data[step] : get(data[step], pagination.pageSize, 20))
      const paginationTotal = Number((pagination.total === undefined || pagination.total === '') ? data[step] : get(data[step], pagination.total, 0))

      props.pagination = {
        current: Number.isNaN(paginationCurrent) ? 1 : paginationCurrent,
        pageSize: Number.isNaN(paginationPageSize) ? 20 : paginationPageSize,
        total: Number.isNaN(paginationTotal) ? 0 : paginationTotal,
        onChange: (page, pageSize) => {
          this.props.onUnmount(true,{
            [pagination.current || '']: page,
            [pagination.pageSize || '']: pageSize
          })
        }
      }
    }

    if (operations && operations.rowOperations && operations.rowOperations.length > 0) {
      props.columns.push({
        field: 'ccms-table-rowOperation',
        label: '操作',
        render: (_value: any, record: { [field: string]: any }) => {
          if (operations.rowOperations) {
            return this.renderRowOperationComponent({
              children: (operations.rowOperations || []).map((operation, index) => {
                if (operation.type === 'button') {
                  let hidden = false
                  if (operation.condition && operation.condition.statement) {
                    let statement = operation.condition.statement
                    if (operation.condition.params && Array.isArray(operation.condition.params)) {
                      statement = getParamText(operation.condition.statement, operation.condition.params, { record: record, data, step })
                    }
                    try {
                      // eslint-disable-next-line no-eval
                      const result = eval(statement)
                      if (!result) {
                        hidden = true
                      }
                    } catch (e) {
                      console.error('表格列的参数', statement)
                      hidden = false
                    }
                  }
                  return (
                    <React.Fragment key={index}>
                      {hidden
                        ? null
                        : this.renderRowOperationButtonComponent({
                          label: operation.label,
                          level: operation.level || 'normal',
                          onClick: async () => { await this.handleRowOperation(operation, record) }
                        })}
                    </React.Fragment>
                  )
                } else {
                  return (
                    <React.Fragment key={index}>
                      {this.renderRowOperationGroupComponent({
                        label: operation.label,
                        children: (operation.operations || []).map((operation) => {
                          return this.renderRowOperationGroupItemComponent({
                            label: operation.label,
                            level: operation.level || 'normal',
                            onClick: async () => { await this.handleRowOperation(operation, record) }
                          })
                        })
                      })}
                    </React.Fragment>
                  )
                }
              })
            })
          } else {
            return <React.Fragment></React.Fragment>
          }
        }
      })
    }

    const CCMS = this.CCMS

    return (
      <React.Fragment>
        {this.renderComponent(props)}
        {operationEnable && (
          operationTarget === 'current' ? (
            this.renderOperationModal({
              title: operationTitle,
              width,
              visible: operationVisible,
              children: (
                <CCMS
                  config={operationConfig}
                  sourceData={operationData}
                  checkPageAuth={this.props.checkPageAuth}
                  loadPageURL={this.props.loadPageURL}
                  loadPageFrameURL={this.props.loadPageFrameURL}
                  loadPageConfig={this.props.loadPageConfig}
                  loadDomain={this.props.loadDomain}
                  onMount={() => {
                    const { operation } = this.state
                    operation.visible = true
                    this.setState({ operation })
                  }}
                  callback={() => {
                    const { operation } = this.state
                    operation.enable = false
                    operation.visible = false
                    this.setState({ operation })

                    if ((operationCallback && operationCallback === true) || Boolean(operationCallback)) {
                      onUnmount(true)
                    }
                  }}
                />
              ),
              onClose: () => {
                const { operation } = this.state
                operation.enable = false
                operation.visible = false
                this.setState({ operation })
              }
            })
          ) : (
            <CCMS
              config={operationConfig}
              sourceData={operationData}
              checkPageAuth={this.props.checkPageAuth}
              loadPageURL={this.props.loadPageURL}
              loadPageFrameURL={this.props.loadPageFrameURL}
              loadPageConfig={this.props.loadPageConfig}
              loadDomain={this.props.loadDomain}
              onMount={() => {
                const { operation } = this.state
                operation.visible = true
                this.setState({ operation })
              }}
              callback={() => {
                const { operation } = this.state
                operation.enable = false
                operation.visible = false
                this.setState({ operation })

                if ((operationCallback && operationCallback === true) || Boolean(operationCallback)) {
                  onUnmount(true)
                }
              }}
            />
          ) 
        )}
      </React.Fragment >
    )
  }
}
