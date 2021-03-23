
import moment from 'moment'
import React from 'react'
import Column, { ColumnConfig } from '../common'

export interface DatetimeRangeColumnConfig extends ColumnConfig {
  type: 'datetimeRange'
  format?: string
  split?: string
}

export interface IDatetimeRangeColumn {
  value: any
}

export default class DatetimeRangeColumn extends Column<DatetimeRangeColumnConfig, IDatetimeRangeColumn> {
  renderComponent = (props: IDatetimeRangeColumn) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现DatetimeRangeColumn组件。
    </React.Fragment>
  }

  getValue = () => {
    const {
      config: {
        defaultValue,
        format = 'YYYY-MM-DD HH:mm:ss',
        split = '-'
      },
      value
    } = this.props

    let rsValue: string = ''
    let list: Array<string> = []

    if(!value){
      rsValue = defaultValue || ''
    }else if (typeof value === 'string' && value.indexOf(',') >= 0) {
      list = value.split(',')
    } else if (typeof value === 'string') {
      list.push(value)
    } else {
      list =  Object.prototype.toString.call(value) === '[object Array]' ? value : [value]
    }

    list && list.length > 0 && list.forEach((val: string, index: number) => {
      rsValue += index < list.length - 1 ? `${moment(val).format(format)}${split}` : moment(val).format(format)
    })
    
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
