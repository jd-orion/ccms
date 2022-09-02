import React from 'react'
import { LongTextField } from 'ccms'
import { ILongtextField } from 'ccms/dist/components/formFields/longtext'
import TextCompnent from './commontext'

export default class LongTextFieldComponent extends LongTextField {
  renderComponent = (props: ILongtextField) => {
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
