import React from 'react'
import { FormStep } from 'ccms'
import { IForm, IFormItem, IFormStepModal, IButtonProps } from 'ccms/dist/src/steps/form'
import { Button, Form, Space, Modal } from 'antd'
import getALLComponents from '../../components/formFields'
import { FormProps, FormItemProps } from 'antd/lib/form'
import styles from './index.less'
export default class FormStepComponent extends FormStep {
  getALLComponents = (type: any) => getALLComponents[type]

  renderModalComponent = (props: IFormStepModal) => {
    return new Promise((resolve) => {
      Modal.error({
        getContainer: () => {
          return document.getElementById('ccms-antd-mini') || document.body
        },
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

    const formItemLayout: FormProps =
      layout === 'horizontal'
        ? {
            labelAlign: 'left',
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          }
        : {}

    return (
      <Form
        id="ccms-antd-mini-form"
        className={styles['ccms-antd-mini-form']}
        layout={layout}
        {...formItemLayout}
        size="small"
      >
        {children}
        {
          (Array.isArray(actions) ? actions.length > 0 : (onSubmit || onCancel)) && <Form.Item>
            <Space>
              {Array.isArray(actions)
                ? actions
                : <React.Fragment>
                  {onSubmit && <Button type="primary" onClick={() => onSubmit()}>{submitText || '确定'}</Button>}
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
      label,
      visitable,
      message,
      extra,
      required,
      fieldType,
      children
    } = props

    const formItemLayout: FormItemProps = {}
    if (fieldType === 'form' || fieldType === 'group' || fieldType === 'import_subform') {
      formItemLayout.labelCol = { span: 24 }
      formItemLayout.wrapperCol = { span: 24 }
    } else if (fieldType === 'switch' || fieldType === 'text') {
      formItemLayout.labelCol = { span: 10 }
    }

    return (
      <Form.Item
        extra={extra ? extra.trim() : ''}
        required={required}
        key={key}
        label={label}
        {...formItemLayout}
        validateStatus={status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating'}
        help={fieldType === 'group' || fieldType === 'import_subform' ? null : message}
        className={styles[`ccms-antd-mini-form-${fieldType}`]}
        style={visitable ? {} : { overflow: 'hidden', width: 0, height: 0 }}
      >
        {children}
      </Form.Item>
    )
  }
}
