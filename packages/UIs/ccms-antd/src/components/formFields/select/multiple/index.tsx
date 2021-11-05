import React from 'react'
import { SelectMultipleField } from 'ccms'
import { Checkbox, Select } from 'antd'
import { ISelectMultipleField, SelectMultipleFieldConfig } from 'ccms/dist/src/components/formFields/select/multiple'
import InterfaceHelper from '../../../../util/interface'

export const MultiplePropsType = (props: SelectMultipleFieldConfig) => { }

export default class SelectSingleFieldComponent extends SelectMultipleField {
  interfaceHelper = new InterfaceHelper()
  
  renderDorpdownComponent = (props: ISelectMultipleField) => {
    const {
      value,
      options,
      onChange,
      disabled,
      placeholder
    } = props
    
    return (
      <Select
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={(value) => onChange(value)}
        style={{ minWidth: '100px' }}
        dropdownMatchSelectWidth={false}
        mode='multiple'
      >
        {options.map((option) => (
          <Select.Option key={option.value as any} value={option.value as any}>{option.label}</Select.Option>
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
