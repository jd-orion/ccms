import React from "react";
import { DatetimeRangeField } from 'ccms';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
// import "antd/lib/date-picker/style/index.css"
import { IDatetimeRangeField, DatetimeRangeFieldConfig } from "ccms/dist/src/components/formFields/datetimeRange"
import moment from 'moment'

export const PropsType = (props: DatetimeRangeFieldConfig) => {};

export default class DatetimeRangeFieldComponent extends DatetimeRangeField {
    renderComponent = (props: IDatetimeRangeField) => {
        const {
            value,
            onChange,
            format,
        } = props
        const theValue: any = []
        if (value) {
            value.forEach((v: any) => {
                v && theValue.push(moment(v))
            })
        }
        return (
            <RangePicker
                value={theValue}
                format={format}
                onChange={async (time) => {
                    const changeValue : any = []
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