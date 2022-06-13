import React from 'react'
import { DetailField, DetailFieldConfig, IDetailField } from '../common'

/**
 * 详情项图片组件 格式定义
 * - type:    图片类型
 * - height:  图片高度
 * - width:   图片宽度
 * - preview: 点击预览
 * - imageType: 图片类型 single 单图 multiple 多图
 * - urlKey: 数据为对象数组时设置指定key imageType为multiple时配置
 */
export interface ImageDetailConfig extends DetailFieldConfig {
  type: 'image'
  imageType: 'single' | 'multiple'
  height?: string | number
  width?: string | number
  preview?: boolean
  urlKey?: string
}

export interface IImageDetail {
  value?: string
  height?: string | number
  width?: string | number
  preview?: boolean
}

export interface IImageItemDetail {
  value?: Array<string>
  height?: string | number
  width?: string | number
  preview?: boolean
}

export default class ImageDetail
  extends DetailField<ImageDetailConfig, IImageDetail, string | Array<string | object>>
  implements IDetailField<string | Array<string | object>>
{
  renderComponent = (props: IImageDetail) => {
    return <>您当前使用的UI版本没有实现Image组件。</>
  }

  renderItemComponent = (props: IImageItemDetail) => {
    return <>您当前使用的UI版本没有实现Image组合组件。</>
  }

  getValue = () => {
    const {
      value,
      config: { defaultValue }
    } = this.props
    if (value === undefined || value === null || value === '') {
      return defaultValue !== undefined ? defaultValue.toString() : ''
    }
    return value
  }

  render = () => {
    const {
      config: { height, width, preview, urlKey }
    } = this.props
    const value = this.getValue()

    if (Array.isArray(value)) {
      const imglist: string[] = []
      if (urlKey) {
        value.forEach((val) => {
          if (val[urlKey]) {
            imglist.push(val[urlKey])
          }
        })
      }
      return (
        <>
          {this.renderItemComponent({
            height,
            width,
            preview,
            value: imglist
          })}
        </>
      )
    }
    return (
      <>
        {this.renderComponent({
          height,
          width,
          preview,
          value
        })}
      </>
    )
  }
}
