import React from 'react'
import { DatetimeRangeField } from 'ccms'
import { DatePicker } from 'antd'
import { IDatetimeRangeField, DatetimeRangeFieldConfig } from 'ccms/dist/src/components/formFields/datetimeRange'
import moment from 'moment'
import 'antd/lib/date-picker/style/index.css'
import "moment/locale/zh-cn";
import locale from 'antd/es/date-picker/locale/zh_CN'
const { RangePicker } = DatePicker

export const PropsType = (props: DatetimeRangeFieldConfig) => { }

export default class DatetimeRangeFieldComponent extends DatetimeRangeField {
  renderComponent = (props: IDatetimeRangeField) => {
    const {
      value,
      onChange,
      format,
      placeholder,
      showTime
    } = props
    const theValue: any = []
    if (value) {
      value.forEach((v: any) => {
        v && theValue.push(moment(v))
      })
    }
    const theplaceholder = placeholder || '请选择'
    return (
      <RangePicker
        locale={locale}
        placeholder={[theplaceholder, theplaceholder]}
        value={theValue}
        format={format}
        showTime={showTime}
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
      />)
  }
}
