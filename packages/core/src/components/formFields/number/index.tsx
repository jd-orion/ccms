
import React from "react";
import { Field, FieldConfig, FieldError, IField, FieldInterface } from "../common";

export interface NumberFieldConfig extends FieldConfig, FieldInterface {
    type: 'number'
    regExp?: { expression?: string, message?: string }
    max?: number
    min?: number
    precision?: number
    step?: number
}

export interface INumberField {
    value?: number | undefined,
    step?: number,
    readonly?: boolean,
    precision?: number
    disabled?: boolean,
    onChange: (value: string | number | undefined) => Promise<void>
}

export default class NumberField extends Field<NumberFieldConfig, INumberField, string | number | undefined> implements IField<string | number | undefined> {
    reset: () => Promise<string | number | undefined> = async () => {
        let defaults = await this.defaultValue()
        return (defaults === undefined) ? '' : defaults;
    };


    get = async () => {
        const {
            value
        } = this.props
        let rs = (typeof value === 'string') ? value.replace(/[^0-9]/ig, "") : value;
        return rs
    };

    fieldFormat = async () => {
        const {
            value,
            config: {
                precision,
                field
            }
        } = this.props
        const setValue = Number(value).toFixed(precision).toString()
        if (value && precision) {
            return {
                [field]: setValue
            }
        }
        return {}
    };

    validate = async (value: string | number | undefined): Promise<true | FieldError[]> => {
        const {
            config: {
                required,
                regExp,
                max,
                min,
                precision
            }
        } = this.props

        const errors: FieldError[] = []

        if (required) {
            if (value === undefined || value === '' || value === null) {
                errors.push(new FieldError('不能为空'))
            }
        }

        if (value) {

            if (min && value < min) {
                errors.push(new FieldError(`值不能小于${min}`))
            }
            if (max && value > max) {
                errors.push(new FieldError(`值不能大于${max}`))
            }

            if (errors.length > 0) return errors;

            if (regExp !== undefined) {
                if (new RegExp(`${regExp.expression}`).test(value.toString())) return true;
                if (regExp.message) {
                    errors.push(new FieldError(regExp.message))
                } else {
                    errors.push(new FieldError('格式错误'))
                }

            }

            if (!Number.isInteger(value) && precision && precision > 0) {
                const stringValue = value.toString()
                const stepReg = new RegExp(`\\d.\\d{${precision}}`);
                const precisionErr = stepReg.test(stringValue) === false;
                precisionErr && errors.push(new FieldError(`必须为${precision}小数`))
            }
        }

        return errors.length ? errors : true;
    }

    renderComponent = (props: INumberField) => {
        return <React.Fragment>
            您当前使用的UI版本没有实现NumberField组件。
        <div style={{ display: 'none' }}>
                <button onClick={() => props.onChange(undefined)}>onChange</button>
            </div>
        </React.Fragment>
    }

    render = () => {
        const {
            value,
            onChange,
            config: {
                precision,
                readonly,
                disabled,
                step
            }
        } = this.props

        return (
            <React.Fragment>
                {this.renderComponent({
                    value: value || value === 0 ? Number(value) : undefined,
                    readonly,
                    disabled,
                    precision,
                    step,
                    onChange: async (value: string | number | undefined) => onChange(value)
                })}
            </React.Fragment>
        )
    }
}