import React from 'react'
import { getBoolean } from '../../../util/value'
import { DetailField, DetailFieldConfig, DetailFieldError, IDetailField } from '../common'

export interface TextFieldConfig extends DetailFieldConfig {
  type: 'text'
}

export interface ITextField {
  value: string
}

export default class TextField extends DetailField<TextFieldConfig, ITextField, string> implements IDetailField<string> {
  renderComponent = (props: ITextField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Text组件。
      <div style={{ display: 'none' }}>
      </div>
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
    console.log(value, 'text value ')

    return (
      <React.Fragment>
        {this.renderComponent({
          value
        })}
      </React.Fragment>
    )
  }
}
