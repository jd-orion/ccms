import React from 'react'
import { DetailField, DetailFieldConfig, IDetailField } from '../common'

export interface ColorDetailConfig extends DetailFieldConfig {
  type: 'color'
}

export interface IColorProps {
  value: string
}

export default class InfoDetail extends DetailField<ColorDetailConfig, IColorProps, string> implements IDetailField<string> {
  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()
    return (defaults === undefined) ? '' : defaults
  }

  state = {
    value: ''
  }

  renderComponent = (props: IColorProps) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现colorDetail组件。
    </React.Fragment>
  }

  componentDidMount() {
    this.getValue()
  }

  getValue = async () => {
    const {
      value,
      config: {
        defaultValue
      }
    } = this.props

    if (value && typeof value === 'string') {
      return this.setState({
        value
      })
    }
    if (typeof defaultValue === 'string') {
      this.setState({
        value: defaultValue
      })
    } else {
      this.setState({
        value: await this.reset()
      })
    }
  }

  render = () => {
    const { value } = this.state

    return (
      <React.Fragment>
        {this.renderComponent({
          value
        })}
      </React.Fragment>
    )
  }
}
