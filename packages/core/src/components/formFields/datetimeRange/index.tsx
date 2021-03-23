import React from "react";
import { Field, FieldConfig, FieldError, IField, FieldInterface } from "../common";
import moment from 'moment'

export interface DatetimeRangeFieldConfig extends FieldConfig, FieldInterface {
    type: 'datetimeRange'
    regExp?: { expression?: string, message?: string }
    format?: string
    submitFormat?: string
    submitFormatMode?: 'comma' | 'array'
    fieldRange?: string
}

export interface IDatetimeRangeField {
    value?: any
    format?: string
    disabled?: boolean
    readonly?: boolean
    onChange: (value: IDatetimeRangeField['value']) => Promise<void>
}

export default class DatetimeRangeField extends Field<DatetimeRangeFieldConfig, IDatetimeRangeField, IDatetimeRangeField['value']> implements IField<IDatetimeRangeField['value']> {
    reset: () => Promise<IDatetimeRangeField['value']> = async () => {
        let defaults = await this.defaultValue()

        if (Object.prototype.toString.call(defaults) === '[object Array]') return defaults;

        if (Object.prototype.toString.call(defaults) === '[object Object]') {
            const {
                config: {
                    fieldRange,
                    field
                }
            } = this.props
            const startTime = defaults[field]
            const endTime = fieldRange && defaults[fieldRange]
            return [startTime, endTime]
        }

        if (typeof defaults !== 'string') return undefined

        const startTime = defaults.split(',')[0]
        const endTime = defaults.split(',')[1]
        return [startTime, endTime]

    };

    get = async () => {
        const {
            value,
            config: {
                submitFormat,
                format = "YYYY-MM-DD HH:mm:ss",
                submitFormatMode
            }
        } = this.props

        if (!value) return '';

        const theValue: any = []
        const rsFormat = submitFormat || format
        value.forEach((v: any) => {
            v && theValue.push(moment(v).format(rsFormat))
        })

        const setValue = submitFormatMode === 'comma' ? theValue.toString() : theValue

        return setValue
    };

    validate = async (value: IDatetimeRangeField['value']): Promise<true | FieldError[]> => {
        const {
            config: {
                required,
                regExp
            }
        } = this.props

        const errors: FieldError[] = []
        if (required) {
            if (value === null || value === undefined) {
                errors.push(new FieldError('不能为空'))
            }
            if (value?.toString() === '') {
                errors.push(new FieldError('不能为空'))
            }
        }

        if (regExp !== undefined && value) {
            if (regExp.expression && new RegExp(`${regExp.expression}`).test(String(value))) return true
            if (regExp.message) {
                errors.push(new FieldError(regExp.message))
            } else {
                errors.push(new FieldError('格式错误'))
            }
        }

        return errors.length ? errors : true;
    }

    getTime = (time: string) => {
        const {
            config: {
                submitFormat,
                format = 'YYYY-MM-DD HH:mm:ss'
            }
        } = this.props
        if (!time) return '';
        return moment(time).format(submitFormat || format)
    }

    fieldFormat = async () => {
        const {
            value,
            config: {
                fieldRange,
                field
            }
        } = this.props
        if (fieldRange && value) {
            let startTime, endTime;

            if (Object.prototype.toString.call(value) === '[object Array]') {
                startTime = value[0]
                endTime = value[1]
            }

            if (typeof value === 'string') {
                const stringValue: string = value
                startTime = this.getTime(stringValue.split(',')[0])
                endTime = this.getTime(stringValue.split(',')[1])
            }
            return {
                [fieldRange]: endTime,
                [field]: startTime
            }
        }
        return {}
    };

    renderComponent = (props: IDatetimeRangeField) => {
        return <React.Fragment>
            您当前使用的UI版本没有实现DatetimeRangeField组件。
        <div style={{ display: 'none' }}>
                <button onClick={() => props.onChange(undefined)}>onChange</button>
            </div>
        </React.Fragment>
    }

    render = () => {
        const {
            value,
            config: {
                format,
                disabled,
                readonly
            },
            onChange
        } = this.props
        return (
            <React.Fragment>
                {this.renderComponent({
                    value,
                    format,
                    disabled,
                    readonly,
                    onChange: async (value: IDatetimeRangeField['value']) => onChange(value)
                })}
            </React.Fragment>
        )
    }
}