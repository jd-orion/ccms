import React from 'react'
import { SelectSingleField } from 'ccms'
import { ISelectSingleField, SelectSingleFieldConfig } from 'ccms/dist/src/components/formFields/select/single'
import { Radio, Select } from 'antd'
import InterfaceHelper from '../../../../util/interface'

export const SinglePropsType = (props: SelectSingleFieldConfig) => { }

export default class SelectSingleFieldComponent extends SelectSingleField {
  interfaceHelper = new InterfaceHelper()
  
  renderDorpdownComponent = (props: ISelectSingleField) => {
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
        dropdownMatchSelectWidth={false}
        style={{ minWidth: '100px' }}
      >
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
        ))}
      </Select>
    )
  }

  renderRadioComponent = (props: ISelectSingleField) => {
    const {
      value,
      options,
      onChange,
      disabled
    } = props

    return (
      <Radio.Group
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
      />
    )
  }

  renderButtonComponent = (props: ISelectSingleField) => {
    const {
      value,
      options,
      onChange,
      disabled
    } = props

    return (
      <Radio.Group
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
        optionType='button'
      />
    )
  }
}
