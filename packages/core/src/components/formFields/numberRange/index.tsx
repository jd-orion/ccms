import React from "react";
import { Field, FieldConfig, FieldError, IField, FieldInterface } from "../common";

export interface NumberRangeFieldConfig extends FieldConfig, FieldInterface {
    type: 'number'
    regExp?: { expression?: string, message?: string }
    max?: number
    min?: number
    precision?: number
    step?: number
    fieldRange?: string
}

export interface INumberRangeField {
    value: string | undefined,
    step?: number,
    precision?: number,
    onChange: (value: string | undefined) => Promise<void>
}

export default class NumberRangeField extends Field<NumberRangeFieldConfig, INumberRangeField, string | undefined> implements IField<string | undefined> {
    reset: () => Promise<string | undefined> = async () => {
        let defaults = await this.defaultValue()
        return (defaults === undefined) ? 0 : defaults;
    };
    validate = async (value: string | undefined): Promise<true | FieldError[]> => {
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
            if (value === null) {
                errors.push(new FieldError('不能为空'))
            }
        }

        let nvalue: number = isNaN(Number(value)) ? 0
        : typeof value === 'number' ? value
            : Number(value);

        if (min && nvalue < min) {
            errors.push(new FieldError(`值不能小于${min}`))
        }
        if (max && nvalue > max) {
            errors.push(new FieldError(`值不能大于${max}`))
        }


        if (regExp !== undefined) {
            if (value && !(new RegExp(`${regExp.expression}`)).test(value.toString())) {
                if (regExp.message) {
                    errors.push(new FieldError(regExp.message))
                } else {
                    errors.push(new FieldError('格式错误'))
                }
            }
        }
        // if (precision && precision > 0) {
        //     const stepReg = new RegExp(`\\d.\\d{${precision}}`);
        //     if (/./.test(stringValue)){
        //         const precisionErr = stepReg.test(stringValue) === false;
        //         precisionErr && errors.push(new FieldError(`必须为${precision}小数`))
        //     }
        // }

        return errors.length ? errors : true;
    }

    renderComponent = (props: INumberRangeField) => {
        return <React.Fragment>
            您当前使用的UI版本没有实现NumberRangeField组件。
        <div style={{ display: 'none' }}>
                <button onClick={() => props.onChange('')}>onChange</button>
            </div>
        </React.Fragment>
    }

    render = () => {
        const {
            value,
            onChange,
            config
        } = this.props
        return (
            <React.Fragment>
                {this.renderComponent({
                    value,
                    step: config.step,
                    precision: config.precision,
                    onChange: async (value: string | undefined) => onChange(value)
                })}
            </React.Fragment>
        )
    }
}