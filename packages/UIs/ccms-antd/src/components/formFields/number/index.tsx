import React from 'react'
import { NumberField } from 'ccms'
import { InputNumber } from 'antd'
import { INumberField, NumberFieldConfig } from 'ccms/dist/src/components/formFields/number'

export const PropsType = (props: NumberFieldConfig) => { }

export default class NumberFieldComponent extends NumberField {
  renderComponent = (props: INumberField) => {
    const {
      value,
      onChange,
      step,
      readonly,
      precision,
      disabled
    } = props
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
