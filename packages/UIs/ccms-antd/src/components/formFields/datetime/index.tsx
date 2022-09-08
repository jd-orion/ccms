import * as React from 'react'
import { DatetimeField } from 'ccms'
import { DatePicker, TimePicker } from 'antd'
import 'antd/lib/date-picker/style'
import 'antd/lib/time-picker/style'
import { IDatetimeField } from 'ccms/dist/components/formFields/datetime'
import pickerLocale from 'antd/lib/date-picker/locale/zh_CN'
import './index.less'

export default class DatetimeFieldComponent extends DatetimeField {
  renderComponent = (props: IDatetimeField) => {
    const { value, disabled, readonly, mode, placeholder } = props

    if (mode === 'time') {
      return (
        <TimePicker
          className={readonly ? 'picker-readonly' : undefined}
          disabled={disabled || readonly}
          inputReadOnly={readonly}
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
          className={readonly ? 'picker-readonly' : undefined}
          disabled={disabled || readonly}
          inputReadOnly={readonly}
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
          className={readonly ? 'picker-readonly' : undefined}
          disabled={disabled || readonly}
          inputReadOnly={readonly}
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
          className={readonly ? 'picker-readonly' : undefined}
          disabled={disabled || readonly}
          inputReadOnly={readonly}
          style={{ width: '100%' }}
          value={value}
          format={props.format}
          picker={mode}
          locale={pickerLocale}
          placeholder={placeholder}
          onChange={async (time) => props.onChange(time)}
          getPopupContainer={(ele) => ele.parentElement || document.body}
        />
      )
    }
  }
}
