import React from 'react'
import { Field, FieldConfig, FieldError, IField, FieldInterface } from '../common'
import moment from 'moment'
import { getBoolean } from '../../../util/value'

export interface DatetimeFieldConfig extends FieldConfig, FieldInterface {
  type: 'datetime'
  regExp?: { expression?: string, message?: string }
  afterTime?: string
  beforeTime?: string
  format?: string
  submitFormat?: string
  placeholder?: string
  mode?: 'time' | 'date' | 'datetime' | 'week' | 'month' | 'quarter' | 'year'
}

export interface IDatetimeField {
  value: moment.Moment | null
  format: string
  readonly?: boolean
  disabled?: boolean
  mode?: 'time' | 'date' | 'datetime' | 'week' | 'month' | 'quarter' | 'year'
  placeholder?: string
  onChange: (value: moment.Moment | null) => Promise<void>
}

export default class DatetimeField extends Field<DatetimeFieldConfig, IDatetimeField, string> implements IField<string> {
  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()
    return (defaults === undefined) ? '' : defaults
  };

  validate = async (value: string): Promise<true | FieldError[]> => {
    const {
      config: {
        required,
        regExp
      }
    } = this.props

    const errors: FieldError[] = []

    if (getBoolean(required)) {
      if (value === null || value === '' || value === undefined) {
        errors.push(new FieldError('不能为空'))
      }
    }

    if (value === 'Invalid date') {
      errors.push(new FieldError('格式错误'))
    }

    if (regExp !== undefined) {
      if (value && regExp.expression && !(new RegExp(`${regExp.expression}`)).test(value.toString())) {
        if (regExp.message) {
          errors.push(new FieldError(regExp.message))
        } else {
          errors.push(new FieldError('格式错误'))
        }
      }
    }

    return errors.length ? errors : true
  }

  // get = async () => {
  //   const {
  //     value,
  //     config: {
  //       submitFormat,
  //       format = 'YYYY-MM-DD HH:mm:ss'
  //     }
  //   } = this.props

  //   if (!value) return ''

  //   const rsFormat = submitFormat || format

  //   const setValue = moment(value).format(rsFormat)

  //   return setValue
  // };

  renderComponent = (props: IDatetimeField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现DatetimeField组件。
      <div style={{ display: 'none' }}>
        <button onClick={() => props.onChange(moment())}>onChange</button>
      </div>
    </React.Fragment>
  }

  setChange = async (value: any) => {
    const {
      config: {
        submitFormat
      },
      onValueSet
    } = this.props
    if (value === null) {
      await onValueSet('', '', await this.validate(''))
    } else {
      await onValueSet('', value.format(submitFormat), await this.validate(value.format(submitFormat)))
    }
  }

  render = () => {
    const {
      value,
      config: {
        mode,
        disabled,
        readonly,
        placeholder,
        submitFormat,
        format
      }
    } = this.props
    return (
      <React.Fragment>
        {
          this.renderComponent({
            value: value && moment(value, submitFormat).isValid() ? moment(value, submitFormat) : null,
            format: format || 'YYYY-MM-DD HH:mm:ss',
            mode,
            disabled: getBoolean(disabled),
            readonly: getBoolean(readonly),
            placeholder,
            onChange: this.setChange
          })
        }
      </React.Fragment>
    )
  }
}
