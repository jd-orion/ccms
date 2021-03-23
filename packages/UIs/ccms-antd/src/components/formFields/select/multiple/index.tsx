import React from 'react'
import { SelectMultipleField } from 'ccms'
import { Checkbox, Select } from 'antd'
import { ISelectMultipleField, SelectMultipleFieldConfig } from 'ccms/dist/src/components/formFields/select/multiple'

export const MultiplePropsType = (props: SelectMultipleFieldConfig) => { };

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
        style={{ minWidth: "100px" }}
        dropdownMatchSelectWidth={false}
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
