import React from 'react'
import { cloneDeep } from 'lodash'
import { DetailField, DetailFieldConfig } from '../common'
import OperationHelper, { OperationConfig } from '../../../util/operation'

/**
 * 表格操作配置项
 * - type: 操作类型
 * - actions: 操作按钮配置
 */
export interface OperationDetailConfig extends DetailFieldConfig {
  type: 'operation'
  actions: Array<ActionConfig> | []
}

type ActionConfig = ActionButtonConfig | ActionLinkConfig

export interface ActionButtonConfig {
  type: 'button' // to do group(按钮组)、dropdown(下拉按钮)、dropLink(下拉链接)
  label: string
  level: 'normal' | 'primary' | 'danger'
  handle: OperationConfig
}

export interface ActionLinkConfig {
  type: 'link'
  label: string
  level: 'normal' | 'primary' | 'danger'
  handle: OperationConfig
}

export interface IButtonProps {
  label: string
  level: 'normal' | 'primary' | 'danger'
  onClick: () => void
}

export interface IOperationDetail {
  actions: Array<React.ReactNode>
}

export default class DetailOperation extends DetailField<OperationDetailConfig, IOperationDetail, string> {
  OperationHelper = OperationHelper

  renderComponent = (props: IOperationDetail) => {
    return <>您当前使用的UI版本没有实现OperationDetail组件。</>
  }

  /**
   * button组件
   * @param props
   */
  renderButtonComponent = (props: IButtonProps) => {
    return <>您当前使用的UI版本没有实现OperationDetail的Button组件。</>
  }

  /**
   * link组件
   * @param props
   */
  renderLinkComponent = (props: IButtonProps) => {
    return <>您当前使用的UI版本没有实现OperationDetail的link组件。</>
  }

  state = {
    pageAuth: {}
  }

  /**
   * 页面权限获取状态
   * fulfilled ｜pending
   */
  pageAuth: { [page: string]: boolean } = {}

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

  getValue = () => {
    const {
      value,
      config: { defaultValue }
    } = this.props

    if (value === undefined || value === null || value === '') {
      return defaultValue !== undefined ? defaultValue.toString() : ''
    }
    return value
  }

  /**
   * 处理按钮列表按钮项回调
   * @param action 按钮项配置
   */
  handleCallback = async (action: ActionConfig, success: boolean) => { }

  render = () => {
    const {
      record,
      data,
      step,
      config: { actions }
    } = this.props
    const { pageAuth } = this.state

    const value = this.getValue()
    let actions_
    if (Object.prototype.toString.call(actions) === '[object Array]') {
      actions_ = []
      for (let index = 0, len = actions.length; index < len; index++) {
        let hidden = false
        if (actions[index].handle && actions[index].handle.type === 'ccms') {
          if (actions[index].handle.page !== undefined) {
            this.checkPageAuth(String(actions[index].handle.page))
          }
          hidden = actions[index].handle.page === undefined || !pageAuth[String(actions[index].handle.page)]
          if (hidden) continue
        }
        const OperationHelperWrapper = (
          <this.OperationHelper
            key={index}
            config={actions[index].handle}
            datas={{ record, data, step }}
            checkPageAuth={this.props.checkPageAuth}
            loadPageURL={this.props.loadPageURL}
            loadPageFrameURL={this.props.loadPageFrameURL}
            loadPageConfig={this.props.loadPageConfig}
            loadPageList={this.props.loadPageList}
            baseRoute={this.props.baseRoute}
            loadDomain={this.props.loadDomain}
            handlePageRedirect={this.props.handlePageRedirect}
            callback={async (success) => {
              await this.handleCallback(actions[index], success)
            }}
          >
            {(onClick) => {
              if (actions[index].type === 'button') {
                return this.renderButtonComponent({
                  label: actions[index].label || value,
                  level: actions[index].level,
                  onClick
                })
              }
              if (actions[index].type === 'link') {
                return this.renderLinkComponent({
                  label: actions[index].label || value,
                  level: actions[index].level,
                  onClick
                })
              }
            }}
          </this.OperationHelper>
        )
        actions_.push(OperationHelperWrapper)
      }
    }
    console.log(actions_, 'actions')
    return <> {this.renderComponent({ actions: actions_ })}</>
  }
}
