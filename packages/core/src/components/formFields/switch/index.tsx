import React from "react";
import { Field, FieldConfig, IField } from "../common";

export interface SwitchFieldConfig extends FieldConfig {
  type: 'switch'
  valueTrue?: boolean | number | string
  valueFalse?: boolean | number | string
}

export interface ISwitchField {
  value: boolean
  onChange: (value: boolean) => Promise<void>
}

export default class SwitchField extends Field<SwitchFieldConfig, ISwitchField, boolean | number | string> implements IField<boolean | number | string> {
  reset: () => Promise<boolean> = async () => {
    const defaults = await this.defaultValue()

    if (defaults === undefined) {
      return ''
    } else {
      return defaults
    }
  }

  renderComponent = (props: ISwitchField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现SwitchField组件。
      <div style={{ display: 'none' }}>
        <button onClick={() => props.onChange(false)}>onChange</button>
      </div>
    </React.Fragment>
  }

  render = () => {
    const {
      value,
      config: {
        valueTrue = true,
        valueFalse = false
      }
    } = this.props
    return (
      <React.Fragment>
        {this.renderComponent({
          value: value === valueTrue,
          onChange: async (value: boolean) => this.props.onValueSet('', value ? valueTrue : valueFalse, await this.validate(value ? valueTrue : valueFalse))
        })}
      </React.Fragment>
    )
  }
}