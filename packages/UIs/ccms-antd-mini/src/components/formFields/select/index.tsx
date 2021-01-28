import React from 'react'
import { SelectField } from 'ccms-core'
import { Radio, Select, Checkbox } from 'antd'
import 'antd/lib/input/style/index.css'
import { ISelectFieldDropdown, ISelectFieldRadio, ISelectFieldCheckbox } from 'ccms-core/dist/src/components/formFields/select'

export default class SelectFieldComponent extends SelectField {
  renderDorpdownComponent = (props: ISelectFieldDropdown) => {
    const {
      value,
      options,
      multiple,
      onChange
    } = props

    return (
      <Select
        value={value}
        onChange={(value) => onChange(value)}
        mode={multiple ? 'multiple' : undefined}
      >
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
        ))}
      </Select>
    )
  }

  renderRadioComponent = (props: ISelectFieldRadio) => {
    const {
      value,
      options,
      onChange
    } = props

    return (
      <Radio.Group
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
      />
    )
  }

  renderCheckboxComponent = (props: ISelectFieldCheckbox) => {
    const {
      value,
      options,
      onChange
    } = props

    return (
      <Checkbox.Group
        value={value}
        onChange={(value) => {
          const _value: (string | number)[] = []
          value.forEach((v) => {
            if (typeof v === 'string' || typeof v === 'number') _value.push(v)
          })
          onChange(_value)
        }}
        options={options}
      />
    )
  }
}
