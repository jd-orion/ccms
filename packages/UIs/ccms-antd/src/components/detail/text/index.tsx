import React from 'react'
import { DetailTextField } from 'ccms'
import { ITextField } from 'ccms/dist/components/detail/text'

export default class TextFieldComponent extends DetailTextField {
  renderComponent = (props: ITextField) => {
    const { value } = props
    return <>{value}</>
  }
}
