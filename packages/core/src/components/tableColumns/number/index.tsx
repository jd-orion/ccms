import moment from 'moment'
import React from 'react'
import Column, { ColumnConfig } from '../common'

export interface NumberColumnConfig extends ColumnConfig {
  type: 'number'
  precision?: number
}

export interface INumberColumn {
  value: string
}

export default class NumberColumn extends Column<NumberColumnConfig, INumberColumn> {
  renderComponent = (props: INumberColumn) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现NumberColumn组件。
    </React.Fragment>
  }

  getValue = () => {
    const {
      config: {
        precision,
        defaultValue
      },
      value
    } = this.props

    return `${precision ? Number(value).toFixed(precision) : value || defaultValue || ""}`
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
