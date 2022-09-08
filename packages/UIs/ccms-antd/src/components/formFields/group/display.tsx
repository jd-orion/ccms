import React from 'react'
import { GroupDisplay } from 'ccms'
import { IGroupField } from 'ccms/dist/components/formFields/group'
import { IFormItem } from 'ccms/dist/steps/form'
import { Form } from 'antd'
import 'antd/lib/form/style'
import { display as getALLComponents } from '..'
import './index.less'
import { computedItemStyle, computedGapStyle } from '../common'

export default class GroupDisplayComponent extends GroupDisplay {
  getALLComponents = (type) => getALLComponents[type]

  renderComponent = (props: IGroupField) => {
    const { columns, children } = props
    const gap = computedGapStyle(columns, 'row')

    return (
      <div
        style={{
          ...gap
        }}
        className="ccms-antd-mini-form-group-row"
      >
        {children}
      </div>
    )
  }

  renderItemComponent = (props: IFormItem) => {
    const { key, columns, layout, label, visitable, fieldType, children } = props

    const colStyle = computedItemStyle(columns, layout, visitable)
    const itemStyle = visitable ? {} : { overflow: 'hidden', width: 0, height: 0, margin: 0, padding: 0 }
    if (columns?.type === 'width' && columns?.value && columns.wrap) {
      Object.assign(itemStyle, { width: columns.value })
    }

    return (
      <div style={colStyle} key={key} className={`form-group-col form-group-col-${fieldType}`}>
        <Form.Item key={key} label={label} className={`ccms-antd-mini-form-${fieldType}`} style={itemStyle}>
          {children}
        </Form.Item>
      </div>
    )
  }
}
