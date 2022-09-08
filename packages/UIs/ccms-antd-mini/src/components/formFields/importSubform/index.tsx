import React from 'react'
import { ImportSubformField } from 'ccms'
import { IImportSubformField } from 'ccms/dist/components/formFields/importSubform'
import { IFormItem } from 'ccms/dist/steps/form'
import { Form } from 'antd'
import 'antd/lib/form/style'
import { FormItemProps } from 'antd/lib/form'
import getALLComponents from '..'
import './index.less'
import InterfaceHelper from '../../../util/interface'

export default class ImportSubformFieldComponent extends ImportSubformField {
  getALLComponents = (type) => getALLComponents[type]

  interfaceHelper = new InterfaceHelper()

  renderComponent = (props: IImportSubformField) => {
    const { children } = props
    return <div>{children}</div>
  }

  renderItemComponent = (props: IFormItem) => {
    const { key, label, visitable, status, extra, required, message, fieldType, children } = props

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
        help={fieldType === 'group' || fieldType === 'import_subform' ? null : message}
        className={`ccms-antd-mini-form-${fieldType}`}
        style={visitable ? {} : { overflow: 'hidden', width: 0, height: 0 }}
      >
        {children}
      </Form.Item>
    )
  }
}
