import React, { Key } from 'react'
import { SelectSingleField } from 'ccms'
import { ISelectSingleField } from 'ccms/dist/src/components/formFields/select/single'
import { Radio, Select } from 'antd'
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
        disabled={disabled}
        placeholder={placeholder}
        value={value as Key}
        onChange={(valueChange) => !readonly && onChange(valueChange)}
        dropdownMatchSelectWidth={false}
        allowClear={onClear !== undefined}
        onClear={() => onClear !== undefined && onClear()}
        style={{ minWidth: '100px' }}
      >
        {options.map((option) => (
          <Select.Option
            key={option.value as Key}
            value={option.value as Key}
            label={option.label}
            disabled={option.disabled}
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
        disabled={disabled}
        value={value}
        onChange={(e) => !readonly && onChange(e.target.value)}
        options={options}
      />
    )
  }

  renderButtonComponent = (props: ISelectSingleField) => {
    const { value, options, onChange, disabled, readonly } = props

    return (
      <Radio.Group
        disabled={disabled}
        value={value}
        onChange={(e) => !readonly && onChange(e.target.value)}
        options={options}
        optionType="button"
      />
    )
  }
}
