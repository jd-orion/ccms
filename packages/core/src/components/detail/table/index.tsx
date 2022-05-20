import React from 'react'
import queryString from 'query-string'
import { cloneDeep, get, set } from 'lodash'
import { getParam, getParamText, getValue } from '../../../util/value'
import { DetailField, DetailFieldConfig, IDetailField, DetailFieldProps } from '../common'
import getALLComponents, { ColumnConfigs } from '../../tableColumns'
import CCMS, { CCMSConfig } from '../../../main'
import InterfaceHelper, { InterfaceConfig } from '../../../util/interface'
import ConditionHelper, { ConditionConfig } from '../../../util/condition'
import { ParamConfig } from '../../../interface'
import ColumnStyleComponent from './common/columnStyle'
import Column from '../../tableColumns/common'

export interface TableFieldConfig extends DetailFieldConfig {
  type: 'table'
  primary: string
  tableColumns: ColumnConfigs[]
  operations?: {
    rowOperations?: Array<TableOperationsType>
  }
  pagination?: {
    mode: 'none' | 'client' | 'server'
    current?: string
    pageSize?: string
    total?: string
  }
}

/**
 * 表格步骤-菜单配置
 */
export type TableOperationsType = TableOperationConfig | TableOperationGroupConfig | TableOperationDropdownConfig

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
 * 表格步骤-操作配置文件下拉菜单
 */
export interface TableOperationDropdownConfig {
  type: 'dropdown'
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
  handle: TableCCMSOperationConfig | TableLinkOperationConfig
  condition?: ConditionConfig
}

export interface TableCCMSOperationConfig {
  type: 'ccms'
  page: any
  target: 'current' | 'page' | 'open' | 'handle'
  targetURL: string
  data: { [key: string]: ParamConfig }
  params?: { field: string; data: ParamConfig }[]
  callback?: boolean
  debug?: boolean
}

export interface TableLinkOperationConfig {
  type: 'link'
  target: '_blank' | '_self'
  targetURL: string
  params?: { field: string; data: ParamConfig }[]
  callback?: boolean
  debug?: boolean
}

interface TableOperationCheckConfig {
  enable: true
  interface: InterfaceConfig
}

interface TableOperationConfirmConfig {
  enable: true
  titleText: string
  titleParams?: Array<{ field: string; data: ParamConfig }>
  okText: string
  cancelText: string
}

/**
 * 表格步骤组件 - 列 - UI渲染方法 - 入参
 */
export interface ITableColumn {
  field: string
  label: string
  align: 'left' | 'center' | 'right'
  render: (value: any, record: { [type: string]: any }, index: number) => React.ReactNode
}

/**
 * 表格步骤组件 - 操作 - UI渲染方法 - 入参
 */
export interface ITableDetailRowOperation {
  children: (React.ReactNode | undefined)[]
}

/**
 * 表格步骤组件 - 操作 - UI渲染方法 - 入参
 */
export interface ITableDetailTableOperation {
  children: (React.ReactNode | undefined)[]
}

/**
 * 表格步骤组件 - 操作按钮 - UI渲染方法 - 入参
 */
export interface ITableDetailRowOperationButton {
  label: string
  level: 'normal' | 'primary' | 'danger'
  disabled?: boolean
  onClick: () => Promise<void>
}

/**
 * 表格步骤组件 - 操作按钮组 - UI渲染方法 - 入参
 */
export interface ITableDetailRowOperationGroup {
  label?: string
  children: React.ReactNode[]
}

/**
 * 表格步骤组件 - 操作按钮组元素 - UI渲染方法 - 入参
 */
export interface ITableDetailRowOperationGroupItem {
  label: string
  level: 'normal' | 'primary' | 'danger'
  disabled?: boolean
  onClick: () => Promise<void>
}

/**
 * 表格步骤组件 - 操作按钮 - UI渲染方法 - 入参
 */
