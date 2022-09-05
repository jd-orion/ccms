import React, { Key } from 'react'
import { SelectSingleField } from 'ccms'
import { ISelectSingleField } from 'ccms/dist/components/formFields/select/single'
import { Radio, Select } from 'antd'
import 'antd/lib/radio/style'
import 'antd/lib/select/style'
import InterfaceHelper from '../../../../util/interface'

export default class SelectSingleFieldComponent extends SelectSingleField {
  interfaceHelper = new InterfaceHelper()

  renderDorpdownComponent = (props: ISelectSingleField) => {
    const { value, options, onChange, onClear, disabled, placeholder } = props

    return (
      <Select
        getPopupContainer={(ele) => ele.parentElement || document.body}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={(valueChange) => onChange(valueChange)}
        allowClear={onClear !== undefined}
        onClear={() => onClear !== undefined && onClear()}
      >
        {options.map((option) => (
          <Select.Option key={option.value as Key} value={option.value as unknown}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    )
  }

  renderRadioComponent = (props: ISelectSingleField) => {
    const { value, options, onChange, disabled } = props

    return (
      <Radio.Group disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} options={options} />
    )
  }

  renderButtonComponent = (props: ISelectSingleField) => {
    const { value, options, onChange, disabled } = props

    return (
      <Radio.Group
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
        optionType="button"
      />
    )
  }
}
