import React from 'react'
import { Select } from 'antd'
import 'antd/lib/select/style'
import { AnyField } from 'ccms'
import { IAnyField, IAnyTypeField } from 'ccms/dist/components/formFields/any'
import TextField from '../text'
import NumberField from '../number'
import BooleanField from '../switch'

export default class AnyFieldComponent extends AnyField {
  TextField = TextField

  NumberField = NumberField

  BooleanField = BooleanField

  renderTypeComponent = (props: IAnyTypeField) => {
    return (
      <Select
        value={props.type}
        onChange={(type) => props.onChange(type)}
        getPopupContainer={(ele) => ele.parentElement || document.body}
      >
        <Select.Option value="null">空</Select.Option>
        <Select.Option value="string">字符串</Select.Option>
        <Select.Option value="number">数值</Select.Option>
        <Select.Option value="boolean">布尔值</Select.Option>
      </Select>
    )
  }

  renderComponent = (props: IAnyField) => {
    const { typeContent, valueContent } = props

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ width: 100, marginRight: 16 }}>{typeContent}</span>
        <span style={{ flex: 1 }}>{valueContent}</span>
      </div>
    )
  }
}
