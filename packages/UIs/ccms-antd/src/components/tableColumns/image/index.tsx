import React from 'react'
import { ImageColumn } from 'ccms'
import { IImageColumn, ImageColumnConfig } from 'ccms/dist/components/tableColumns/image'
export const PropsType = (props: ImageColumnConfig) => { }

export default class ImageColumnComponent extends ImageColumn {
  renderComponent = (props: IImageColumn) => {
    const { value, width, height } = props
    return (
      value ? <img src={value} style={{ width, height }} /> : <></>
    )
  }
}
