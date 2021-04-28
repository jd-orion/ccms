import React from 'react'
import { FormStep } from 'ccms'
import { IForm, IFormItem } from 'ccms/dist/src/steps/form'
import { Button, Form, Space } from 'antd'
import 'antd/lib/style/index.css'
import 'antd/lib/form/style/index.css'
import 'antd/lib/grid/style/index.css'
import 'antd/lib/tooltip/style/index.css'
import 'antd/lib/space/style/index.css'
import 'antd/lib/button/style/index.css'
import getALLComponents from '../../components/formFields'
export default class FormStepComponent extends FormStep {
  getALLComponents = (type: any) => getALLComponents[type]

  renderComponent = (props: IForm) => {
    const {
      layout,
      onSubmit,
      onCancel,
      children
    } = props

    const formItemLayout: any | null =
      layout === 'horizontal'
        ? {
          labelAlign: 'left',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
        : null

    return (
      <Form
        layout={layout}
        {...formItemLayout}
        size="small">
        {children}
        {true ? null : <Form.Item>
          <Space>
            <Button type="primary" onClick={() => onSubmit()}>Submit</Button>
            <Button onClick={() => onCancel()}>Cancel</Button>
          </Space>
        </Form.Item>}
      </Form>
    )
  }

  renderItemComponent = (props: IFormItem) => {
    const {
      label,
      status,
      message,
      fieldType,
      children
    } = props

    return (
      <Form.Item
        label={label}
        validateStatus={status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating'}
        help={message}
      >
        {children}
      </Form.Item>
    )
  }
}
