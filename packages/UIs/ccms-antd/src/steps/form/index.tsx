import React from 'react'
import { FormStep } from 'ccms'
import { IForm, IFormItem, FormConfig } from 'ccms/dist/src/steps/form'
import { Button, Form, Space } from 'antd'
import 'antd/lib/style/index.css'
import 'antd/lib/form/style/index.css'
import 'antd/lib/grid/style/index.css'
import 'antd/lib/tooltip/style/index.css'
import 'antd/lib/space/style/index.css'
import 'antd/lib/button/style/index.css'
import '../../style'

import { FormItemProps, FormProps } from 'antd/lib/form'
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

    const formItemLayout: FormProps | null =
      layout === 'horizontal'
        ? {
          labelAlign: 'left',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
        : null

    return (
      <Form
        {...formItemLayout}
        layout={layout}
      >
        {children}
        <Form.Item>
          <Space>
            <Button type="primary" onClick={() => onSubmit()}>确定</Button>
            <Button onClick={() => onCancel()}>取消</Button>
          </Space>
        </Form.Item>
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
    const formItemProps: FormItemProps = {}
    if (['form', 'table'].includes(fieldType)) {
      formItemProps.labelCol = { span: 24 }
      formItemProps.wrapperCol = { span: 24 }
    }

    return (
      <Form.Item
        label={label}
        validateStatus={status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating'}
        help={message}
        {...formItemProps}
      >
        {children}
      </Form.Item>
    )
  }
}
// <FormConfig, IForm>
export const PropsType = (props: IForm ) => { };

export const PropsTypeFormConfig = (props: FormConfig) => { };
export const PropsTypeStep = (props: FormStep) => { };