import React from 'react'
import { DetailField, DetailFieldConfig, IDetailField } from '../common'

export interface ColorDetailConfig extends DetailFieldConfig {
  type: 'color'
}

export interface IColorProps {
  value: string
}

export default class InfoDetail extends DetailField<ColorDetailConfig, IColorProps, string> implements IDetailField<string> {
  renderComponent = (props: IColorProps) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现colorDetail组件。
    </React.Fragment>
  }

  getValue = () => {
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
        {this.renderComponent({
          value
        })}
      </React.Fragment>
    )
  }
}
