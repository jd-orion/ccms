import React, { Key } from 'react'
import { SelectMultipleField } from 'ccms'
import { Checkbox, Select } from 'antd'
import 'antd/lib/checkbox/style'
import 'antd/lib/select/style'
import { ISelectMultipleField } from 'ccms/dist/components/formFields/select/multiple'
import InterfaceHelper from '../../../../util/interface'

export default class SelectSingleFieldComponent extends SelectMultipleField {
  interfaceHelper = new InterfaceHelper()

  renderDorpdownComponent = (props: ISelectMultipleField) => {
    const { value, options, onChange, onClear, disabled, placeholder } = props

    return (
      <Select
        getPopupContainer={(ele) => ele.parentElement || document.body}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={(valueChange) => onChange(valueChange)}
        mode="multiple"
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

  renderCheckboxComponent = (props: ISelectMultipleField) => {
    const { value, options, onChange, disabled } = props

    return (
      <Checkbox.Group
        disabled={disabled}
        value={value}
        onChange={(valueChange) => onChange(valueChange as Array<string | number>)}
        options={options}
      />
    )
  }
}
