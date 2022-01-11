import React from 'react'
import { MultipleTextFieldConfig } from '.'
import { Display } from '../common'

export interface IMultipleTextField {
  value: string[]
}

export interface IMultipleTextFieldState<S> {
  extra?: S
}

export default class MultipleTextField<S = {}> extends Display<MultipleTextFieldConfig, IMultipleTextField, string[], IMultipleTextFieldState<S>> {
  renderComponent = (props: IMultipleTextField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现MultipleTextField组件。
    </React.Fragment>
  }

  render = () => {
    const {
      value
    } = this.props
    return (
      <React.Fragment>
        {this.renderComponent({
          value: Array.isArray(value) ? value.map((v) => v.toString()) : []
        })}
      </React.Fragment>
    )
  }
}
