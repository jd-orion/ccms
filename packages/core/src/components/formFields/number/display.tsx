import React from 'react'
import { NumberFieldConfig } from '.'
import { Display } from '../common'

export interface INumberField {
  value?: number
}

export default class NumberField extends Display<NumberFieldConfig, INumberField, string | number | undefined> {
  renderComponent = (props: INumberField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现NumberField组件。
    </React.Fragment>
  }

  render = () => {
    const {
      value
    } = this.props

    return (
      <React.Fragment>
        {this.renderComponent({
          value: value || value === 0 ? Number(value) : undefined
        })}
      </React.Fragment>
    )
  }
}
