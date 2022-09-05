import React from 'react'
import { GroupField } from 'ccms'
import { IGroupField } from 'ccms/dist/components/formFields/group'
import { IFormItem } from 'ccms/dist/steps/form'
import { Form } from 'antd'
import 'antd/lib/form/style'
import { FormItemProps } from 'antd/lib/form'
import getALLComponents from '..'
import './index.less'

export default class GroupFieldComponent extends GroupField {
  getALLComponents = (type) => getALLComponents[type]

  renderComponent = (props: IGroupField) => {
    const { children } = props
    return <div>{children}</div>
  }

  renderItemComponent = (props: IFormItem) => {
    const { key, label, visitable, message, extra, required, fieldType, children, status } = props

    const formItemLayout: FormItemProps = { labelAlign: 'left' }
    if (fieldType === 'form' || fieldType === 'group' || fieldType === 'object' || fieldType === 'import_subform') {
      formItemLayout.labelCol = { span: 24 }
      formItemLayout.wrapperCol = { span: 24 }
    } else {
      formItemLayout.labelCol = { span: 6 }
      formItemLayout.wrapperCol = { span: 18 }
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
      <Form.Item
        key={key}
        extra={extra ? extra.trim() : ''}
        required={required}
        label={label}
        {...formItemLayout}
        validateStatus={validateStatus}
        help={fieldType === 'import_subform' || fieldType === 'group' ? null : message}
        className={`ccms-antd-mini-form-${fieldType}`}
        style={visitable ? {} : { overflow: 'hidden', width: 0, height: 0 }}
      >
        {children}
      </Form.Item>
    )
  }
}
