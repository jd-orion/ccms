import React from 'react'
import { TextField } from 'ccms'
import { ITextField } from 'ccms/dist/components/formFields/text'
import TextCompnent from './commontext'

export default class TextFieldComponent extends TextField {
  renderComponent = (props: ITextField) => {
    const { readonly, disabled, placeholder, value, onChange } = props
    return (
      <TextCompnent
        readonly={readonly}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    )
  }
}