export interface ITableDetailTableOperationButton {
  label: string
  level: 'normal' | 'primary' | 'danger'
  disabled?: boolean
  onClick: () => Promise<void>
}

/**
 * 表格步骤组件 - 操作按钮组 - UI渲染方法 - 入参
 */
export interface ITableDetailTableOperationGroup {
  label?: string
  children: React.ReactNode[]
}

/**
 * 表格步骤组件 - 操作按钮组元素 - UI渲染方法 - 入参
 */
export interface ITableDetailTableOperationGroupItem {
  label: string
  level: 'normal' | 'primary' | 'danger'
  disabled?: boolean
  onClick: () => Promise<void>
}

/**
 * 表格步骤组件 - 操作 - 二次确认 - UI渲染方法 - 入参
 */
export interface ITableDetailOperationConfirm {
  title: string
  okText: string
  cancelText: string
  onOk: () => void
  onCancel: () => void
}

export interface ITableDetailOperationModal {
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
  pageAuth: { [page: string]: boolean }
}

/**
 * 表格步骤组件 - UI渲染方法 - 入参
 * - data: 数据
 */
export interface ITableField {
  title: string | null
  primary: string
  data: { [field: string]: any }[]
  tableColumns: ITableColumn[]
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  // tableOperations: React.ReactNode | null
  // multirowOperations: React.ReactNode | null,
  description?: {
    type: 'text' | 'tooltip' | 'modal'
    label: string | undefined
    content: React.ReactNode
    showIcon: boolean
  }
}

