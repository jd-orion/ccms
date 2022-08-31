import React from "react";
import { ColorField } from 'ccms';
import ColorComponent from './sketchpicker'
import { IColorField, ColorFieldConfig } from "ccms/dist/components/formFields/color";

export const PropsType = (props: ColorFieldConfig) => { };

export default class ColorFieldComponent extends ColorField {
    renderComponent = (props: IColorField) => {
        const {
            value,
            onChange,
            readonly,
            disabled
        } = props

        return (
            <ColorComponent value={value} onChange={onChange} readonly={readonly} disabled={disabled} />
        )
    }
}