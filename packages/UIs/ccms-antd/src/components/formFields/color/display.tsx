import React from 'react'
import { ColorDisplay } from 'ccms'
import { IColorField } from 'ccms/dist/components/formFields/color/display'
import { Space } from 'antd'
import 'antd/lib/space/style'
import './index.less'

export default class ColorDisplayComponent extends ColorDisplay {
  renderComponent = (props: IColorField) => {
    const { value } = props
    return (
      <Space>
        <div className="ccms-antd-color-preview" style={{ background: value, marginLeft: 0 }} />
        {value}
      </Space>
    )
  }
}
