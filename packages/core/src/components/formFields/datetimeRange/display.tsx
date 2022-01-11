import React from 'react'
import { DatetimeRangeFieldConfig } from '.'
import { Display } from '../common'
import moment from 'moment'

export interface IDatetimeRangeField {
  value?: moment.Moment[] | undefined[]
  format?: string,
  mode?: 'time' | 'date' | 'datetime' | 'week' | 'month' | 'quarter' | 'year'
}

export default class DatetimeRangeField extends Display<DatetimeRangeFieldConfig, IDatetimeRangeField, string | string[] | number[] | undefined[] | undefined> {
  renderComponent = (props: IDatetimeRangeField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现DatetimeRangeField组件。
    </React.Fragment>
  }

  decode = (value: string | string[] | number[] | undefined[] | undefined) => {
    if (this.props.config.submitFormatMode === 'comma') {
      if (typeof value === 'string') {
        const values = value.split(',')
        const start = moment(values[0], this.props.config.submitFormat || 'YYYY-MM-DD HH:mm:ss')
        const end = moment(values[1], this.props.config.submitFormat || 'YYYY-MM-DD HH:mm:ss')
        if (start.isValid() && end.isValid()) {
          return [start, end]
        }
      }
    } else {
      if (Array.isArray(value)) {
        const start = moment(value[0], this.props.config.submitFormat || 'YYYY-MM-DD HH:mm:ss')
        const end = moment(value[1], this.props.config.submitFormat || 'YYYY-MM-DD HH:mm:ss')
        if (start.isValid() && end.isValid()) {
          return [start, end]
        }
      }
    }
    return [undefined, undefined]
  }

  render = () => {
    const {
      value,
      config: {
        format
      }
    } = this.props
    return (
      <React.Fragment>
        {this.renderComponent({
          value: this.decode(value),
          format: format || 'YYYY-MM-DD HH:mm:ss'
        })}
      </React.Fragment>
    )
  }
}
