import moment from 'moment'
import React from 'react'
import Column, { ColumnConfig } from '../common'

export interface DatetimeColumnConfig extends ColumnConfig {
  type: 'datetime'
  format?: string
}

export interface IDatetimeColumn {
  value: any
}

export default class DatetimeColumn extends Column<DatetimeColumnConfig, IDatetimeColumn> {
  renderComponent = (props: IDatetimeColumn) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现DatetimeColumn组件。
    </React.Fragment>
  }

  getValue = () => {
    const {
      config: {
        format = 'YYYY-MM-DD HH:mm:ss',
        defaultValue
      },
      value
    } = this.props

    let _val = /^\d+$/.test(value) ? parseInt(value) : value
    const rsValue= value ? moment(_val).format(format) : defaultValue

    return rsValue
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
