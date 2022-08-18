import React from 'react'
import marked from 'marked'
import { CCMSConfig, PageListItem } from '../main'
import StatementHelper from '../util/statement'

/**
 * 页面流转步骤基类配置定义
 * - type: 类型，对应各子类
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StepConfig {}

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
  data: object[]
  step: { [field: string]: unknown }
  config: C
  onChange?: (data: unknown) => Promise<void>
  onSubmit: (data: unknown, unmountView?: boolean) => Promise<void>
  onMount: () => Promise<void>
  onUnmount: (reload?: boolean, data?: unknown) => Promise<void>
  checkPageAuth: (pageID: unknown) => Promise<boolean>
  loadPageURL: (pageID: unknown) => Promise<string>
  loadPageFrameURL: (pageID: unknown) => Promise<string>
  loadPageConfig: (pageID: unknown) => Promise<CCMSConfig>
  loadPageList: () => Promise<Array<PageListItem>>
  baseRoute: string
  loadDomain: (domain: string) => Promise<string>
  handlePageRedirect?: (path: string, replaceHistory: boolean) => void
  handleFormValue?: (payload: object) => object
}

/**
 * 页面步骤基类
 */
export default class Step<C extends StepConfig, S = unknown> extends React.Component<StepProps<C>, S> {
  /**
   * 步骤 根据mode不同，处理subLabel内容\
   * @param config 子项config
   * @returns
   */

  handleSubLabelContent(config) {
    const { data, step } = this.props
    if (config?.subLabelConfig?.enable) {
      const content = StatementHelper(
        {
          statement: config.subLabelConfig?.content?.statement || '',
          params: config.subLabelConfig?.content?.params || []
        },
        {
          data,
          step,
          containerPath: '',
          record: {}
        }
      ).replace(/(^\s*)|(\s*$)/g, '')
      const mode = config.subLabelConfig?.mode
      switch (mode) {
        case 'markdown':
          // eslint-disable-next-line react/no-danger
          return <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
        case 'html':
          // eslint-disable-next-line react/no-danger
          return <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: content }} />
        default:
          return <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
      }
    }
    return undefined
  }

  stepPush = () => {
    const { onMount } = this.props
    onMount()
  }

  stepPop: (reload?: boolean, data?: unknown) => void = (reload = false) => {
    const { onMount, onUnmount } = this.props
    if (reload) {
      onMount()
    } else {
      onUnmount()
    }
  }

  render() {
    return <></>
  }
}
