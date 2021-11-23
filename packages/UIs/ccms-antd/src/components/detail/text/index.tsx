import React from 'react'
import { DetailTextField } from 'ccms'
import { ITextField, TextFieldConfig } from 'ccms/dist/src/components/detail/text'

export const PropsType = (props: TextFieldConfig) => {}

export default class TextFieldComponent extends DetailTextField {
  renderComponent = (props: ITextField) => {
    const {
      value
    } = props
    return (
      <div>{value}</div>
    )
  }
}
