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
      console.log(defaults, 'color default')
      if (defaults === undefined) {
        return ''
      } else {
        return defaults
      }
    };

    validate = async (value: string): Promise<true | FieldError[]> => {
      const {
        config: {
          required
        }
      } = this.props

      const errors: FieldError[] = []

      if (getBoolean(required)) {
        if (value === '') {
          errors.push(new FieldError('不能为空'))
        }
      }

      return errors.length ? errors : true
    }

    renderComponent = (props: IColorField) => {
      return <React.Fragment>
            您当前使用的UI版本没有实现ColorField组件。
        <div style={{ display: 'none' }}>
                <button onClick={() => props.onChange('onChange')}>onChange</button>
            </div>
        </React.Fragment>
    }

    render = () => {
      const {
        value,
        config: {
          readonly,
          disabled
        },
        onChange
      } = this.props
      return (
            <React.Fragment>
                {this.renderComponent({
                  disabled: getBoolean(disabled),
                  readonly: getBoolean(readonly),
                  value,
                  onChange: async (value: string) => await onChange(value)
                })}
            </React.Fragment>
      )
    }
}
