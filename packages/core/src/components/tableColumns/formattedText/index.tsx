import React from 'react'
import StatementHelper, { StatementConfig } from '../../../util/statement'
import Column, { ColumnConfig } from '../common'

/**
 * 表格文本配置项
 * - type: 文本类型
 * - linkUrl: 可跳转文本超链接，临时方案，后续优化。
 * - showLines: 显示行数多行省略
 * - showMore: 查看更多 showLines 大于1时显示
 */
export interface FormattedTextColumnConfig extends ColumnConfig {
  type: 'formatted_text'
  statement: StatementConfig
}

export interface IFormattedTextColumn {
  text: string
}

export default class FormattedTextColumn extends Column<FormattedTextColumnConfig, IFormattedTextColumn> {
  renderComponent: (props: IFormattedTextColumn) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormattedTextColumn组件。</>
  }

  getValue = () => {
    const {
      config: { statement }
    } = this.props

    return StatementHelper(statement, { record: this.props.record, data: this.props.data, step: this.props.step })
  }

  render = () => {
    const text = this.getValue()

    return <>{this.renderComponent({ text })}</>
  }
}
