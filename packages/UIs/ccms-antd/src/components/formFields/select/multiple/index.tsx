import React from 'react'
import { SelectMultipleField } from 'ccms'
import { Checkbox, Select } from 'antd'
import { ISelectMultipleField, SelectMultipleFieldConfig } from 'ccms/dist/src/components/formFields/select/multiple'
import InterfaceHelper from '../../../../util/interface'
export default class SelectSingleFieldComponent extends SelectMultipleField {
  interfaceHelper = new InterfaceHelper()

  renderDorpdownComponent = (props: ISelectMultipleField) => {
    const {
      value,
      options,
      onChange,
      onClear,
      disabled,
      readonly,
      placeholder
    } = props

    return (
      <Select
        optionFilterProp="label"
        getPopupContainer={(ele) => ele.parentElement || document.body}
        disabled={disabled || readonly}
        placeholder={placeholder}
        value={value}

        onChange={(value) => onChange(value)}
        style={{ minWidth: '100px' }}
        dropdownMatchSelectWidth={false}
        mode='multiple'
        allowClear={onClear !== undefined}
        onClear={() => onClear !== undefined && onClear()}
      >
        {options.map((option) => (
          <Select.Option key={option.value as any} value={option.value as any} label={option.label}>{option.label}</Select.Option>
        ))}
      </Select>
    )
  }

  renderCheckboxComponent = (props: ISelectMultipleField) => {
    const {
      value,
      options,
      onChange,
      disabled,
      readonly
    } = props

    return (
      <Checkbox.Group
        disabled={disabled || readonly}
        value={value}
        onChange={(value) => onChange((value as Array<string | number>))}
        options={options}
      />
    )
  }
}
