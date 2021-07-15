import React from 'react'
import Column, { ColumnConfig } from '../common'
import { APIConfig } from '../../../interface'

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
  },
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

    let getoptions = options
    // if (Object.prototype.toString.call(options) === "[object Array]") {
    //   getoptions = options[0]
    // }

    if (getoptions) {
      rsValue = ''
      if (getoptions.data.length > 0) {
        theValue.forEach((v: any) => {
          getoptions.data.forEach((o: any) => {
            const getKey = getoptions.getKey || 'value'
            const getValue = getoptions.getValue || 'label'
            if (v && o && v?.toString() === o[getKey]?.toString() && o[getValue]) {
              rsValue += `${o[getValue]},`
            }
          });
        });
      }
      rsValue = rsValue.slice(0, rsValue.length - 1)
    }

    rsValue = rsValue ? rsValue : defaultValue !== undefined ? defaultValue : ''

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
