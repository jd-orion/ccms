import React from "react";
import { NumberField } from 'ccms';
import { InputNumber } from 'antd';
import { INumberField, NumberFieldConfig } from "ccms/dist/src/components/formFields/number";

export const PropsType = (props: NumberFieldConfig) => { };

export default class NumberFieldComponent extends NumberField {
    renderComponent = (props: INumberField) => {
        const {
            value,
            onChange,
            step
        } = props
        return (
            <InputNumber
                {...props}
                value={value}
                step={step}
                onChange={async (e) => {
                    await onChange(e)
                }}
            />
        )
    }
}