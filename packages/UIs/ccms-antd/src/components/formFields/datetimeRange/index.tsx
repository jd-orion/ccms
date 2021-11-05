import React from 'react'
import { DatetimeRangeField } from 'ccms'
import { DatePicker, TimePicker } from 'antd'
import { IDatetimeRangeField } from 'ccms/dist/src/components/formFields/datetimeRange'
import moment from 'moment'
import { RangePickerProps } from 'antd/lib/date-picker/generatePicker'
const { RangePicker: DateRangePicker } = DatePicker
const { RangePicker: TimeRangePicker } = TimePicker
import pickerLocale from 'antd/lib/date-picker/locale/zh_CN'

export default class DatetimeRangeFieldComponent extends DatetimeRangeField {
  renderComponent = (props: IDatetimeRangeField) => {
    const {
      value,
      mode
    } = props

    let _value: RangePickerProps<moment.Moment>['value'] = undefined
    if (value && value[0] && value[1]) _value = [value[0], value[1]]

    if (mode === 'time') {
      return (
        <TimeRangePicker
          style={{ width: '100%' }}
          value={_value}
          format={props.format}
          locale={pickerLocale}
          onChange={async (time) => await props.onChange(time ? [time[0] as moment.Moment, time[1] as moment.Moment] : [undefined, undefined])}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
        />
      )
    } else if (mode === 'date') {
      return (
        <DateRangePicker
          style={{ width: '100%' }}
          value={_value}
          format={props.format}
          locale={pickerLocale}
          onChange={async (time) => await props.onChange(time ? [time[0] as moment.Moment, time[1] as moment.Moment] : [undefined, undefined])}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
        />
      )
    } else if (mode === 'datetime') {
      return (
        <DateRangePicker
          style={{ width: '100%' }}
          value={_value}
          format={props.format}
          locale={pickerLocale}
          showTime={true}
          onChange={async (time) => await props.onChange(time ? [time[0] as moment.Moment, time[1] as moment.Moment] : [undefined, undefined])}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
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
          onChange={async (time) => await props.onChange(time ? [time[0] as moment.Moment, time[1] as moment.Moment] : [undefined, undefined])}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
        />
      )
    }
  }
}
