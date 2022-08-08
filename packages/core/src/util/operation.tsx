import React from 'react'
import queryString from 'query-string'
import { set } from './produce'
import { ParamConfig } from '../interface'
import { CCMSConfig, CCMSProps, PageListItem } from '../main'
import { getParam } from './value'

export type OperationConfig = CCMSOperationConfig

export interface IOperationModal {
  title: string
  content: React.ReactNode
  onClose: () => void
}

/** CCMS内部操作 */
interface _CCMSOperationConfig {
  /** 操作类型：CCMS内部操作 */
  type: 'ccms'

  /** 目标资源 */
  page: unknown

  /** 参数 */
  data: { [key: string]: ParamConfig }
  params?: { field: string; data: ParamConfig }[]
}

/** CCMS模态窗口操作 */
interface CCMSPopupOperationConfig extends _CCMSOperationConfig {
  mode: 'popup'
  label: string
}

/** CCMS重定向操作 */
interface CCMSRedirectOperationConfig extends _CCMSOperationConfig {
  mode: 'redirect'
}

/** CCMS新标签页操作 */
interface CCMSWindowOperationConfig extends _CCMSOperationConfig {
  mode: 'window'
}

/** CCMS无界面操作 */
interface CCMSInvisibleOperationConfig extends _CCMSOperationConfig {
  mode: 'invisible'
}

type CCMSOperationConfig =
  | CCMSPopupOperationConfig
  | CCMSRedirectOperationConfig
  | CCMSWindowOperationConfig
  | CCMSInvisibleOperationConfig

interface OperationHelperProps {
  config?: OperationConfig
  datas: { record: { [field: string]: unknown }; data: object[]; step: { [field: string]: unknown } }
  checkPageAuth: (pageID: unknown) => Promise<boolean>
  loadPageURL: (pageID: unknown) => Promise<string>
  loadPageFrameURL: (pageID: unknown) => Promise<string>
  loadPageConfig: (pageID: unknown) => Promise<CCMSConfig>
  loadPageList: () => Promise<Array<PageListItem>>
  baseRoute: string
  loadDomain: (domain: string) => Promise<string>
  handlePageRedirect?: (path: string, replaceHistory: boolean) => void

  children?: (handleOperation: () => void) => React.ReactNode
  callback?: (success: boolean) => void
}

interface OperationHelperState {
  operationConfig: CCMSConfig | null
  sourceData?: unknown
}

export default class OperationHelper extends React.Component<OperationHelperProps, OperationHelperState> {
  constructor(props: OperationHelperProps) {
    super(props)

    this.state = {
      operationConfig: null
    }
  }

  private handleCCMS(config: CCMSOperationConfig) {
    const { datas, loadPageURL, loadPageFrameURL, loadPageConfig, handlePageRedirect } = this.props
    return async () => {
      if (config.type === 'ccms') {
        let sourceData = {}
        if (config.params === undefined) {
          for (const [field, param] of Object.entries(config.data || {})) {
            const value = getParam(param, datas)
            sourceData = set(sourceData, field, value)
          }
        } else {
          for (const { field, data } of config.params) {
            const value = getParam(data, datas)
            sourceData = set(sourceData, field, value)
          }
        }
        if (config.mode === 'popup' || config.mode === 'invisible') {
          const operationConfig = await loadPageConfig(config.page)
          this.setState({
            operationConfig,
            sourceData
          })
        } else if (config.mode === 'redirect') {
          const sourceURL = await loadPageURL(config.page)
          const { url, query } = queryString.parseUrl(sourceURL, { arrayFormat: 'bracket' })
          if (handlePageRedirect) {
            handlePageRedirect(
              queryString.stringifyUrl({ url, query: { ...query, ...sourceData } }, { arrayFormat: 'bracket' }) || '',
              false
            )
          } else {
            window.location.href =
              queryString.stringifyUrl({ url, query: { ...query, ...sourceData } }, { arrayFormat: 'bracket' }) || ''
          }
        } else if (config.mode === 'window') {
          const sourceURL = await loadPageFrameURL(config.page)
          const { url, query } = queryString.parseUrl(sourceURL, { arrayFormat: 'bracket' })
          window.open(
            queryString.stringifyUrl({ url, query: { ...query, ...sourceData } }, { arrayFormat: 'bracket' }) || ''
          )
        }
      }
    }
  }

  protected renderCCMS: (props: CCMSProps) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现OpertionHelper组件。</>
  }

  protected renderModal: (props: IOperationModal) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现OpertionHelper组件。</>
  }

  render() {
    const {
      config,
      baseRoute,
      checkPageAuth,
      loadPageURL,
      loadPageFrameURL,
      loadPageConfig,
      loadPageList,
      loadDomain,
      handlePageRedirect,
      callback,
      children
    } = this.props
    const { operationConfig, sourceData } = this.state
    if (config) {
      return (
        <>
          {children && children(this.handleCCMS(config))}
          {operationConfig !== null &&
            config.mode === 'popup' &&
            this.renderModal({
              title: config.label,
              content: this.renderCCMS({
                config: operationConfig,
                sourceData,
                baseRoute,
                checkPageAuth,
                loadPageURL,
                loadPageFrameURL,
                loadPageConfig,
                loadPageList,
                loadDomain,
                handlePageRedirect,
                callback: (success) => {
                  this.setState({
                    operationConfig: null,
                    sourceData: null
                  })
                  callback && callback(success)
                }
              }),
              onClose: () => {
                this.setState({
                  operationConfig: null,
                  sourceData: null
                })
                callback && callback(false)
              }
            })}
          {operationConfig !== null &&
            config.mode === 'invisible' &&
            this.renderCCMS({
              config: operationConfig,
              sourceData,
              baseRoute,
              checkPageAuth,
              loadPageURL,
              loadPageFrameURL,
              loadPageConfig,
              loadPageList,
              loadDomain,
              handlePageRedirect,
              callback: (success) => {
                this.setState({
                  operationConfig: null,
                  sourceData: null
                })
                callback && callback(success)
              }
            })}
        </>
      )
    }
    return (
      <>
        {children &&
          children(() => {
            /* 无逻辑 */
          })}
      </>
    )
  }
}
