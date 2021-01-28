import React from 'react'
import { SelectMultipleField } from 'ccms-core'
import { Checkbox, Select } from 'antd'
import { ISelectMultipleField } from 'ccms-core/dist/src/components/formFields/select/multiple'

export default class SelectSingleFieldComponent extends SelectMultipleField {
  renderDorpdownComponent = (props: ISelectMultipleField) => {
    const {
      value,
      options,
      onChange
    } = props

    return (
      <Select
        value={value}
        onChange={(value) => onChange(value)}
        mode='multiple'
      >
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
        ))}
      </Select>
    )
  }

  renderCheckboxComponent = (props: ISelectMultipleField) => {
    const {
      value,
      options,
      onChange
    } = props

    return (
      <Checkbox.Group
        value={value}
        onChange={(value) => onChange((value as Array<string | number>))}
        options={options}
      />
    )
  }
}
