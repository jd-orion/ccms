import React from 'react'
import { ImportSubformField } from 'ccms'
import { IImportSubformField } from 'ccms/dist/components/formFields/importSubform'
import { IFormItem } from 'ccms/dist/steps/form'
import { Form } from 'antd'
import 'antd/lib/form/style'
import getALLComponents from '..'
import './index.less'
import { computedItemStyle, computedGapStyle, FiledErrMsg } from '../common'
import InterfaceHelper from '../../../util/interface'

export default class ImportSubformFieldComponent extends ImportSubformField {
  getALLComponents = (type) => getALLComponents[type]

  interfaceHelper = new InterfaceHelper()

  renderComponent = (props: IImportSubformField) => {
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
          key={key}
          required={required}
          label={label}
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
