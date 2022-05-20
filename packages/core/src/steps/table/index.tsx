import React from 'react'
import queryString from 'query-string'
import { cloneDeep, get, set } from 'lodash'
import marked from 'marked'
import { getParam, getParamText, getValue } from '../../util/value'
import getALLComponents, { ColumnConfigs } from '../../components/tableColumns'
import Column from '../../components/tableColumns/common'
import Step, { StepConfig, StepProps } from '../common'
import { ParamConfig } from '../../interface'
import ColumnStyleComponent from './common/columnStyle'
import CCMS, { CCMSConfig } from '../../main'
import InterfaceHelper, { InterfaceConfig } from '../../util/interface'
import ConditionHelper, { ConditionConfig } from '../../util/condition'
import StatementHelper, { StatementConfig } from '../../util/statement'
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
  rowOperationsPosition: 'left'
  operations?: {
    tableOperations?: Array<TableOperationsType>
    leftTableOperations?: Array<TableOperationsType>
    rowOperations?: Array<TableOperationsType>
    multirowOperations?: Array<TableOperationsType>
  }
  pagination?: {
    mode: 'none' | 'client' | 'server'
    current?: string
    pageSize?: string
    total?: string
  }
  description?: {
    type: 'text' | 'tooltip' | 'modal'
    label?: StatementConfig
    mode: 'plain' | 'markdown' | 'html'
    content?: StatementConfig
    showIcon: boolean
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
  modalWidthMode?: 'none' | 'percentage' | 'pixel'
  modalWidthValue?: string | number
}

export interface TableCCMSOperationConfig {
  type: 'ccms'
  page: any
  target: 'current' | 'page' | 'open' | 'handle'
  replaceHistory?: boolean
  targetURL: string
  width: string
  data: { [key: string]: ParamConfig }
  params?: { field: string; data: ParamConfig }[]
  callback?: boolean
  closeCallback?: boolean
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

export interface DescriptionConfig {
  type: 'text' | 'tooltip' | 'modal'
  label: string | undefined
  content: React.ReactNode
  showIcon: boolean
}
/**
 * 表格步骤组件 - UI渲染方法 - 入参
 * - data: 数据
 */
export interface ITable {
  title: string | null
  primary: string
  width: string
  data: { [field: string]: any }[]
  columns: ITableColumn[]
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  tableOperations: React.ReactNode | null
  leftTableOperations: React.ReactNode | null
  multirowOperations: React.ReactNode | null
  description?: DescriptionConfig
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
  modalWidthMode?: 'none' | 'percentage' | 'pixel'
  modalWidthValue?: string | number
}

export interface TableState {
  operation: {
    enable: boolean
    target: 'current' | 'handle'
    width: string
    title: string
    visible: boolean
    modalWidthMode?: 'none' | 'percentage' | 'pixel'
    modalWidthValue?: string | number
    config: CCMSConfig
    data: any
    callback?: boolean
    closeCallback?: boolean
  }
  pageAuth: { [page: string]: boolean }
}

/**
 * 表格步骤组件
 */
export default class TableStep extends Step<TableConfig, TableState> {
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

  constructor(props: StepProps<TableConfig>) {
    super(props)

    this.state = {
      operation: {
        enable: false,
        target: 'current',
        title: '',
        width: '400px',
        visible: false,
        config: {},
        data: {},
        callback: false,
        modalWidthMode: 'none',
        modalWidthValue: '',
        closeCallback: false
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

        this.setState({
          operation: {
            enable: true,
            target: operation.handle.target,
            width: operation.handle.width,
            title: operation.label,
            visible: true,
            modalWidthMode: operation.modalWidthMode,
            modalWidthValue: operation.modalWidthValue,
            config: operationConfig,
            data: params,
            callback: operation.handle.callback,
            closeCallback: operation.handle.closeCallback
          }
        })
      } else if (operation.handle.target === 'page') {
        const sourceURL = await this.props.loadPageURL(operation.handle.page)
        const { url, query } = queryString.parseUrl(sourceURL, { arrayFormat: 'bracket' })
        const targetURL = operation.handle.targetURL || ''
        const targetKey =
          queryString.stringifyUrl({ url, query: { ...query, ...params } }, { arrayFormat: 'bracket' }) || ''
        if (this.props.handlePageRedirect) {
          this.props.handlePageRedirect(`${targetURL}${targetKey}`, operation.handle?.replaceHistory || false)
        } else if (operation.handle.replaceHistory) {
          window.location.replace(`${targetURL}${targetKey}`)
        } else {
          window.location.href = `${targetURL}${targetKey}`
        }
      } else if (operation.handle.target === 'open') {
        const sourceURL = await this.props.loadPageFrameURL(operation.handle.page)
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

  checkPageAuth = (page: string) => {
    if (!this.pageAuth[page]) {
      this.pageAuth[page] = true
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
  renderComponent = (props: ITable) => {
    return <>您当前使用的UI版本没有实现Table组件。</>
  }

  renderRowOperationComponent = (props: ITableStepRowOperation) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationButton部分。</>
  }

  renderRowOperationButtonComponent = (props: ITableStepRowOperationButton) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationButton部分。</>
  }

  renderRowOperationGroupComponent = (props: ITableStepRowOperationGroup) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationGroup部分。</>
  }

  renderRowOperationGroupItemComponent = (props: ITableStepRowOperationGroupItem) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationGroupItem部分。</>
  }

  renderRowOperationDropdownComponent = (props: ITableStepRowOperationGroup) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationDropdown部分。</>
  }

