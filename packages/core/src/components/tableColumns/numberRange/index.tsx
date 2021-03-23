import React from 'react'
import Column, { ColumnConfig } from '../common'

export interface NumberRangeColumnConfig extends ColumnConfig {
  type: 'numberRange'
  precision?: number
  split?: string
}

export interface INumberRangeColumn {
  value: string
}

export default class NumberRangeColumn extends Column<NumberRangeColumnConfig, INumberRangeColumn> {
  renderComponent = (props: INumberRangeColumn) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现NumberRangeColumn组件。
    </React.Fragment>
  }

  getValue = () => {

    const {
      config: {
        precision = 0,
        defaultValue,
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
      list = Object.prototype.toString.call(value) === '[object Array]' ? value : [value]
    }

    list.forEach((val: string, index: number) => {
      const theNumber = precision ? Number(val).toFixed(precision) : val
      rsValue += (index < list.length - 1) ? `${theNumber}${split}` : theNumber
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
