import React from 'react'
import { NumberField } from 'ccms'
import { InputNumber } from 'antd'
import 'antd/lib/input-number/style'
import { INumberField } from 'ccms/dist/components/formFields/number'

export default class NumberFieldComponent extends NumberField {
  renderComponent = (props: INumberField) => {
    const { value, onChange, step, readonly, precision, disabled } = props
    return (
      <InputNumber
        style={{ width: '100%' }}
        readOnly={readonly}
        disabled={disabled}
        precision={precision}
        value={value}
        step={step}
        onChange={async (e) => {
          await onChange(e)
        }}
      />
    )
  }
}