  renderRowOperationDropdownItemComponent = (props: ITableStepRowOperationGroupItem) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationDropdownItem部分。</>
  }

  renderTableOperationComponent = (props: ITableStepTableOperation) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationButton部分。</>
  }

  renderTableOperationButtonComponent = (props: ITableStepTableOperationButton) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationButton部分。</>
  }

  renderTableOperationGroupComponent = (props: ITableStepTableOperationGroup) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationGroup部分。</>
  }

  renderTableOperationGroupItemComponent = (props: ITableStepTableOperationGroupItem) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationGroupItem部分。</>
  }

  renderTableOperationDropdownComponent = (props: ITableStepTableOperationGroup) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationDropdown部分。</>
  }

  renderTableOperationDropdownItemComponent = (props: ITableStepTableOperationGroupItem) => {
    return <>您当前使用的UI版本没有实现Table组件的OperationDropdownItem部分。</>
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

  tableOperations = (tableOperationsList: Array<TableOperationsType>, getDate: Array<{}>) => {
    const { pageAuth } = this.state
    return tableOperationsList.length > 0
      ? this.renderTableOperationComponent({
          children: tableOperationsList.map((operation: TableOperationsType, index: number) => {
            if (operation.type === 'button') {
              let hidden = false
              if (operation.handle && operation.handle.type === 'ccms') {
                hidden = operation.handle.page === undefined || !pageAuth[operation.handle.page.toString()]
                operation.handle.page !== undefined && this.checkPageAuth(operation.handle.page.toString())
              }

              return (
                <React.Fragment key={index}>
                  {hidden
                    ? null
                    : this.renderTableOperationButtonComponent({
                        label: operation.label,
                        level: operation.level || 'normal',
                        onClick: async () => {
                          await this.handleRowOperation(operation, getDate)
                        }
                      })}
                </React.Fragment>
              )
            }
            if (operation.type === 'group') {
              return (
                <React.Fragment key={index}>
                  {this.renderTableOperationGroupComponent({
                    label: operation.label,
                    children: (operation.operations || []).map((operation) => {
                      let hidden = false
                      if (operation.handle && operation.handle.type === 'ccms') {
                        hidden = operation.handle.page === undefined || !pageAuth[operation.handle.page.toString()]
                        operation.handle.page !== undefined && this.checkPageAuth(operation.handle.page.toString())
                      }
                      return hidden
                        ? null
                        : this.renderTableOperationGroupItemComponent({
                            label: operation.label,
                            level: operation.level || 'normal',
                            onClick: async () => {
                              await this.handleRowOperation(operation, getDate)
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
                  {this.renderTableOperationDropdownComponent({
                    label: operation.label,
                    children: (operation.operations || []).map((operation) => {
                      let hidden = false
                      if (operation.handle && operation.handle.type === 'ccms') {
                        hidden = operation.handle.page === undefined || !pageAuth[operation.handle.page.toString()]
                        operation.handle.page !== undefined && this.checkPageAuth(operation.handle.page.toString())
                      }
                      return hidden
                        ? null
                        : this.renderTableOperationDropdownItemComponent({
                            label: operation.label,
                            level: operation.level || 'normal',
                            onClick: async () => {
                              await this.handleRowOperation(operation, getDate)
                            }
                          })
                    })
                  })}
                </React.Fragment>
              )
            }
            return <React.Fragment key={index} />
          })
        })
      : null
  }

  render() {
    const {
      config: { field, label, rowOperationsPosition, width, primary, columns, operations, pagination, description },
      data,
      step,
      onUnmount
    } = this.props

    const {
      operation: {
        enable: operationEnable,
        target: operationTarget,
        width: operationWidth,
        title: operationTitle,
        visible: operationVisible,
        config: operationConfig,
        data: operationData,
        callback: operationCallback,
        closeCallback: operationcloseCallback,
        modalWidthMode: operationModalWidthMode,
        modalWidthValue: operationModalWidthValue
      },
      pageAuth
    } = this.state

    let getDate = field ? getValue(step, field) : step
    if (Object.prototype.toString.call(getDate) !== '[object Array]') {
      getDate = []
    }
    const props: ITable = {
      title: label,
      width,
      primary,
      data: getDate,
      columns: (columns || [])
        .filter((column) => column.field !== undefined && column.field !== '')
        .map((column, index) => {
          const field = column.field.split('.')[0]
          return {
            field,
            label: column.label,
            align: column.align,
            render: (value: any, record: { [field: string]: any }) => {
              if (value && Object.prototype.toString.call(value) === '[object Object]') {
                value = getValue(value, column.field.replace(field, '').slice(1))
              }

              const Column = this.getALLComponents(column.type)
              if (Column) {
                const addfix = ['multirowText'].some((val) => val !== column.field)
                return (
                  <ColumnStyleComponent key={index} style={column.style} addfix={addfix}>
                    <Column
                      ref={() => {}}
                      record={record}
                      value={value}
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
        }),
      tableOperations: this.tableOperations(operations?.tableOperations || [], getDate),
      leftTableOperations: this.tableOperations(operations?.leftTableOperations || [], getDate),
      multirowOperations: null
    }
    if (description) {
      if (description.type === 'text') {
        props.description = {
          type: 'text',
          label: StatementHelper(description.label, { data: this.props.data, step: this.props.step }),
          content: description.content,
          showIcon: description.showIcon
        }
      } else if (description.type === 'tooltip') {
        props.description = {
          type: 'tooltip',
          label: StatementHelper(description.label, { data: this.props.data, step: this.props.step }),
          content: description.content,
          showIcon: description.showIcon
        }
      } else {
        props.description = {
          type: 'modal',
          label: StatementHelper(description.label, { data: this.props.data, step: this.props.step }),
          content: description.content,
          showIcon: description.showIcon
        }
      }
      if (description.content !== undefined) {
        const descriptionType = description.mode
        switch (descriptionType) {
          case 'plain':
            props.description &&
              (props.description.content = StatementHelper(description.content, {
                data: this.props.data,
                step: this.props.step
              }))
            break
          case 'markdown':
            props.description &&
              (props.description.content = (
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(
                      StatementHelper(description.content, { data: this.props.data, step: this.props.step })
                    )
                  }}
                />
              ))
            break
          case 'html':
            props.description &&
              (props.description.content = (
                <div
                  dangerouslySetInnerHTML={{
                    __html: StatementHelper(description.content, { data: this.props.data, step: this.props.step })
                  }}
                />
              ))
            break
        }
      }
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
        this.props.onUnmount(true, {
          [pagination.current || '']: 1,
          [pagination.pageSize || '']: props.pagination.pageSize
        })
      }
    }

    if (operations && operations.rowOperations && operations.rowOperations.length > 0) {
      const rowOperationData: ITableColumn = {
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
                if (operation.type === 'group' || operation.type === 'dropdown') {
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
      }

      if (rowOperationsPosition === 'left') {
        props.columns.unshift(rowOperationData)
      } else {
        props.columns.push(rowOperationData)
      }
    }

    const { CCMS } = this

    return (
      <>
        {this.renderComponent(props)}
        {operationEnable &&
          (operationTarget === 'current' ? (
            this.renderOperationModal({
              title: operationTitle,
              width: operationWidth,
              visible: operationVisible,
              modalWidthMode: operationModalWidthMode,
              modalWidthValue: operationModalWidthValue,
              children: (
                <CCMS
                  config={operationConfig}
                  sourceData={operationData}
                  baseRoute={this.props.baseRoute}
                  checkPageAuth={this.props.checkPageAuth}
                  loadPageURL={this.props.loadPageURL}
                  loadPageFrameURL={this.props.loadPageFrameURL}
                  loadPageConfig={this.props.loadPageConfig}
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
                      onUnmount(true)
                    }
                  }}
                />
              ),
              onClose: () => {
                const { operation } = this.state
                operation.enable = false
                operation.visible = false
                if ((operationcloseCallback && operationcloseCallback === true) || Boolean(operationcloseCallback)) {
                  onUnmount(true)
                }
                this.setState({ operation })
              }
            })
          ) : (
            <CCMS
              config={operationConfig}
              sourceData={operationData}
              baseRoute={this.props.baseRoute}
              checkPageAuth={this.props.checkPageAuth}
              loadPageURL={this.props.loadPageURL}
              loadPageFrameURL={this.props.loadPageFrameURL}
              loadPageConfig={this.props.loadPageConfig}
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
                  onUnmount(true)
                }
              }}
            />
          ))}
      </>
    )
  }
}
