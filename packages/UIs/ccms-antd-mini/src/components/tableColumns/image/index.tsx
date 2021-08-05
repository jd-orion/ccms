import React from 'react'
import { ImageColumn } from 'ccms'
import { IImageColumn } from 'ccms/dist/src/components/tableColumns/image'

export default class ImageColumnComponent extends ImageColumn {
  renderComponent = (props: IImageColumn) => {
    const {
      value,
      width,
      height
    } = props
    return (
      <img src={value} style={{ objectFit: 'contain', width, height }} />
    )
  }
}