export default class TableField
  extends DetailField<TableFieldConfig, ITableField, string, TableState>
  implements IDetailField<string>
{
  CCMS = CCMS

  getALLComponents = (type: any): typeof Column => getALLComponents[type]

  interfaceHelper = new InterfaceHelper()

  /**
   * 页面权限获取状态
   * fulfilled ｜pending
   */
  pageAuth: { [page: string]: boolean } = {}

  /* 服务端分页情况下页码溢出标识：页码溢出时退回重新请求，此标识符用于防止死循环判断 */
  pageOverflow = false

  constructor(props: DetailFieldProps<TableFieldConfig, any>) {
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
      },
      pageAuth: {}
    }
  }

  /**
   * 执行操作
   * @param operation
   * @param record
   * @returns
   */
  handleRowOperation = async (operation: TableOperationConfig, record: { [field: string]: any }) => {
    const { data, step } = this.props
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
      const title = operation.confirm.titleParams
        ? await getParamText(operation.confirm.titleText, operation.confirm.titleParams, { record, data, step })
        : operation.confirm.titleText
      const showConfirm = () => {
        return new Promise((resolve, reject) => {
          if (operation.confirm && operation.confirm.enable) {
            this.renderOperationConfirm({
              title,
              okText: operation.confirm.okText,
              cancelText: operation.confirm.cancelText,
              onOk: () => {
                resolve(true)
              },
              onCancel: () => {
                reject(new Error('用户取消'))
              }
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
      if (operation.handle.params === undefined) {
        for (const [field, param] of Object.entries(operation.handle.data || {})) {
          const value = getParam(param, { record, data, step })
          set(params, field, value)
        }
      } else {
        for (const { field, data: dataConfig } of operation.handle.params) {
          const value = getParam(dataConfig, { record, data, step })
          set(params, field, value)
        }
      }
      if (operation.handle.debug) {
        console.log('CCMS debug: operation - params', params)
      }
      if (operation.handle.target === 'current' || operation.handle.target === 'handle') {
        const operationConfig = await this.props.loadPageConfig(operation.handle.page)
        const obj = {
          operation: {
            enable: true,
            target: operation.handle.target,
            title: operation.label,
            visible: true,
            config: operationConfig,
            data: params,
            callback: operation.handle.callback
          }
        }
        this.setState(obj)
      } else if (operation.handle.target === 'page') {
        const sourceURL = this.props.loadPageURL ? await this.props.loadPageURL(operation.handle.page) : ''
        const { url, query } = queryString.parseUrl(sourceURL, { arrayFormat: 'bracket' })
        const targetURL = operation.handle.targetURL || ''
        const targetKey =
          queryString.stringifyUrl({ url, query: { ...query, ...params } }, { arrayFormat: 'bracket' }) || ''
        if (this.props.handlePageRedirect) {
          this.props.handlePageRedirect(`${targetURL}${targetKey}`)
        } else {
          window.location.href = `${targetURL}${targetKey}`
        }
      } else if (operation.handle.target === 'open') {
        const sourceURL = this.props.loadPageFrameURL ? await this.props.loadPageFrameURL(operation.handle.page) : ''
        const { url, query } = queryString.parseUrl(sourceURL, { arrayFormat: 'bracket' })
        const targetURL = operation.handle.targetURL || ''
        const targetKey =
          queryString.stringifyUrl({ url, query: { ...query, ...params } }, { arrayFormat: 'bracket' }) || ''
        window.open(`${targetURL}${targetKey}`)
      }
    }

    //  当按钮的响应类型是第三方链接时
    if (operation.handle.type === 'link') {
      const params = {}
      if (operation.handle.params !== undefined) {
        for (const { field, data: dataConfig } of operation.handle.params) {
          const value = getParam(dataConfig, { record, data, step })
          set(params, field, value)
        }

        if (operation.handle.debug) {
          console.log('CCMS debug: operation - operation.handle.type === link', params)
        }

        const { targetURL } = operation.handle
        const { query } = queryString.parseUrl(targetURL, { arrayFormat: 'bracket' })
        const targetKey =
          queryString.stringifyUrl({ url: '', query: { ...query, ...params } }, { arrayFormat: 'bracket' }) || ''
        const jumpUrl = `${targetURL}${targetKey}`
        if (operation.handle.target === '_blank') {
          window.open(jumpUrl)
        } else {
          window.location.href = jumpUrl
        }
      }
    }
  }

  /**
   * 渲染 操作二次确认弹窗
   * @param props
   */
  renderOperationConfirm = (props: ITableDetailOperationConfirm) => {
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

  checkPageAuth = (page: string) => {
    if (!this.pageAuth[page]) {
      this.pageAuth[page] = true

      this.props.checkPageAuth &&
        this.props.checkPageAuth(page).then((auth) => {
          const pageAuth = cloneDeep(this.state.pageAuth)
          pageAuth[page] = auth
          this.setState({ pageAuth })
        })
    }
  }

  /**
   * 渲染 表格
   * @param props
   * @returns
   */
  renderComponent = (props: ITableField) => {
    return (
      <>
        您当前使用的UI版本没有实现Table组件。
        <div style={{ display: 'none' }} />
      </>
    )
  }

  renderRowOperationComponent = (props: ITableDetailRowOperation) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationButton部分。</>
  }

  renderRowOperationButtonComponent = (props: ITableDetailRowOperationButton) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationButton部分。</>
  }

  renderRowOperationGroupComponent = (props: ITableDetailRowOperationGroup) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationGroup部分。</>
  }

  renderRowOperationGroupItemComponent = (props: ITableDetailRowOperationGroupItem) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationGroupItem部分。</>
  }

  renderRowOperationDropdownComponent = (props: ITableDetailRowOperationGroup) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationDropdown部分。</>
  }

  renderRowOperationDropdownItemComponent = (props: ITableDetailRowOperationGroupItem) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationDropdownItem部分。</>
  }

  renderOperationModal = (props: ITableDetailOperationModal) => {
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

  render = () => {
    const {
      config: {
        field,
        label,
        // width,
        primary,
        tableColumns,
        operations,
        pagination
        // description
      },
      data,
      step,
      onUnmount,
      value
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
      },
      pageAuth
    } = this.state

    const getDate = value && Array.isArray(value) ? value : []
    const props: ITableField = {
      title: label,
      primary,
      data: getDate,
      tableColumns: (tableColumns || [])
        .filter((column) => column.field !== undefined && column.field !== '')
        .map((column, index) => {
          const field = column.field.split('.')[0]
          return {
            field,
            label: column.label,
            align: column.align,
            render: (value: any, record: { [field: string]: any }) => {
              let tempValue = value
              if (tempValue && Object.prototype.toString.call(tempValue) === '[object Object]') {
                tempValue = getValue(tempValue, column.field.replace(field, '').slice(1))
              }

              const Column = this.getALLComponents(column.type)
              if (Column) {
                const addfix = ['multirowText'].some((val) => val !== column.field)
                return (
                  <ColumnStyleComponent key={index} style={column.style} addfix={addfix}>
                    <Column
                      ref={() => {}}
                      record={record}
                      value={tempValue}
                      data={data}
                      step={step}
                      config={column}
                      table={this}
                      baseRoute={this.props.baseRoute}
                      onUnmount={this.props.onUnmount}
                      checkPageAuth={this.props.checkPageAuth}
                      loadPageURL={this.props.loadPageURL}
                      loadPageFrameURL={this.props.loadPageFrameURL}
                      loadPageConfig={this.props.loadPageConfig}
                      loadPageList={this.props.loadPageList}
                      loadDomain={async (domain: string) => await this.props.loadDomain(domain)}
                    />
                  </ColumnStyleComponent>
                )
              }
            }
          }
        })
    }
    if (pagination && pagination.mode === 'server') {
      const paginationCurrent = Number(
        pagination.current === undefined || pagination.current === '' ? step : get(step, pagination.current, 1)
      )
      const paginationPageSize = Number(
        pagination.pageSize === undefined || pagination.pageSize === '' ? step : get(step, pagination.pageSize, 10)
      )
      const paginationTotal = Number(
        pagination.total === undefined || pagination.total === '' ? step : get(step, pagination.total, 0)
      )

      props.pagination = {
        current: Number.isNaN(paginationCurrent) ? 1 : paginationCurrent,
        pageSize: Number.isNaN(paginationPageSize) ? 10 : paginationPageSize,
        total: Number.isNaN(paginationTotal) ? 0 : paginationTotal,
        onChange: (page, pageSize) => {
          this.props.onUnmount &&
            this.props.onUnmount(true, {
              [pagination.current || '']: page,
              [pagination.pageSize || '']: pageSize
            })
        }
      }

      if (
        !this.pageOverflow &&
        props.pagination.current > 1 &&
        (props.pagination.current - 1) * props.pagination.pageSize >= props.pagination.total
      ) {
        this.pageOverflow = true
        this.props.onUnmount &&
          this.props.onUnmount(true, {
            [pagination.current || '']: 1,
            [pagination.pageSize || '']: props.pagination.pageSize
          })
      }
    }

    if (operations && operations.rowOperations && operations.rowOperations.length > 0) {
      props.tableColumns.push({
        field: 'ccms-table-rowOperation',
        label: '操作',
        align: 'left',
        render: (_value: any, record: { [field: string]: any }) => {
          if (operations.rowOperations) {
            return this.renderRowOperationComponent({
              children: (operations.rowOperations || []).map((operation, index) => {
                if (operation.type === 'button') {
                  if (!ConditionHelper(operation.condition, { record, data, step })) {
                    return null
                  }

                  let hidden = false
                  if (operation.handle && operation.handle.type === 'ccms') {
                    hidden = operation.handle.page === undefined || !pageAuth[operation.handle.page.toString()]
                    operation.handle.page !== undefined && this.checkPageAuth(operation.handle.page.toString())
                  }
                  return (
                    <React.Fragment key={index}>
                      {hidden
                        ? null
                        : this.renderRowOperationButtonComponent({
                            label: operation.label,
                            level: operation.level || 'normal',
                            onClick: async () => {
                              await this.handleRowOperation(operation, record)
                            }
                          })}
                    </React.Fragment>
                  )
                }
                if (operation.type === 'group') {
                  return (
                    <React.Fragment key={index}>
                      {this.renderRowOperationGroupComponent({
                        label: operation.label,
                        children: (operation.operations || []).map((operation) => {
                          if (!ConditionHelper(operation.condition, { record, data, step })) {
                            return null
                          }

                          let hidden = false
                          if (operation.handle && operation.handle.type === 'ccms') {
                            hidden = operation.handle.page === undefined || !pageAuth[operation.handle.page.toString()]
                            operation.handle.page !== undefined && this.checkPageAuth(operation.handle.page.toString())
                          }

                          return hidden
                            ? null
                            : this.renderRowOperationGroupItemComponent({
                                label: operation.label,
                                level: operation.level || 'normal',
                                onClick: async () => {
                                  await this.handleRowOperation(operation, record)
                                }
                              })
                        })
                      })}
                    </React.Fragment>
                  )
                }
                if (operation.type === 'dropdown') {
                  return (
                    <React.Fragment key={index}>
                      {this.renderRowOperationDropdownComponent({
                        label: operation.label,
                        children: (operation.operations || []).map((operation) => {
                          if (!ConditionHelper(operation.condition, { record, data, step })) {
                            return null
                          }

                          let hidden = false
                          if (operation.handle && operation.handle.type === 'ccms') {
                            hidden = operation.handle.page === undefined || !pageAuth[operation.handle.page.toString()]
                            operation.handle.page !== undefined && this.checkPageAuth(operation.handle.page.toString())
                          }

                          return hidden
                            ? null
                            : this.renderRowOperationDropdownItemComponent({
                                label: operation.label,
                                level: operation.level || 'normal',
                                onClick: async () => {
                                  await this.handleRowOperation(operation, record)
                                }
                              })
                        })
                      })}
                    </React.Fragment>
                  )
                }
                return <></>
              })
            })
          }
          return <></>
        }
      })
    }

    const { CCMS } = this
    return (
      <>
        {this.renderComponent(props)}
        {operationEnable &&
          (operationTarget === 'current' ? (
            this.renderOperationModal({
              title: operationTitle,
              width: '500',
              visible: operationVisible,
              children: (
                <CCMS
                  checkPageAuth={this.props.checkPageAuth}
                  loadPageURL={this.props.loadPageURL}
                  loadPageFrameURL={this.props.loadPageFrameURL}
                  loadPageConfig={this.props.loadPageConfig}
                  loadPageList={this.props.loadPageList}
                  config={operationConfig}
                  sourceData={operationData}
                  baseRoute={this.props.baseRoute}
                  loadDomain={this.props.loadDomain}
                  handlePageRedirect={this.props.handlePageRedirect}
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
                      onUnmount && onUnmount(true)
                    }
                  }}
                />
              ),
              onClose: () => {
                const { operation } = this.state
                operation.enable = false
                operation.visible = false
                if ((operationCallback && operationCallback === true) || Boolean(operationCallback)) {
                  onUnmount && onUnmount(true)
                }
                this.setState({ operation })
              }
            })
          ) : (
            <CCMS
              config={operationConfig}
              sourceData={operationData}
              baseRoute={this.props.baseRoute}
              checkPageAuth={this.props.checkPageAuth as (pageID: any) => Promise<boolean>}
              loadPageURL={this.props.loadPageURL as (pageID: any) => Promise<string>}
              loadPageFrameURL={this.props.loadPageFrameURL as (pageID: any) => Promise<string>}
              loadPageConfig={this.props.loadPageConfig as (pageID: any) => Promise<CCMSConfig>}
              loadPageList={this.props.loadPageList}
              loadDomain={this.props.loadDomain}
              handlePageRedirect={this.props.handlePageRedirect}
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
                  onUnmount && onUnmount(true)
                }
              }}
            />
          ))}
      </>
    )
  }
}
