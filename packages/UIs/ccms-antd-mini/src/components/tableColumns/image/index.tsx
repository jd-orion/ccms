import React from 'react'
import { ImageColumn } from 'ccms'
import { IImageColumn } from 'ccms/dist/components/tableColumns/image'

export default class ImageColumnComponent extends ImageColumn {
  renderComponent = (props: IImageColumn) => {
    const { value, width, height } = props
    return <img alt="" src={value} style={{ objectFit: 'contain', width, height }} />
  }
}
