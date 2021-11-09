import React from 'react'
import { SelectSingleField } from 'ccms'
import { ISelectSingleField } from 'ccms/dist/src/components/formFields/select/single'
import { Radio, Select } from 'antd'
import InterfaceHelper from '../../../../util/interface'
import 'antd/lib/select/style/index.css'

export default class SelectSingleFieldComponent extends SelectSingleField {
  interfaceHelper = new InterfaceHelper()
  renderDorpdownComponent = (props: ISelectSingleField) => {
    const {
      value,
      options,
      onChange
    } = props

    return (
      <Select
        value={value as any}
        onChange={(value) => onChange(value as any)}
      >
        {options.map((option: any) => (
          <Select.Option key={option.value as any} value={option.value as any}>{option.label}</Select.Option>
        ))}
      </Select>
    )
  }

  renderRadioComponent = (props: ISelectSingleField) => {
    const {
      value,
      options,
      onChange
    } = props

    return (
      <Radio.Group
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
      onChange
    } = props

    return (
      <Radio.Group
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
        optionType='button'
      />
    )
  }
}
