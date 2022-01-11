import React from 'react'
import { ColorDisplay } from 'ccms'
import { IColorField } from 'ccms/dist/src/components/formFields/color/display'
import styles from './index.less'
import { Space } from 'antd'

export default class ColorDisplayComponent extends ColorDisplay {
  renderComponent = (props: IColorField) => {
    const {
      value
    } = props
    return (
      <Space>
        <div
          className={styles['ccms-antd-color-preview']}
          style={{ background: value, marginLeft: 0 }}
          ></div>
        {value}
      </Space>
    )
  }
}
