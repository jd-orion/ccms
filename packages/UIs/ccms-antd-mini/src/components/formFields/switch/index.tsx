import React from 'react'
import { Switch } from 'antd'
import 'antd/lib/switch/style'
import { SwitchField } from 'ccms'
import { ISwitchField } from 'ccms/dist/components/formFields/switch'

export default class SwitchFieldComponent extends SwitchField {
  renderComponent = (props: ISwitchField) => {
    const { value, onChange } = props

    return <Switch checked={value} onChange={(checked) => onChange(checked)} />
  }
}
