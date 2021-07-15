import React from "react";
import { Field, FieldConfig, FieldError, IField, FieldInterface } from "../common";
import moment from 'moment'
import { getBoolean } from "../../../util/value";

export interface DatetimeFieldConfig extends FieldConfig, FieldInterface {
    type: 'datetime'
    regExp?: { expression?: string, message?: string }
    afterTime?: string
    beforeTime?: string
    format?: string
    submitFormat?: string
    placeholder?: string
    mode?: 'time' | 'date' | 'month' | 'year'
}

export interface IDatetimeField {
    value: string
    format?: string
    submitFormat?: string
    readonly?: boolean
    disabled?: boolean
    mode?: 'time' | 'date' | 'month' | 'year'
    placeholder?: string
    onChange: (value: string) => Promise<void>
}

export default class DatetimeField extends Field<DatetimeFieldConfig, IDatetimeField, string> implements IField<string> {
    reset: () => Promise<string> = async () => {
        let defaults = await this.defaultValue()
        return (defaults === undefined) ? '' : defaults;
    };

    get = async () => {
        const {
            value,
            config: {
                submitFormat,
                format
            }
        } = this.props

        const rsFormat = submitFormat || format || "YYYY-MM-DD HH:mm:ss"
        const setValue = value ? moment(value).format(rsFormat) : ''
        return setValue
    };

    validate = async (value: string): Promise<true | FieldError[]> => {
        const {
            config: {
                required,
                regExp
            }
        } = this.props

        const errors: FieldError[] = []

        if (getBoolean(required)) {
            if (value === null || value === '' || value === undefined) {
                errors.push(new FieldError('不能为空'))
            }
        }

        if (value === 'Invalid date') {
            errors.push(new FieldError('格式错误'))
        }

        if (regExp !== undefined) {
            if (value && regExp.expression && !(new RegExp(`${regExp.expression}`)).test(value.toString())) {
                if (regExp.message) {
                    errors.push(new FieldError(regExp.message))
                } else {
                    errors.push(new FieldError('格式错误'))
                }
            }
        }

        return errors.length ? errors : true;
    }

    renderComponent = (props: IDatetimeField) => {
        return <React.Fragment>
            您当前使用的UI版本没有实现DatetimeField组件。
        <div style={{ display: 'none' }}>
                <button onClick={() => props.onChange('')}>onChange</button>
            </div>
        </React.Fragment>
    }

    render = () => {
        const {
            value,
            config: {
                format,
                mode,
                disabled,
                readonly,
                placeholder
            },
            onChange
        } = this.props
        return (
            <React.Fragment>
                {this.renderComponent({
                    value,
                    format,
                    mode,
                    disabled: getBoolean(disabled),
                    readonly: getBoolean(readonly),
                    placeholder,
                    onChange: async (value: string) => onChange(value)
                })}
            </React.Fragment>
        )
    }
}