
import React from 'react'
import { DetailImageField } from 'ccms'
import { IImageDetail, ImageDetailConfig } from 'ccms/dist/src/components/detail/image'
import { Image } from 'antd'
export const PropsType = (props: ImageDetailConfig) => { }

export default class ImageDetailComponent extends DetailImageField {
  renderComponent = (props: IImageDetail) => {
    const { value, width, height } = props
    return (
      value ?
        <Image
          width={width}
          height={height}
          src={value}
        /> : <></>
    )
  }
}
