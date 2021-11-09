import React from 'react'
import { SelectMultipleField } from 'ccms'
import { Checkbox, Select } from 'antd'
import { ISelectMultipleField } from 'ccms/dist/src/components/formFields/select/multiple'
import InterfaceHelper from '../../../../util/interface'
import 'antd/lib/select/style/index.css'
export default class SelectSingleFieldComponent extends SelectMultipleField {
  interfaceHelper = new InterfaceHelper()
  
  renderDorpdownComponent = (props: ISelectMultipleField) => {
    const {
      value,
      options,
      onChange
    } = props

    return (
      <Select
        value={value as any}
        onChange={(value) => onChange(value as any)}
        mode='multiple'
      >
        {options.map((option:any) => (
          <Select.Option key={option.value as any} value={option.value as any}>{option.label}</Select.Option>
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
