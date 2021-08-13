import React from 'react'
import { SelectMultipleField } from 'ccms'
import { Checkbox, Select } from 'antd'
import { ISelectMultipleField, SelectMultipleFieldConfig } from 'ccms/dist/src/components/formFields/select/multiple'
import 'antd/lib/select/style/index.css'
import 'antd/lib/checkbox/style/index.css'

export const MultiplePropsType = (props: SelectMultipleFieldConfig) => { }

export default class SelectSingleFieldComponent extends SelectMultipleField {
  renderDorpdownComponent = (props: ISelectMultipleField) => {
    const {
      value,
      options,
      onChange,
      disabled
    } = props
    
    return (
      <Select
        disabled={disabled}
        value={value}
        onChange={(value) => {onChange(value);console.log(value)}}
        style={{ minWidth: '100px' }}
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
      onChange,
      disabled
    } = props

    return (
      <Checkbox.Group
        disabled={disabled}
        value={value}
        onChange={(value) => onChange((value as Array<string | number>))}
        options={options}
      />
    )
  }
}
