import React from 'react'
import { FormStep } from 'ccms'
import { IForm, IFormItem, IFormStepModal, IButtonProps } from 'ccms/dist/steps/form'
import { Button, Form, Space, Modal, ConfigProvider } from 'antd'
import 'antd/lib/button/style'
import 'antd/lib/form/style'
import 'antd/lib/space/style'
import 'antd/lib/modal/style'
import 'antd/lib/config-provider/style'
import { FormProps, FormItemProps } from 'antd/lib/form'
import getALLComponents from '../../components/formFields'
import './index.less'

export default class FormStepComponent extends FormStep {
  getALLComponents = (type: string) => getALLComponents[type]

  renderModalComponent = (props: IFormStepModal) => {
    return new Promise<void>((resolve) => {
      ConfigProvider.config({
        prefixCls: 'ccms-antd-mini-ant'
      })
      Modal.error({
        getContainer: () => {
          return document.getElementById('ccms-antd-mini') || document.body
        },
        title: props.message,
        onOk: () => {
          resolve()
        }
      })
    })
  }

  renderComponent = (props: IForm) => {
    const { layout, actions, onSubmit, onCancel, submitText, cancelText, children } = props

    const formItemLayout: FormProps =
      layout === 'horizontal'
        ? {
            labelAlign: 'left',
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          }
        : {}

    return (
      <ConfigProvider prefixCls="ccms-antd-mini-ant">
        <Form id="ccms-antd-mini-form" className="ccms-antd-mini-form" layout={layout} {...formItemLayout} size="small">
          {children}
          {(Array.isArray(actions) ? actions.length > 0 : onSubmit || onCancel) && (
            <Form.Item>
              <Space>
                {Array.isArray(actions) ? (
                  actions
                ) : (
                  <>
                    {onSubmit && (
                      <Button type="primary" onClick={() => onSubmit()}>
                        {submitText || '确定'}
                      </Button>
                    )}
                    {onCancel && <Button onClick={() => onCancel()}>{cancelText || '取消'}</Button>}
                  </>
                )}
              </Space>
            </Form.Item>
          )}
        </Form>
      </ConfigProvider>
    )
  }

  renderButtonComponent = (props: IButtonProps) => {
    const { mode, label, onClick } = props
    return (
      <Button type={mode === 'normal' ? 'default' : mode} onClick={() => onClick()}>
        {label}
      </Button>
    )
  }

  renderItemComponent = (props: IFormItem) => {
    const { key, label, visitable, status, message, extra, required, fieldType, children } = props

    const formItemLayout: FormItemProps = {}
    if (fieldType === 'form' || fieldType === 'group' || fieldType === 'import_subform') {
      formItemLayout.labelCol = { span: 24 }
      formItemLayout.wrapperCol = { span: 24 }
    } else if (fieldType === 'switch' || fieldType === 'text') {
      formItemLayout.labelCol = { span: 10 }
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
        extra={extra ? extra.trim() : ''}
        required={required}
        key={key}
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
