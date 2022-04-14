import React from 'react'
import Column, { ColumnConfig } from '../common'

/**
 * 表格文本配置项
 * - type: 文本类型
 * - linkUrl: 可跳转文本超链接，临时方案，后续优化。
 * - showLines: 显示行数多行省略
 * - showMore: 查看更多 showLines 大于1时显示
 */
export interface TextColumnConfig extends ColumnConfig {
  type: 'text'
  // 临时方案 后续优化
  linkUrl: boolean
  showLines?: number
  showMore?: boolean
}

export interface ITextColumn {
  value: string
  linkUrl: boolean
  showLines?: number
  showMore?: boolean
}

export default class TextColumn extends Column<TextColumnConfig, ITextColumn> {
  renderComponent = (props: ITextColumn) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现TextColumn组件。
    </React.Fragment>
  }

  getValue= () => {
    const {
      value,
      config: {
        defaultValue
      }
    } = this.props

    if (value === undefined || value === null || value === '') {
      return defaultValue !== undefined ? defaultValue : ''
    }
    return value
  }

  render = () => {
    const {
      config: {
        linkUrl,
        showLines,
        showMore
      }
    } = this.props

    const value = this.getValue()

    return (
      <React.Fragment>
        {this.renderComponent({ value, linkUrl, showLines, showMore })}
      </React.Fragment>
    )
  }
}
