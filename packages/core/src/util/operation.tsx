import React from 'react';
import queryString from 'query-string';
import { set } from "lodash";
import { ParamConfig } from "../interface";
import { CCMSConfig, CCMSProps } from "../main";
import { getParam } from "./value";

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
  page: any

  /** 参数 */
  data: { [key: string]: ParamConfig }
  params?: { field: string, data: ParamConfig }[]
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

type CCMSOperationConfig = CCMSPopupOperationConfig | CCMSRedirectOperationConfig | CCMSWindowOperationConfig | CCMSInvisibleOperationConfig

interface OperationHelperProps {
  config?: OperationConfig, 
  datas: { record?: object, data: object[], step: number },
  checkPageAuth: (pageID: any) => Promise<boolean>,
  loadPageURL: (pageID: any) => Promise<string>,
  loadPageFrameURL: (pageID: any) => Promise<string>,
  loadPageConfig: (pageID: any) => Promise<CCMSConfig>,
  baseRoute: string,
  loadDomain: (domain: string) => Promise<string>
  handlePageRedirect?: (path: string, replaceHistory: boolean) => void

  children?: (handleOperation: () => void) => React.ReactNode
  callback?: (success: boolean) => void
}

interface OperationHelperState {
  operationConfig: CCMSConfig | null
  sourceData?: any
}

export default class OperationHelper extends React.Component<OperationHelperProps, OperationHelperState> {
  constructor (props: OperationHelperProps) {
    super(props)

    this.state = {
      operationConfig: null
    }
  }
  
  protected renderModal (props: IOperationModal) {
    return <React.Fragment>
      您当前使用的UI版本没有实现OpertionHelper组件。
    </React.Fragment>
  }

  protected renderCCMS (props: CCMSProps) {
    return <React.Fragment>
      您当前使用的UI版本没有实现OpertionHelper组件。
    </React.Fragment>
  }

  private handleCCMS (config: CCMSOperationConfig) {
    const {
      datas,
      loadPageURL,
      loadPageFrameURL,
      loadPageConfig,
      handlePageRedirect
    } = this.props
    return async () => {
      if (config.type === 'ccms') {
        const sourceData = {}
        if (config.params === undefined) {
          for (const [field, param] of Object.entries(config.data || {})) {
            const value = getParam(param, datas)
            set(sourceData, field, value)
          }
        } else {
          for (const {field, data} of config.params) {
            const value = getParam(data, datas)
            set(sourceData, field, value)
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
            handlePageRedirect(queryString.stringifyUrl({ url, query: { ...query, ...sourceData } }, { arrayFormat: 'bracket' }) || '', false)
          } else {
            window.location.href = queryString.stringifyUrl({ url, query: { ...query, ...sourceData } }, { arrayFormat: 'bracket' }) || ''
          }
        } else if (config.mode === 'window') {
          const sourceURL = await loadPageFrameURL(config.page)
          const { url, query } = queryString.parseUrl(sourceURL, { arrayFormat: 'bracket' })
          window.open(queryString.stringifyUrl({ url, query: { ...query, ...sourceData } }, { arrayFormat: 'bracket' }) || '')
        }
      }
    }
  }


  render () {
    if (this.props.config) {
      return (
        <React.Fragment>
          {this.props.children && this.props.children(this.handleCCMS(this.props.config))}
          {this.state.operationConfig !== null && this.props.config.mode === 'popup' && (
            this.renderModal({
              title: this.props.config.label,
              content: this.renderCCMS({
                config: this.state.operationConfig,
                sourceData: this.state.sourceData,
                baseRoute: this.props.baseRoute,
                checkPageAuth: this.props.checkPageAuth,
                loadPageURL: this.props.loadPageURL,
                loadPageFrameURL: this.props.loadPageFrameURL,
                loadPageConfig: this.props.loadPageConfig,
                loadDomain: this.props.loadDomain,
                handlePageRedirect: this.props.handlePageRedirect,
                callback: (success) => {
                  this.setState({
                    operationConfig: null,
                    sourceData: null
                  })
                  this.props.callback && this.props.callback(success)
                }
              }),
              onClose: () => {
                this.setState({
                  operationConfig: null,
                  sourceData: null
                })
                this.props.callback && this.props.callback(false)
              }
            })
          )}
          {this.state.operationConfig !== null && this.props.config.mode === 'invisible' && (
            this.renderCCMS({
              config: this.state.operationConfig,
              sourceData: this.state.sourceData,
              baseRoute: this.props.baseRoute,
              checkPageAuth: this.props.checkPageAuth,
              loadPageURL: this.props.loadPageURL,
              loadPageFrameURL: this.props.loadPageFrameURL,
              loadPageConfig: this.props.loadPageConfig,
              loadDomain: this.props.loadDomain,
              handlePageRedirect: this.props.handlePageRedirect,
              callback: (success) => {
                this.setState({
                  operationConfig: null,
                  sourceData: null
                })
                this.props.callback && this.props.callback(success)
              }
            })
          )}
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          {this.props.children && this.props.children(() => {})}
        </React.Fragment>
      )
    }
  }
}