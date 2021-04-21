import React from 'react'
import { TextField } from 'ccms-core'
// import 'antd/lib/input/style/index.css'
import { ITextField, TextFieldConfig } from 'ccms-core/dist/src/components/formFields/text'
import TextCompnent from './commontext'

export const PropsType = (props: TextFieldConfig) => {};

export default class TextFieldComponent extends TextField {
  renderComponent = (props: ITextField) => {
    const {
      readonly,
      disabled,
      value,
      onChange
    } = props
    return (
      <TextCompnent
        readonly={readonly}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    )
  }
}