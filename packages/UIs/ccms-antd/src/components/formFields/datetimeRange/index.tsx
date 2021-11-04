import React from 'react'
import { DatetimeRangeField } from 'ccms'
import { DatePicker, ConfigProvider } from 'antd'
import { IDatetimeRangeField, DatetimeRangeFieldConfig } from 'ccms/dist/src/components/formFields/datetimeRange'
import moment from 'moment'
import locale from 'antd/lib/locale/zh_CN';
const { RangePicker } = DatePicker

export const PropsType = (props: DatetimeRangeFieldConfig) => { }

export default class DatetimeRangeFieldComponent extends DatetimeRangeField {
  renderComponent = (props: IDatetimeRangeField) => {
    const {
      value,
      onChange,
      format,
      placeholder
    } = props
    const theValue: any = []
    if (value) {
      value.forEach((v: any) => {
        v && theValue.push(moment(v))
      })
    }
    const theplaceholder = placeholder || '请选择'
    return (
      <ConfigProvider locale={locale}>
        <RangePicker
          placeholder={[theplaceholder, theplaceholder]}
          value={theValue}
          format={format}
          showTime={true}
          onChange={async (time) => {
            const changeValue: any = []
            if (time) {
              time.forEach((v: any) => {
                v && changeValue.push(moment(v).format(format))
              })
            }
            const rs = time ? changeValue : undefined
            await onChange(rs)
          }}
        />
      </ConfigProvider>)
  }
}
