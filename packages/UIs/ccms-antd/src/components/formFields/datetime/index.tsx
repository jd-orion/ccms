import * as React from 'react'
import { DatetimeField } from 'ccms'
import { DatePicker } from 'antd'
import { IDatetimeField, DatetimeFieldConfig } from 'ccms/dist/src/components/formFields/datetime'
import moment from 'moment'
import 'antd/lib/date-picker/style/index.css'
import "moment/locale/zh-cn";
import locale from 'antd/es/date-picker/locale/zh_CN'
export const PropsType = (props: DatetimeFieldConfig) => { }

export default class DatetimeFieldComponent extends DatetimeField {
  renderComponent = (props: IDatetimeField) => {
    const {
      value,
      mode,
      placeholder,
      onChange,
      showTime
    } = props
    return (
      <DatePicker
        locale={locale}
        {...props}
        value={value ? moment(value) : null}
        picker={mode || 'date'}
        showTime={showTime}
        placeholder={placeholder || '选择时间'}
        onChange={async (time) => {
          const rs = time === null ? '' : moment(time).format()
          await onChange(rs)
        }}
      />)
  }
}
