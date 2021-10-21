import * as React from 'react'
import { DatetimeField } from 'ccms'
import { DatePicker, TimePicker,ConfigProvider } from 'antd'
import { IDatetimeField, DatetimeFieldConfig } from 'ccms/dist/src/components/formFields/datetime'
import locale from 'antd/lib/locale/zh_CN';

export const PropsType = (props: DatetimeFieldConfig) => { }

export default class DatetimeFieldComponent extends DatetimeField {
  renderComponent = (props: IDatetimeField) => {
    const {
      value,
      mode,
      placeholder
    } = props

    if (mode === 'time') {
      return (
        <ConfigProvider locale={locale}>
          <TimePicker
            style={{ width: '100%' }}
            value={value}
            format={props.format}
            placeholder={placeholder}
            onChange={async (time) => await props.onChange(time)}
            getPopupContainer={(trigger) => trigger.parentElement || document.body}
          />
        </ConfigProvider>
      )
    } else if (mode === 'date') {
      return (
        <DatePicker
          style={{ width: '100%' }}
          value={value}
          format={props.format}
          placeholder={placeholder}
          onChange={async (time) => await props.onChange(time)}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
        />
      )
    } else if (mode === 'datetime') {
      return (
        <DatePicker
          style={{ width: '100%' }}
          value={value}
          format={props.format}
          placeholder={placeholder}
          showTime={true}
          onChange={async (time) => await props.onChange(time)}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
        />
      )
    } else {
      return (
        <DatePicker
          style={{ width: '100%' }}
          value={value}
          format={props.format}
          picker={mode}
          placeholder={placeholder}
          onChange={async (time) => await props.onChange(time)}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
        />)
    }
  }
}
