import * as React from 'react'
import { DatetimeField } from 'ccms'
import { DatePicker, TimePicker } from 'antd'
import 'antd/lib/date-picker/style'
import 'antd/lib/time-picker/style'
import { IDatetimeField } from 'ccms/dist/components/formFields/datetime'
import pickerLocale from 'antd/lib/date-picker/locale/zh_CN'

export default class DatetimeFieldComponent extends DatetimeField {
  renderComponent = (props: IDatetimeField) => {
    const { value, mode, placeholder } = props

    if (mode === 'time') {
      return (
        <TimePicker
          style={{ width: '100%' }}
          value={value}
          format={props.format}
          locale={pickerLocale}
          placeholder={placeholder}
          onChange={async (time) => props.onChange(time)}
          getPopupContainer={(ele) => ele.parentElement || document.body}
        />
      )
    } else if (mode === 'date') {
      return (
        <DatePicker
          style={{ width: '100%' }}
          value={value}
          format={props.format}
          locale={pickerLocale}
          placeholder={placeholder}
          onChange={async (time) => props.onChange(time)}
          getPopupContainer={(ele) => ele.parentElement || document.body}
        />
      )
    } else if (mode === 'datetime') {
      return (
        <DatePicker
          style={{ width: '100%' }}
          value={value}
          format={props.format}
          locale={pickerLocale}
          placeholder={placeholder}
          showTime
          onChange={async (time) => props.onChange(time)}
          getPopupContainer={(ele) => ele.parentElement || document.body}
        />
      )
    } else {
      return (
        <DatePicker
          style={{ width: '100%' }}
          value={value}
          format={props.format}
          picker={mode}
          locale={pickerLocale}
          placeholder={placeholder}
          onChange={async (time) => props.onChange(time)}
          getPopupContainer={(ele) =>
            document.getElementById('ccms-antd-mini') ||
            document.getElementById('ccms-antd-mini-form') ||
            ele.parentElement ||
            document.body
          }
        />
      )
    }
  }
}
