import React from 'react'
import { UploadFieldConfig } from '.'
import { Display } from '../common'

export interface IUploadField {
  mode: 'image' | 'file'
  value?: string
}

export default class UploadField extends Display<UploadFieldConfig, IUploadField, string> {
  renderComponent = (props: IUploadField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现TextField组件。
    </React.Fragment>
  }

  render = () => {
    const {
      value,
      config
    } = this.props

    if (config.mode === 'image') {
      return (
        <React.Fragment>
          {this.renderComponent({
            mode: 'image',
            value: value ? `${config.imagePrefix || ''}${value}` : undefined
          })}
        </React.Fragment>
      )
    } else if (config.mode === 'file') {
      return (
        <React.Fragment>
          {this.renderComponent({
            mode: 'file',
            value
          })}
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment></React.Fragment>
      )
    }
  }
}
