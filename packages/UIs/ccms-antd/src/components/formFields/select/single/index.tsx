import React from 'react'
import { SelectSingleField } from 'ccms'
import { ISelectSingleField, SelectSingleFieldConfig } from 'ccms/dist/src/components/formFields/select/single'
import { Radio, Select } from 'antd'

export const SinglePropsType = (props: SelectSingleFieldConfig) => { };


export default class SelectSingleFieldComponent extends SelectSingleField {
  renderDorpdownComponent = (props: ISelectSingleField) => {
    const {
      value,
      options,
      onChange
    } = props

    return (
      <Select
        value={value}
        onChange={(value) => onChange(value)}
        dropdownMatchSelectWidth={false}
        style={{ minWidth: "100px" }}
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