import React from 'react'
import { TextFieldConfig } from '.'
import { Display } from '../common'

export interface ITextField {
  value: string,
}

export default class TextField extends Display<TextFieldConfig, ITextField, string> {
  renderComponent = (props: ITextField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现TextField组件。
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
