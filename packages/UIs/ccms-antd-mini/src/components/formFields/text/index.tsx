import React from 'react'
import { TextField } from 'ccms'
import 'antd/lib/input/style/index.css'
import { ITextField, TextFieldConfig } from 'ccms/dist/src/components/formFields/text'
import TextCompnent from './commontext'

export const PropsType = (props: TextFieldConfig) => {};

export default class TextFieldComponent extends TextField {
  renderComponent = (props: ITextField) => {
    const {
      readonly,
      disabled,
      placeholder,
      value,
      onChange
    } = props
    return (
      <TextCompnent
        readonly={readonly}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    )
  }
}