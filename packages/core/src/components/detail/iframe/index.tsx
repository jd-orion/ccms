import React from 'react'
import StatementHelper, { StatementConfig } from '../../../util/statement'
import { DetailField, DetailFieldConfig, IDetailField } from '../common'

/**
 * iframe嵌入组件 格式定义
 * - type:    类型
 * - height:  高度
 * - width:   宽度
 */
export interface IframeDetailConfig extends DetailFieldConfig {
  type: 'iframe'
  height?: string | number
  width?: string | number
  url: StatementConfig
}

export interface IIframeDetail {
  url?: string
  height?: string | number
  width?: string | number
}

export default class IframeDetail
  extends DetailField<IframeDetailConfig, IIframeDetail, string>
  implements IDetailField<string>
{
  renderComponent: (props: IIframeDetail) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现Iframe组件。</>
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
      config: { height, width }
    } = this.props
    const props: IIframeDetail = {
      height,
      width
    }
    if (this.props.config.url) {
      props.url = StatementHelper(this.props.config.url, {
        data: this.props.data,
        step: this.props.step,
        containerPath: this.props.containerPath,
        record: {}
      })
    }
    return <>{this.renderComponent(props)}</>
  }
}
