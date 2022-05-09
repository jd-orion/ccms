import React from 'react'
import marked from 'marked'
import { CCMSConfig, PageListItem } from '../main'
import StatementHelper from '../util/statement'

/**
 * 页面流转步骤基类配置定义
 * - type: 类型，对应各子类
 */
export interface StepConfig {
}

/**
 * 页面步骤基类 - 入参格式
 * - ref:      页面步骤示例
 * - data:     各步骤数据
 * - step:     当前步骤索引
 * - config:   当前步骤配置文件
 * - onSubmit: 页面步骤的提交事件
 * - onView:   页面步骤的界面切换事件
 */
export interface StepProps<C extends StepConfig> {
  ref: (instance: Step<C> | null) => void
  data: any[]
  step: {[field: string]: any}
  config: C
  onChange?: (data: any) => Promise<void>
  onSubmit: (data: any, unmountView?: boolean) => Promise<void>
  onMount: () => Promise<void>
  onUnmount: (reload?: boolean, data?: any) => Promise<void>
  checkPageAuth: (pageID: any) => Promise<boolean>
  loadPageURL: (pageID: any) => Promise<string>
  loadPageFrameURL: (pageID: any) => Promise<string>
  loadPageConfig: (pageID: any) => Promise<CCMSConfig>
  loadPageList: () => Promise<Array<PageListItem>>
  baseRoute: string
  loadDomain: (domain: string) => Promise<string>
  handlePageRedirect?: (path: string, replaceHistory: boolean) => void
  handleFormValue?: (payload: object) => object
}

/**
 * 页面步骤基类
 */
export default class Step<C extends StepConfig, S = {}> extends React.Component<StepProps<C>, S> {
  static defaultProps = {
    config: {
    }
  };


/**
 * 步骤 根据mode不同，处理subLabel内容\
 * @param config 子项config
 * @returns 
 */

  handleSubLabelContent (config) {
    if (config?.subLabelConfig?.enable) {
      const content  = StatementHelper({ statement: config.subLabelConfig?.content?.statement || '', params: config.subLabelConfig?.content?.params || [] }, { data: this.props.data, step: this.props.step }).replace(/(^\s*)|(\s*$)/g, '')
      const mode = config.subLabelConfig?.mode
      switch (mode) {
        case 'markdown':
          return <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        case 'html': 
          return <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: content }}></div>
      }
      return <div style={{ whiteSpace: 'pre-wrap' }} >{content}</div>
    }
    return undefined
  }

  stepPush = () => {
    this.props.onMount()
  }

  stepPop = (reload: boolean = false, data?: any) => {
    if (reload) {
      this.props.onMount()
    } else {
      this.props.onUnmount()
    }
  }

  render () {
    return <></>
  }
}
