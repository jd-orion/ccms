import React from 'react'
import { LongTextField } from 'ccms'
import { ILongtextField, LongtextFieldConfig } from 'ccms/dist/src/components/formFields/longtext'
import TextCompnent from './commontext'

export const PropsType = (props: LongtextFieldConfig) => {}

export default class LongTextFieldComponent extends LongTextField {
  renderComponent = (props: ILongtextField) => {
    const {
      readonly,
      disabled,
      placeholder,
      value,
      onChange
    } = props

    return <TextCompnent
      readonly={readonly}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  }
}
