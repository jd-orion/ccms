import React from 'react'
import { GroupField } from 'ccms'
import { IGroupField } from 'ccms/dist/components/formFields/group'
import { IFormItem } from 'ccms/dist/steps/form'
import { Form } from 'antd'
import 'antd/lib/form/style'
import getALLComponents from '..'
import './index.less'
import { formItemLayout, computedItemStyle, computedGapStyle, FiledErrMsg } from '../common'

export default class GroupFieldComponent extends GroupField {
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
    const { key, layout, columns, label, subLabel, visitable, status, message, extra, required, fieldType, children } =
      props

    const colStyle = computedItemStyle(columns, layout, visitable)
    const itemStyle = visitable ? {} : { overflow: 'hidden', width: 0, height: 0, margin: 0, padding: 0 }
    if (columns?.type === 'width' && columns?.value && columns.wrap) {
      Object.assign(itemStyle, { width: columns.value })
    }

    let validateStatus: '' | 'error' | 'validating' | 'success' | 'warning' | undefined
    if (status === 'normal') {
      validateStatus = undefined
    } else if (status === 'error') {
      validateStatus = 'error'
    } else {
      validateStatus = 'validating'
    }

    return (
      <div style={colStyle} key={key} className={`form-group-col form-group-col-${fieldType}`}>
        <Form.Item
          extra={extra ? extra.trim() : ''}
          required={required}
          key={key}
          label={label}
          {...formItemLayout(layout, fieldType, label)}
          validateStatus={validateStatus}
          help={FiledErrMsg({ message, fieldType })}
          className={`ccms-antd-mini-form-${fieldType}`}
          style={itemStyle}
        >
          {subLabel || null}
          {children}
        </Form.Item>
      </div>
    )
  }
}
