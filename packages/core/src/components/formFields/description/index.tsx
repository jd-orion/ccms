import React from 'react'
import { Field, FieldConfig, FieldError, IField } from '../common'

export interface DescFieldConfig extends FieldConfig {
  type: 'desc',
  link?: string,
  desc?: string
  style?: any
}

export interface IDescField {
  link?: string
  desc?: string
  style?: any
}

export default class DescField extends Field<DescFieldConfig, IDescField, string> implements IField<string> {

  validate = async (value: string): Promise<true | FieldError[]> => {
    return true
  }

  renderComponent = (props: IDescField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现DescField组件。
    </React.Fragment>
  }

  render = () => {
    const {
      config: {
        link,
        style,
        desc
      }
    } = this.props

    let setStyle = style
    if (Object.prototype.toString.call(setStyle) !== '[object Object]') {
      setStyle = {}
    }

    return (
      <React.Fragment>
        {this.renderComponent({
          link,
          style: setStyle,
          desc
        })}
      </React.Fragment>
    )
  }
}

