import React from 'react'
import StatementHelper, { StatementConfig } from '../../../util/statement'
import Column, { ColumnConfig } from '../common'

/**
 * 表格格式文本配置项
 * - type: 格式文本类型
 * - statement: 自定义文案内容
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
