import React from 'react'
import { FormStep } from 'ccms'
import { IForm, IFormItem, FormConfig } from 'ccms/dist/src/steps/form'
import { Button, Form, Space } from 'antd'

import { FormProps } from 'antd/lib/form'
import getALLComponents from '../../components/formFields'
import styles from "./index.less"
import { formItemLayout } from '../../components/formFields/common'
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
        {
          (onSubmit || onCancel) && <Form.Item>
            <Space>
              {onSubmit && <Button type="primary" onClick={() => onSubmit()}>确定</Button>}
              {onCancel && <Button onClick={() => onCancel()}>取消</Button>}
            </Space>
          </Form.Item>
        }
      </Form>
    )
  }

  renderItemComponent = (props: IFormItem) => {
    const {
      layout,
      label,
      status,
      message,
      fieldType,
      children
    } = props

    return (
      <Form.Item
        label={label}
        {...formItemLayout(layout, fieldType, label)}
        validateStatus={status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating'}
        help={fieldType === 'group' || fieldType === 'import_subform' || message === '' ? null : message}
        className={styles[`ccms-antd-mini-form-${fieldType}`]}
      >
        {children}
      </Form.Item>
    )
  }
}
// <FormConfig, IForm>
export const PropsType = (props: IForm) => {};

export const PropsTypeFormConfig = (props: FormConfig) => {};
export const PropsTypeStep = (props: FormStep) => {};