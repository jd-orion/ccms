import React from 'react'
import { getBoolean } from '../../../util/value'
import { Field, FieldConfig, FieldError, IField } from '../common'

export interface ImageUrlFieldConfig extends FieldConfig {
  type: 'imageurl'
  placeholder?: string
  size?: {
    height: string | number
    width: string | number
  }
}

export interface IImageUrlField {
  value: string,
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  onChange: (value: string) => Promise<void>
  height: string | number
  width: string | number
}

export default class ImageUrlField extends Field<ImageUrlFieldConfig, IImageUrlField, string> implements IField<string> {
  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()

    if (defaults === undefined) {
      return ''
    } else {
      return defaults
    }
  }

  validate = async (value: string): Promise<true | FieldError[]> => {
    const {
      config: {
        required
      }
    } = this.props

    const errors: FieldError[] = []

    if (getBoolean(required)) {
      if (value === '' || value === undefined) {
        errors.push(new FieldError('不能为空'))
      }
    }
    return errors.length ? errors : true
  }

  renderComponent = (props: IImageUrlField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现ImageUrlField组件。
      <div style={{ display: 'none' }}>
        <button onClick={() => props.onChange('onChange')}>onChange</button>
      </div>
    </React.Fragment>
  }

  render = () => {

    const {
      value,
      config: {
        disabled,
        placeholder,
        readonly,
        size
      },
      onChange
    } = this.props

    const width = size?.width || "200px"
    const height = size?.height || "auto"
    return (
      <React.Fragment>
        {this.renderComponent({
          value,
          disabled: getBoolean(disabled),
          readonly: getBoolean(readonly),
          placeholder,
          height,
          width,
          onChange: async (value: string) => await this.props.onValueSet('', value, await this.validate(value))
        })}
      </React.Fragment>
    )
  }
}

