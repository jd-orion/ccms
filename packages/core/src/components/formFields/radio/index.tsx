import React from "react";
import { Field, FieldConfig, FieldError, IField, FieldInterface } from "../common";

export interface RadioFieldConfig extends FieldConfig, FieldInterface {
    type: 'radio'
    options?: any
    regExp?: { expression: string, message?: string }
}

export interface IRadioField {
    value: string,
    options?: any,
    onChange: (value: string) => Promise<void>
}

export default class RadioField extends Field<RadioFieldConfig, IRadioField, string> implements IField<string> {
    reset: () => Promise<string> = async () => {
        const defaults = await this.defaultValue();

        if (defaults === undefined) {
            return ''
        } else {
            return defaults
        }
    };
    validate = async (value: string): Promise<true | FieldError[]> => {
        const {
            config: {
                required,
                regExp
            }
        } = this.props

        const errors: FieldError[] = []

        if (required) {
            if (value === '') {
                errors.push(new FieldError('不能为空'))
            }
        }

        if (regExp !== undefined) {
            if (!(new RegExp(regExp.expression)).test(value)) {
                if (regExp.message) {
                    errors.push(new FieldError(regExp.message))
                } else {
                    errors.push(new FieldError('格式错误'))
                }
            }
        }

        return errors.length ? errors : true;
    }

    renderComponent = (props: IRadioField) => {
        return <React.Fragment>
            您当前使用的UI版本没有实现TextField组件。
        <div style={{ display: 'none' }}>
                <button onClick={() => props.onChange('onChange')}>onChange</button>
            </div>
        </React.Fragment>
    }

    render = () => {
        const {
            value,
            config,
            onChange
        } = this.props
        return (
            <React.Fragment>
                {this.renderComponent({
                    value,
                    options: config.options,
                    onChange: async (value: string) => await onChange(value)
                })}
            </React.Fragment>
        )
    }
}