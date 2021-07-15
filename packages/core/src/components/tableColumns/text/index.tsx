import React from 'react'
import Column, { ColumnConfig } from '../common'

export interface TextColumnConfig extends ColumnConfig {
  type: 'text'
}

export interface ITextColumn {
  value: string
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
    const value = this.getValue()

    return (
      <React.Fragment>
        {this.renderComponent({ value })}
      </React.Fragment>
    )
  }
}
