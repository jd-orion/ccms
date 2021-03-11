import React from 'react'
import { TextField } from 'ccms-core'
import { Input } from 'antd'
import 'antd/lib/input/style/index.css'
import { ITextField } from 'ccms-core/dist/src/components/formFields/text'

export default class TextFieldComponent extends TextField {
  renderComponent = (props: ITextField) => {
    const {
      value,
      onChange
    } = props

    return (
      <Input
        value={value}
        onChange={async (e) => {
          await onChange(e.currentTarget.value)
        }}
      />
    )
  }
}
