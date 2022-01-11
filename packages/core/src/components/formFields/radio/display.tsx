import React from 'react'
import { RadioFieldConfig } from '.'
import { Display } from '../common'

export interface IRadioField {
  value: string,
  options?: any
}

export default class RadioField extends Display<RadioFieldConfig, IRadioField, string> {
  renderComponent = (props: IRadioField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现RadioField组件。
    </React.Fragment>
  }

  render = () => {
    const {
      value,
      config: {
        options
      }
    } = this.props

    return (
      <React.Fragment>
        {this.renderComponent({
          value,
          options
        })}
      </React.Fragment>
    )
  }
}
