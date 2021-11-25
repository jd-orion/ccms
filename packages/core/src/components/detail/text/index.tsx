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

  render = () => {
    const {
      value
    } = this.props

    return (
      <React.Fragment>
        {this.renderComponent({
          value
        })}
      </React.Fragment>
    )
  }
}