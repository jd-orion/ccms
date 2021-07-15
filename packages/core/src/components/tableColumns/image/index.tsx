import React from 'react'
import Column, { ColumnConfig } from '../common'

export interface ImageColumnConfig extends ColumnConfig {
  type: 'image',
  size?: {
    height: string | number
    width: string | number
  }
}

export interface IImageColumn {
  value: string
  height: string | number
  width: string | number
}

export default class ImageColumn extends Column<ImageColumnConfig, IImageColumn> {
  renderComponent = (props: IImageColumn) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现ImageColumn组件。
    </React.Fragment>
  }

  getValue = () => {
    const {
      value,
      config: {
        defaultValue
      }
    } = this.props

    if (value === undefined || value === null || value === '') {
      return defaultValue !== undefined ? defaultValue : ''
    }
    return value
  }

  render = () => {
    const value = this.getValue()
    const {
      config: {
        size
      }
    } = this.props
    const width = size?.width || '200px'
    const height = size?.height || 'auto'
    return (
      <React.Fragment>
        {this.renderComponent({ value, height, width })}
      </React.Fragment>
    )
  }
}
