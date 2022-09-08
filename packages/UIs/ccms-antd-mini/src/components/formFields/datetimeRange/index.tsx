import React from 'react'
import { DatetimeRangeField } from 'ccms'
import { DatePicker, TimePicker } from 'antd'
import 'antd/lib/date-picker/style'
import 'antd/lib/time-picker/style'
import { IDatetimeRangeField } from 'ccms/dist/components/formFields/datetimeRange'
import { RangePickerProps } from 'antd/lib/date-picker/generatePicker'
import pickerLocale from 'antd/lib/date-picker/locale/zh_CN'

const { RangePicker: DateRangePicker } = DatePicker
const { RangePicker: TimeRangePicker } = TimePicker

export default class DatetimeRangeFieldComponent extends DatetimeRangeField {
  renderComponent = (props: IDatetimeRangeField) => {
    const { value, mode } = props

    let _value: RangePickerProps<moment.Moment>['value']
    if (value && value[0] && value[1]) _value = [value[0], value[1]]

    if (mode === 'time') {
      return (
        <TimeRangePicker
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
