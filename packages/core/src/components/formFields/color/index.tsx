import React from 'react'
import { getBoolean } from '../../../util/value'
import { Field, FieldConfig, FieldError, IField, FieldInterface } from '../common'

export interface ColorFieldConfig extends FieldConfig, FieldInterface {
  type: 'color'
  mode?: 'rgb' | 'hsl'
}

export interface IColorField {
  value: string
  onChange: (value: string) => Promise<void>
  readonly: boolean
  disabled: boolean
}

export default class ColorField extends Field<ColorFieldConfig, IColorField, string> implements IField<string> {
  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()
    if (defaults === undefined) {
      return ''
    } else {
      return defaults
    }
  };

  validate = async (value: string): Promise<true | FieldError[]> => {
    const {
      config: {
        label,
        required
      }
    } = this.props

    const errors: FieldError[] = []

    if (getBoolean(required)) {
      if (value === '' || value === undefined) {
        errors.push(new FieldError(`请设置${label}`))
      }
    }

    return errors.length ? errors : true
  }

    render = () => {
      const {
        value,
        config: {
          readonly,
          disabled
        }
      } = this.props
      return (
            <React.Fragment>
                {this.renderComponent({
                  disabled: getBoolean(disabled),
                  readonly: getBoolean(readonly),
                  value,
                  onChange: async (value: string) => await this.props.onValueSet('', value, await this.validate(value))
                })}
            </React.Fragment>
      )
    }
}
