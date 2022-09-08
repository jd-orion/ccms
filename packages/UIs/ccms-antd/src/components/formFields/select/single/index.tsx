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
    const { value, options, onChange, onClear, disabled, readonly, placeholder } = props

    return (
      <Select
        showSearch
        optionFilterProp="label"
        getPopupContainer={(ele) => ele.parentElement || document.body}
        disabled={disabled || readonly}
        placeholder={placeholder}
        value={value as Key}
        onChange={(valueChange) => onChange(valueChange)}
        dropdownMatchSelectWidth={false}
        allowClear={onClear !== undefined}
        onClear={() => onClear !== undefined && onClear()}
        style={{ minWidth: '100px' }}
      >
        {options.map((option) => (
          <Select.Option
            key={option.value as unknown as string | number | undefined}
            value={option.value as Key}
            label={option.label}
          >
            {option.label}
          </Select.Option>
        ))}
      </Select>
    )
  }

  renderRadioComponent = (props: ISelectSingleField) => {
    const { value, options, onChange, disabled, readonly } = props

    return (
      <Radio.Group
        disabled={disabled || readonly}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
      />
    )
  }

  renderButtonComponent = (props: ISelectSingleField) => {
    const { value, options, onChange, disabled, readonly } = props

    return (
      <Radio.Group
        disabled={disabled || readonly}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
        optionType="button"
      />
    )
  }
}
