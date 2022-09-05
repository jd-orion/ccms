import React from 'react'
import { ColorField } from 'ccms'
import { IColorField } from 'ccms/dist/components/formFields/color'
import ColorComponent from './sketchpicker'

export default class ColorFieldComponent extends ColorField {
  renderComponent = (props: IColorField) => {
    const { value, onChange, readonly, disabled } = props

    return <ColorComponent value={value} onChange={onChange} readonly={readonly} disabled={disabled} />
  }
}
