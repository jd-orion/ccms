import React from 'react'
import { DatetimeFieldConfig } from '.'
import { Display } from '../common'
import moment from 'moment'

export interface IDatetimeField {
  value: moment.Moment | null
  format: string
  mode?: 'time' | 'date' | 'datetime' | 'week' | 'month' | 'quarter' | 'year'
}

export default class DatetimeField extends Display<DatetimeFieldConfig, IDatetimeField, string> {
  renderComponent = (props: IDatetimeField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现DatetimeField组件。
    </React.Fragment>
  }

  render = () => {
    const {
      value,
      config: {
        submitFormat,
        format
      }
    } = this.props
    return (
      <React.Fragment>
        {
          this.renderComponent({
            value: value && moment(value, submitFormat).isValid() ? moment(value, submitFormat) : null,
            format: format || 'YYYY-MM-DD HH:mm:ss'
          })
        }
      </React.Fragment>
    )
  }
}
