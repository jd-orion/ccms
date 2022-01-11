import React from 'react'
import { LongtextFieldConfig } from '.'
import { Display } from '../common'

export interface ILongtextField {
  value: string,
}

export default class LongTextField extends Display<LongtextFieldConfig, ILongtextField, string> {
  renderComponent = (props: ILongtextField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现LongTextField组件。
    </React.Fragment>
  }

  render = () => {
    const {
      value
    } = this.props

    return (
      <React.Fragment>
        {this.renderComponent({
          value
        })}
      </React.Fragment>
    )
  }
}
