import { config } from 'process'
import React from 'react'
import { DetailField, DetailFieldConfig, DetailFieldError, DetailFieldProps, IDetailField } from '../common'

export interface EnumDetailConfig extends DetailFieldConfig {
  type: 'detail_enum'
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

export interface IEnumProps {
  value?: string | string[]
}

export default class EnumDetail extends DetailField<EnumDetailConfig, IEnumProps, any> implements IDetailField<string> {
  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()
    return (defaults === undefined) ? '/' : defaults
  }

  renderComponent = (props: IEnumProps) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现EnumDetail组件。
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

    let theValue = value
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
          const option = options.data.find((option) => option.value === value)
          return option ? option.label : value.toString()
        } else if (multiple === true || multiple.type) {
          if (Array.isArray(theValue)) {
            return theValue.map((item) => {
              const option = options.data.find((option) => {
                return option.value === Number(item)
              })
              return option ? option.label : item.toString()
            }).join(',')
          } else {
            return '-'
          }
        }
      } else {
        return value
      }
    } else {
      return value
    }
  }

  render = () => {
    const value = this.getValue()
    return (
      <React.Fragment>
        {this.renderComponent({
          value
        })}
      </React.Fragment>
    )
  }
}
