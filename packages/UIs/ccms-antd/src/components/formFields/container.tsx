import React from 'react'
import { FormContainer } from 'ccms'
import { Form } from 'antd'
import 'antd/lib/form/style'
import { IFormItem } from 'ccms/dist/steps/form'
import { IFormContainer } from 'ccms/dist/components/formFields/container'
import getALLComponents from '.'
import { formItemLayout } from './common'

export default class FormContainerComponent extends FormContainer {
  getALLComponents = (type: string) => getALLComponents[type]

  renderItemComponent = (props: IFormItem) => {
    const { label, subLabel, status, message, extra, required, fieldType, layout, visitable, children } = props
    const itemStyle = visitable ? {} : { overflow: 'hidden', width: 0, height: 0, margin: 0, padding: 0 }
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
        extra={extra ? extra.trim() : ''}
        required={required}
        label={label}
        validateStatus={validateStatus}
        help={message === '' ? null : message}
        {...formItemLayout(layout, fieldType, label)}
        style={itemStyle}
      >
        {subLabel || null}
        {children}
      </Form.Item>
    )
  }

  renderComponent = (props: IFormContainer) => {
    const { children } = props

    return <>{children}</>
  }
}
