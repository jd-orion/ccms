import React from 'react'
import { SwitchFieldConfig } from '.'
import { Display } from '../common'

export interface ISwitchField {
  value: boolean
}

export default class SwitchField extends Display<SwitchFieldConfig, ISwitchField, boolean | number | string> {
  renderComponent = (props: ISwitchField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现SwitchField组件。
    </React.Fragment>
  }

  render = () => {
    const {
      value,
      config: {
        valueTrue = true
      }
    } = this.props

    return (
      <React.Fragment>
        {this.renderComponent({
          value: value === valueTrue
        })}
      </React.Fragment>
    )
  }
}
