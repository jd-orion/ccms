import React from 'react'
import { FormStep } from 'ccms'
import { IForm, IFormItem, FormConfig } from 'ccms/dist/src/steps/form'
import { Button, Form, Space } from 'antd'

import { FormProps } from 'antd/lib/form'
import getALLComponents from '../../components/formFields'
import styles from "./index.less"
import { formItemLayout } from '../../components/formFields/common'
import newstyles from "../../main.less"

export default class FormStepComponent extends FormStep {
  getALLComponents = (type: any) => getALLComponents[type]

  renderComponent = (props: IForm) => {
    const {
      layout,
      onSubmit,
      onCancel,
      submitText,
      cancelText,
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
        // layout={layout}
        layout="vertical" // 和drip同步 改为竖排
        className={newstyles['content']}
      >
        {children}
        {
          (onSubmit || onCancel) && <Form.Item>
            <Space>
              {onSubmit && <Button type="primary" onClick={() => onSubmit()}>{submitText || '确定'}</Button>}
              {onCancel && <Button onClick={() => onCancel()}>{cancelText || '取消'}</Button>}
            </Space>
          </Form.Item>
        }
      </Form>
    )
  }

  renderItemComponent = (props: IFormItem) => {
    const {
      key,
      visitable,
      layout,
      label,
      status,
      message,
      fieldType,
      children
    } = props

    return (
      <Form.Item
        key={key}
        label={label}
        {...formItemLayout(layout, fieldType, label)}
        validateStatus={status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating'}
        help={fieldType === 'group' || fieldType === 'import_subform' || message === '' ? null : message}
        style={ visitable ? {} : { overflow: 'hidden', width: 0, height: 0, margin: 0, padding: 0 } }
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