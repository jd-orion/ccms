import React from 'react'
import { ColorFieldConfig } from '.'
import { Display } from '../common'

export interface IColorField {
  value: string
}

export default class ColorField extends Display<ColorFieldConfig, IColorField, string> {
  renderComponent = (props: IColorField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现ColorField组件。
    </React.Fragment>
  }

  render = () => {
    const {
      value
    } = this.props
    return (
      <React.Fragment>
        {
          this.renderComponent({
            value
          })
        }
      </React.Fragment>
    )
  }
}
