import React from 'react'
import Column, { ColumnConfig } from '../common'

export interface EnumColumnConfig extends ColumnConfig {
  type: 'Aenum'
  valueType?: 'string' | 'number' | 'boolean'
  multiple: boolean | ArrayMultipleConfig | SplitMultipleConfig
  options: ManualOptionsConfig
}

interface ArrayMultipleConfig {
  type: 'array'
}

interface SplitMultipleConfig {
  type: 'split'
  split: string
}

interface ManualOptionsConfig {
  from: 'manual'
  data: {
    key: string | number | boolean
    label: string
    [extra: string]: any
  }[],
  getKey?: string
  getValue?: string
}


export interface IEnumColumn {
  value: string | string[]
}

export default class EnumColumn extends Column<EnumColumnConfig, IEnumColumn> {
  renderComponent = (props: IEnumColumn) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现EnumColumn组件。
    </React.Fragment>
  }

  getValue = () => {
    const {
      value,
      config: {
        multiple,
        options,
        defaultValue
      }
    } = this.props

    if (value === '' || value === undefined) return defaultValue

    let theValue = value;
    let rsValue = value;
    if (Object.prototype.toString.call(theValue) !== "[object Array]") {
      if (typeof theValue !== 'string') { theValue = theValue?.toString() }
      if (multiple && typeof multiple !== 'boolean' && multiple.type === 'split' && multiple.split) {
        theValue = theValue?.split(multiple.split)
      } else {
        theValue = theValue?.split(',')
      }
    }

    if (options && options.from === 'manual') {
      if (options.data) {
        if (multiple === undefined || multiple === false) {
          const option = options.data.find((option) => option.key === value)
          return option ? option.label : value.toString()
        } else if (multiple === true || multiple.type === 'array') {
          if (Array.isArray(value)) {
            return value.map((item) => {
              const option = options.data.find((option) => option.key === item)
              return option ? option.label : item.toString()
            })
          } else {
            return '-'
          }
        }
      } else {
        return value
      }
    } else {
      return '-'
    }
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
