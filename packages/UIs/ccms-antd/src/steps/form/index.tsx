import React from 'react'
import { FormStep } from 'ccms'
import { IForm, IFormItem, IFormStepModal, FormConfig, IButtonProps } from 'ccms/dist/src/steps/form'
import { Button, Form, Space, Modal } from 'antd'

import { FormProps } from 'antd/lib/form'
import getALLComponents from '../../components/formFields'
import OperationHelper from '../../util/operation'
import styles from "./index.less"
import { formItemLayout } from '../../components/formFields/common'
import newstyles from "../../main.less"

export default class FormStepComponent extends FormStep {
  getALLComponents = (type: any) => getALLComponents[type]
  OperationHelper = OperationHelper

  renderModalComponent = (props: IFormStepModal) => {
    return new Promise((resolve) => {
      Modal.error({
        getContainer: () => {
          return document.getElementById('ccms-antd') || document.body
        },
        centered: true,
        title: props.message,
        onOk: () => {
          resolve(null)
        }
      })
    })
  }

  renderComponent = (props: IForm) => {
    const {
      layout,
      actions,
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
          (Array.isArray(actions) ? actions.length > 0 : (onSubmit || onCancel)) && <Form.Item>
            <Space>
              {Array.isArray(actions)
                ? actions
                : <React.Fragment>
                  {onSubmit && <Button type="primary" onClick={() => onSubmit()}>{submitText || '提交'}</Button>}
                  {onCancel && <Button onClick={() => onCancel()}>{cancelText || '取消'}</Button>}
                </React.Fragment>
              }
            </Space>
          </Form.Item>
        }
      </Form>
    )
  }

  renderButtonComponent = (props: IButtonProps) => {
    const {
      mode,
      label,
      onClick
    } = props
    return <Button type={mode === 'normal' ? 'default' : mode} onClick={() => onClick()}>{label}</Button>
  }

  renderItemComponent = (props: IFormItem) => {
    const {
      key,
      visitable,
      layout,
      label,
      status,
      message,
      extra,
      required,
      fieldType,
      children
    } = props

    return (
      <Form.Item
        extra={extra ? extra.trim() : ''}
        required={required}
        key={key}
        label={label}
        {...formItemLayout(layout, fieldType, label)}
        validateStatus={status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating'}
        help={fieldType === 'group' || fieldType === 'import_subform' || message === '' ? null : message}
        style={visitable ? {} : { overflow: 'hidden', width: 0, height: 0, margin: 0, padding: 0 }}
        className={styles[`ccms-antd-mini-form-${fieldType}`]}
      >
        {children}
      </Form.Item>
    )
  }
}
// <FormConfig, IForm>
export const PropsType = (props: IForm) => { };

export const PropsTypeFormConfig = (props: FormConfig) => { };
export const PropsTypeStep = (props: FormStep) => { };