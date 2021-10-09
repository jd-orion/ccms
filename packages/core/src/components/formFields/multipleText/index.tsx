import React from "react";
import { Field, FieldConfig, IField } from "../common";

export interface MultipleTextFieldConfig extends FieldConfig {
  type: 'multiple_text'
  placeholder?: string
}

export interface IMultipleTextField {
  value: string[]
  onChange: (value: string[]) => Promise<void>
  placeholder?: string
}

export interface IMultipleTextFieldState<S> {
  extra?: S
}

export default class MultipleTextField<S = {}> extends Field<MultipleTextFieldConfig, IMultipleTextField, string[], IMultipleTextFieldState<S>> implements IField<string[]> {
  renderComponent = (props: IMultipleTextField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现MultipleTextField组件。
      <div style={{ display: 'none' }}>
        <button onClick={() => props.onChange([])}>onChange</button>
      </div>
    </React.Fragment>
  }

  render = () => {
    const {
      value,
      config: {
        placeholder
      }
    } = this.props
    return (
      <React.Fragment>
        {this.renderComponent({
          value: Array.isArray(value) ? value.map((v) => v.toString()) : [],
          onChange: async (value: string[]) => this.props.onValueSet('', value, true),
          placeholder
        })}
      </React.Fragment>
    )
  }
}