import React from 'react'
import { DatetimeRangeField } from 'ccms'
import { DatePicker, TimePicker } from 'antd'
import 'antd/lib/date-picker/style'
import 'antd/lib/time-picker/style'
import { RangePickerProps } from 'antd/lib/date-picker/generatePicker'
import pickerLocale from 'antd/lib/date-picker/locale/zh_CN'
import { IDatetimeRangeField } from 'ccms/dist/components/formFields/datetimeRange'
import './index.less'

const { RangePicker: DateRangePicker } = DatePicker
const { RangePicker: TimeRangePicker } = TimePicker

export default class DatetimeRangeFieldComponent extends DatetimeRangeField {
  renderComponent = (props: IDatetimeRangeField) => {
    const { value, disabled, readonly, mode } = props

    let _value: RangePickerProps<moment.Moment>['value']
    if (value && value[0] && value[1]) _value = [value[0], value[1]]

    if (mode === 'time') {
      return (
        <TimeRangePicker
          className={readonly ? 'picker-readonly' : undefined}
          disabled={disabled || readonly}
          inputReadOnly={readonly}
          style={{ width: '100%' }}
          value={_value}
          format={props.format}
          locale={pickerLocale}
          onChange={async (time) =>
            props.onChange(time ? [time[0] as moment.Moment, time[1] as moment.Moment] : [undefined, undefined])
          }
          getPopupContainer={(ele) => ele.parentElement || document.body}
        />
      )
    } else if (mode === 'date') {
      return (
        <DateRangePicker
          disabled={disabled}
          inputReadOnly={readonly || readonly}
          style={{ width: '100%' }}
          value={_value}
          format={props.format}
          locale={pickerLocale}
          onChange={async (time) =>
            props.onChange(time ? [time[0] as moment.Moment, time[1] as moment.Moment] : [undefined, undefined])
          }
          getPopupContainer={(ele) => ele.parentElement || document.body}
        />
      )
    } else if (mode === 'datetime') {
      return (
        <DateRangePicker
          className={readonly ? 'picker-readonly' : undefined}
          disabled={disabled || readonly}
          inputReadOnly={readonly}
          style={{ width: '100%' }}
          value={_value}
          format={props.format}
          locale={pickerLocale}
          showTime
          onChange={async (time) =>
            props.onChange(time ? [time[0] as moment.Moment, time[1] as moment.Moment] : [undefined, undefined])
          }
          getPopupContainer={(ele) => ele.parentElement || document.body}
        />
      )
    } else {
      return (
        <DateRangePicker
          className={readonly ? 'picker-readonly' : undefined}
          disabled={disabled || readonly}
          inputReadOnly={readonly}
          style={{ width: '100%' }}
          value={_value}
          format={props.format}
          picker={mode}
          locale={pickerLocale}
          onChange={async (time) =>
            props.onChange(time ? [time[0] as moment.Moment, time[1] as moment.Moment] : [undefined, undefined])
          }
          getPopupContainer={(ele) => ele.parentElement || document.body}
        />
      )
    }
  }
}
