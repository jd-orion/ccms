import React from 'react'
import { getBoolean } from '../../../util/value'
import { DetailField, DetailFieldProps, DetailFieldConfig, DetailFieldError, IDetailField } from '../common'

export interface TextFieldConfig extends DetailFieldConfig {
  type: 'text'
}

export interface ITextField {
  value: string | Array<string>
}

export default class TextField extends DetailField<TextFieldConfig, ITextField, string> implements IDetailField<string> {
  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()
    return (defaults === undefined) ? '/' : defaults
  }

  state = {
    value: ''
  }

  constructor(props: DetailFieldProps<TextFieldConfig, string>) {
    super(props)
  }

  renderComponent = (props: ITextField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Text组件。
      <div style={{ display: 'none' }}>
      </div>
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
    if (value) {
      if (typeof value !== 'object') {
        return this.setState({
          value: String(value)
        })
      } else if (Array.isArray(value)) {
        return this.setState({
          value: (value as Array<string>).join(',')
        })
      } else {
        return this.setState({
          value: '/'
        })
      }
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
