import React from 'react'
import { SelectSingleField } from 'ccms'
import { ISelectSingleField } from 'ccms/dist/src/components/formFields/select/single'
import { Radio, Select } from 'antd'
import InterfaceHelper from '../../../../util/interface'

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
        getPopupContainer={(ele) => document.getElementById('ccms-antd-mini') || document.getElementById('ccms-antd-mini-form') || ele.parentElement || document.body}
        disabled={disabled}
        placeholder={placeholder}
        value={value as any}
        onChange={(value) => onChange(value)}
      >
        {options.map((option) => (
          <Select.Option key={option.value as any} value={option.value as any}>{option.label}</Select.Option>
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
