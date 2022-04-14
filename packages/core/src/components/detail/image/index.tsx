import React from 'react'
import { DetailField, DetailFieldConfig, IDetailField } from '../common'

/**
 * 详情项图片组件 格式定义
 * - type:    图片类型
 * - height:  图片高度
 * - width:   图片宽度
 * - preview: 点击预览
 */
export interface ImageDetailConfig extends DetailFieldConfig {
  type: 'image',
  height?: string | number
  width?: string | number
  preview?: boolean
}

export interface IImageDetail {
  value: string
  height: string | number
  width: string | number
  preview?: boolean
}

export default class ImageDetail extends DetailField<ImageDetailConfig, IImageDetail, string> implements IDetailField<string> {
  renderComponent = (props: IImageDetail) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Image组件。
      <div style={{ display: 'none' }}>
      </div>
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
    const {
      config: {
        height,
        width,
        preview
      }
    } = this.props
    const props: any = {
      height,
      width,
      preview,
      value: this.getValue()
    }

    return (
      <React.Fragment>
        {this.renderComponent(props)}
      </React.Fragment>
    )
  }
}
