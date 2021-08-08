import React from 'react'
import { getBoolean } from '../../../util/value'
import { Field, FieldConfig, FieldError, IField } from '../common'

export interface TextFieldConfig extends FieldConfig {
  type: 'text'
  characterType?: {
    enable: boolean
    number?: boolean
    uppercase?: boolean
    lowercase?: boolean
    cjk?: boolean
    underline?: boolean
    hyphen?: boolean
  }
  maxLength?: number
  minLength?: number
  cjkLength?: number
  placeholder?: string
  regExp?: { expression: string, message?: string }
}

export interface ITextField {
  value: string,
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  onChange: (value: string) => Promise<void>
}

export default class TextField extends Field<TextFieldConfig, ITextField, string> implements IField<string> {
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
        label,
        required,
        characterType,
        maxLength,
        minLength,
        cjkLength,
        regExp
      }
    } = this.props

    const errors: FieldError[] = []

    if (getBoolean(required)) {
      if (value === '' || value === undefined) {
        errors.push(new FieldError(`请输入${label}`))
      }
    }

    if (characterType && characterType.enable) {
      let valueTextType = value
      const types: string[] = []
      if (characterType.number) {
        valueTextType = valueTextType.replace(/[0-9]/g, '')
        types.push('数字')
      }
      if (characterType.uppercase) {
        valueTextType = valueTextType.replace(/[A-Z]/g, '')
        types.push('大写拉丁字母')
      }
      if (characterType.lowercase) {
        valueTextType = valueTextType.replace(/[a-z]/g, '')
        types.push('小写拉丁字母')
      }
      if (characterType.cjk) {
        valueTextType = valueTextType.replace(/[\u4e00-\u9fa5]/g, '')
        types.push('中日韩字符')
      }
      if (characterType.underline) {
        valueTextType = valueTextType.replace(/_/g, '')
        types.push('下划线')
      }
      if (characterType.hyphen) {
        valueTextType = valueTextType.replace(/-/g, '')
        types.push('中划线')
      }
      if (valueTextType.length > 0) {
        errors.push(new FieldError(`仅能输入${types.join('、')}`))
      }
    }

    if (maxLength !== undefined) {
      let valueMaxLength = value
      if (cjkLength !== undefined) {
        let valueMaxCJKLength = ''
        for (let valueMaxCJKIndex = 0; valueMaxCJKIndex < cjkLength; valueMaxCJKIndex++) {
          valueMaxCJKLength += '*'
        }
        valueMaxLength = valueMaxLength.replace(/[\u4e00-\u9fa5]/g, valueMaxCJKLength)
      }
      if (valueMaxLength && valueMaxLength.length > maxLength) {
        errors.push(new FieldError(`最长可输入${maxLength}个字符。`))
      }
    }

    if (minLength !== undefined) {
      let valueMinLength = value
      if (cjkLength !== undefined) {
        let valueMinCJKLength = ''
        for (let valueMinCJKIndex = 0; valueMinCJKIndex < cjkLength; valueMinCJKIndex++) {
          valueMinCJKLength += '*'
        }
        valueMinLength = valueMinLength.replace(/[\u4e00-\u9fa5]/g, valueMinCJKLength)
      }
      if (valueMinLength && valueMinLength.length < minLength) {
        errors.push(new FieldError(`最短需输入${minLength}个字符。`))
      }
    }

    if (regExp !== undefined) {
      if (!(new RegExp(regExp.expression)).test(value)) {
        if (regExp.message) {
          errors.push(new FieldError(regExp.message))
        } else {
          errors.push(new FieldError('格式错误'))
        }
      }
    }

    return errors.length ? errors : true
  }

  renderComponent = (props: ITextField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现TextField组件。
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
        readonly,
        placeholder
      },
      onChange
    } = this.props

    return (
      <React.Fragment>
        {this.renderComponent({
          value,
          disabled: getBoolean(disabled),
          readonly: getBoolean(readonly),
          placeholder,
          onChange: async (value: string) => await onChange(value)
        })}
      </React.Fragment>
    )
  }
}
