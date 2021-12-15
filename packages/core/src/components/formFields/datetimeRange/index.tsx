import React from 'react'
import { Field, FieldConfig, FieldError, IField, FieldInterface } from '../common'
import moment from 'moment'
import { getBoolean } from '../../../util/value'

export interface DatetimeRangeFieldConfig extends FieldConfig, FieldInterface {
  type: 'datetimeRange'
  regExp?: { expression?: string, message?: string }
  format?: string
  submitFormat?: string
  submitFormatMode?: 'comma' | 'array'
  placeholder?: string
  fieldRange?: string
  mode?: 'time' | 'date' | 'datetime' | 'week' | 'month' | 'quarter' | 'year'
}

export interface IDatetimeRangeField {
  value?: moment.Moment[] | undefined[]
  format?: string
  disabled?: boolean
  readonly?: boolean
  mode?: 'time' | 'date' | 'datetime' | 'week' | 'month' | 'quarter' | 'year'
  placeholder?: string
  onChange: (value: moment.Moment[] | undefined[]) => Promise<void>
}

export default class DatetimeRangeField extends Field<DatetimeRangeFieldConfig, IDatetimeRangeField, string | string[] | number[] | undefined[] | undefined> implements IField<string | string[] | number[] | undefined[] | undefined> {
  // reset: () => Promise<IDatetimeRangeField['value']> = async () => {
  //   const defaults = await this.defaultValue()

  //   if (Object.prototype.toString.call(defaults) === '[object Array]') return defaults

  //   if (Object.prototype.toString.call(defaults) === '[object Object]') {
  //     const {
  //       config: {
  //         fieldRange,
  //         field
  //       }
  //     } = this.props
  //     const startTime = defaults[field]
  //     const endTime = fieldRange && defaults[fieldRange]
  //     return [startTime, endTime]
  //   }

  //   if (typeof defaults !== 'string') return undefined

  //   const startTime = defaults.split(',')[0]
  //   const endTime = defaults.split(',')[1]
  //   return [startTime, endTime]
  // };

  // get = async () => {
  //   const {
  //     value,
  //     config: {
  //       submitFormat,
  //       format = 'YYYY-MM-DD HH:mm:ss',
  //       submitFormatMode
  //     }
  //   } = this.props

  //   if (!value) return ''

  //   const theValue: any = []
  //   const rsFormat = submitFormat || format
  //   value.forEach((v: any) => {
  //     v && theValue.push(moment(v).format(rsFormat))
  //   })

  //   const setValue = submitFormatMode === 'comma' ? theValue.toString() : theValue

  //   return setValue
  // };

  validate = async (value: string | string[] | number[] | undefined[] | undefined): Promise<true | FieldError[]> => {
    const {
      config: {
        required
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
    return errors.length ? errors : true
  }

  // getTime = (time: string) => {
  //   const {
  //     config: {
  //       submitFormat,
  //       format = 'YYYY-MM-DD HH:mm:ss'
  //     }
  //   } = this.props
  //   if (!time) return ''
  //   return moment(time).format(submitFormat || format)
  // }

  // fieldFormat = async () => {
  //   const {
  //     value,
  //     config: {
  //       fieldRange,
  //       field
  //     }
  //   } = this.props
  //   if (fieldRange && value) {
  //     let startTime, endTime

  //     if (Object.prototype.toString.call(value) === '[object Array]') {
  //       startTime = value[0]
  //       endTime = value[1]
  //     }

  //     if (typeof value === 'string') {
  //       const stringValue: string = value
  //       startTime = this.getTime(stringValue.split(',')[0])
  //       endTime = this.getTime(stringValue.split(',')[1])
  //     }
  //     return {
  //       [fieldRange]: endTime,
  //       [field]: startTime
  //     }
  //   }
  //   return {}
  // };

  renderComponent = (props: IDatetimeRangeField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现DatetimeRangeField组件。
      <div style={{ display: 'none' }}>
        <button onClick={() => props.onChange([ undefined, undefined ])}>onChange</button>
      </div>
    </React.Fragment>
  }

  decode = (value: string | string[] | number[] | undefined[] | undefined) => {
    if (this.props.config.submitFormatMode === 'comma') {
      if (typeof value === 'string') {
        const values = value.split(',')
        const start = moment(values[0], this.props.config.submitFormat || 'YYYY-MM-DD HH:mm:ss')
        const end   = moment(values[1], this.props.config.submitFormat || 'YYYY-MM-DD HH:mm:ss')
        if (start.isValid() && end.isValid()) {
          return [start, end]
        }
      }
    } else {
      if (Array.isArray(value)) {
        const start = moment(value[0], this.props.config.submitFormat || 'YYYY-MM-DD HH:mm:ss')
        const end   = moment(value[1], this.props.config.submitFormat || 'YYYY-MM-DD HH:mm:ss')
        if (start.isValid() && end.isValid()) {
          return [start, end]
        }
      }
    }
    return [ undefined, undefined ]
  }

  encode = (value: moment.Moment[] | undefined[]) => {
    try {
      if (value[0]?.isValid() && value[1]?.isValid()) {
        const values = [value[0].format(this.props.config.submitFormat || 'YYYY-MM-DD HH:mm:ss'), value[1].format(this.props.config.submitFormat || 'YYYY-MM-DD HH:mm:ss')]
        if (this.props.config.submitFormatMode === 'comma') {
          return values.join(',')
        } else {
          return values
        }
      } else {
        return undefined
      }
    } catch (e) {
      return undefined
    }
  }

  render = () => {
    const {
      value,
      config: {
        mode,
        format,
        disabled,
        readonly,
        placeholder
      }
    } = this.props
    return (
      <React.Fragment>
        {this.renderComponent({
          value: this.decode(value),
          format: format || 'YYYY-MM-DD HH:mm:ss',
          mode,
          disabled: getBoolean(disabled),
          readonly: getBoolean(readonly),
          placeholder,
          onChange: async (value) => await this.props.onValueSet('', this.encode(value), await this.validate(this.encode(value)))
        })}
      </React.Fragment>
    )
  }
}
