import React from 'react'
import StatementHelper, { StatementConfig } from '../../../util/statement'
import { DetailField, DetailFieldConfig, IDetailField } from '../common'

/**
 * iLink嵌入组件 格式定义
 * - type:    类型
 * - url:     链接地址
 * - name:    链接名称
 */
export interface LinkDetailConfig extends DetailFieldConfig {
  type: 'link'
  url: StatementConfig
  name?: string
}

export interface ILinkDetail {
  url?: string
  name?: string
}

export default class LinkDetail
  extends DetailField<LinkDetailConfig, ILinkDetail, string>
  implements IDetailField<string>
{
  renderComponent: (props: ILinkDetail) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现ILink组件。</>
  }

  getValue = () => {
    const {
      value,
      config: { defaultValue }
    } = this.props
    if (value === undefined || value === null || value === '') {
      return defaultValue !== undefined ? defaultValue : ''
    }
    return value
  }

  render = () => {
    const {
      config: { url, name }
    } = this.props
    const props: ILinkDetail = {
      name: name || ''
    }
    if (url) {
      props.url = StatementHelper(url, {
        data: this.props.data,
        step: this.props.step,
        containerPath: this.props.containerPath,
        record: this.props.record
      })
      props.name = name || props.url || ''
    }
    return <>{this.renderComponent(props)}</>
  }
}
