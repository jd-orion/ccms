import * as React from 'react'
import { DatetimeField } from 'ccms'
import { DatePicker } from 'antd'
import { IDatetimeField, DatetimeFieldConfig } from 'ccms/dist/src/components/formFields/datetime'
import moment from 'moment'
import 'antd/lib/date-picker/style/index.css'

export const PropsType = (props: DatetimeFieldConfig) => { }

export default class DatetimeFieldComponent extends DatetimeField {
    renderComponent = (props: IDatetimeField) => {
      const {
        value,
        mode,
        placeholder,
        onChange
      } = props
      return (
            <DatePicker
                {...props}
                value={value ? moment(value) : null}
                picker={mode || 'date'}
                placeholder={placeholder}
                onChange={async (time) => {
                  const rs = time === null ? '' : moment(time).format()
                  await onChange(rs)
                }}
            />)
    }
}
