import React from 'react'
import { ImageUrlField } from 'ccms'
import { IImageUrlField, ImageUrlFieldConfig } from 'ccms/dist/src/components/formFields/imageurl'
import TextCompnent from './commontext'

export const PropsType = (props: ImageUrlFieldConfig) => { }

export default class ImageUrlFieldComponent extends ImageUrlField {
  renderComponent = (props: IImageUrlField) => {
    const {
      readonly,
      disabled,
      placeholder,
      value,
      onChange,
      width, height
    } = props
    return (
      <div>
        <TextCompnent
          readonly={readonly}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {value ? <img src={value} style={{ width, height, marginTop: '10px' }} /> : null}
      </div>
    )
  }
}
