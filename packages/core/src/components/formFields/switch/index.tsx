import React from 'react'
import { Field, FieldConfig, IField } from '../common'

export interface SwitchFieldConfig extends FieldConfig {
  type: 'switch'
  valueTrue?: boolean | number | string
  valueFalse?: boolean | number | string
}

export interface ISwitchField {
  value: boolean
  onChange: (value: boolean) => Promise<void>
}

export default class SwitchField
  extends Field<SwitchFieldConfig, ISwitchField, boolean | number | string>
  implements IField<boolean | number | string>
{
  reset: () => Promise<boolean | number | string> = async () => {
    const defaults = await this.defaultValue()

    if (defaults === undefined) {
      return ''
    }
    return defaults
  }

  renderComponent: (props: ISwitchField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现SwitchField组件。</>
  }

  render = () => {
    const {
      value,
      config: { valueTrue = true, valueFalse = false }
    } = this.props
    return (
      <>
        {this.renderComponent({
          value: value === valueTrue,
          onChange: async (valueChange: boolean) =>
            this.props.onValueSet(
              '',
              valueChange ? valueTrue : valueFalse,
              await this.validate(valueChange ? valueTrue : valueFalse)
            )
        })}
      </>
    )
  }
}
