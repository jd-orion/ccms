import React from 'react'
import { ImageUrlField } from 'ccms'
import { IImageUrlField } from 'ccms/dist/components/formFields/imageurl'
import TextCompnent from './commontext'

export default class ImageUrlFieldComponent extends ImageUrlField {
  renderComponent = (props: IImageUrlField) => {
    const { readonly, disabled, placeholder, value, onChange, width, height } = props
    return (
      <div>
        <TextCompnent
          readonly={readonly}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {value ? <img alt="" src={value} style={{ width, height, marginTop: '10px' }} /> : null}
      </div>
    )
  }
}
