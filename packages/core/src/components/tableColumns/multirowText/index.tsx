import React from 'react'
import Column, { ColumnConfig } from '../common'

export interface MultirowColumnConfig extends ColumnConfig {
  type: 'multirowText'
}

export interface IMultirowColumn {
  value: string
}

export default class MultirowColumn extends Column<MultirowColumnConfig, IMultirowColumn> {
  renderComponent = (props: IMultirowColumn) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现MultirowColumn组件。
    </React.Fragment>
  }

  getValue = () => {
    const {
      value,
      config: {
        style,
        defaultValue
      }
    } = this.props

    let list: Array<string> = []

    if (!value) {
      return defaultValue ? [defaultValue] : list
    }

    if (typeof value === 'string' && value.indexOf(',') >= 0) {
      list = value.split(',')
    } else if (typeof value === 'string') {
      list.push(value)
    } else {
      list = Object.prototype.toString.call(value) === '[object Array]' ? value : [value]
    }

    if (style?.prefix || style?.postfix) {
      const rsList: Array<string> = []
      list.forEach((val, index) => {
        rsList[index] = `${style.prefix || ''}${val}${style.postfix || ''}`
      })
      return rsList
    }

    return list
  }

  render = () => {
    const list = this.getValue()

    return (<React.Fragment>
      {
        list.map((value: string, index: number) => {
          return <div key={index}>{this.renderComponent({ value })}</div>
        })
      }
    </React.Fragment>
    )
  }
}
