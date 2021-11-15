import React from 'react'
import { FormStep } from 'ccms'
import { IForm, IFormItem, IFormStepModal } from 'ccms/dist/src/steps/form'
import { Button, Form, Space, Modal } from 'antd'
import 'antd/lib/style/index.css'
import 'antd/lib/form/style/index.css'
import 'antd/lib/grid/style/index.css'
import 'antd/lib/tooltip/style/index.css'
import 'antd/lib/space/style/index.css'
import 'antd/lib/button/style/index.css'
import getALLComponents from '../../components/formFields'
import { FormItemProps } from 'antd/lib/form'
import styles from "./index.less"
export default class FormStepComponent extends FormStep {
  getALLComponents = (type: any) => getALLComponents[type]

  renderModalComponent= (props: IFormStepModal) => {
    return new Promise((resolve) => {
      Modal.error({
        getContainer: () => {
          return document.body
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
      onSubmit,
      onCancel,
      submitText,
      cancelText,
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
      label,
      visitable,
      message,
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
