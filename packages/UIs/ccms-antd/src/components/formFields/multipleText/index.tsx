import React from "react";
import { Select } from "antd"
import { MultipleTextField } from 'ccms';
import { IMultipleTextField } from "ccms/dist/src/components/formFields/multipleText";

interface IMultipleTextFieldState {
  option: string
}

export default class MultipleTextFieldComponent extends MultipleTextField<IMultipleTextFieldState> {
  renderComponent = (props: IMultipleTextField) => {
    const {
      value,
      onChange,
      placeholder
    } = props

    return (
      <Select
        value={value}
        onChange={(value) => onChange(value)}
        showSearch
        mode="multiple"
        onSearch={(option)=> this.setState({ extra: { option } })}
        dropdownStyle={{ display: 'none' }}
        placeholder={placeholder}
      >
        <Select.Option value={this.state?.extra?.option || ''}>{this.state?.extra?.option || ''}</Select.Option>
      </Select>
    )
  }
}