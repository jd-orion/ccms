import React from 'react'
import { FormField } from 'ccms'
import { Form, Button, Divider, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IFormField, IFormFieldItem, IFormFieldItemField } from 'ccms/dist/src/components/formFields/form'
import FormFields from '../'
import { formItemLayout } from '../common'

export default class FormFieldComponent extends FormField {
  getFormFields = (type: string) => FormFields[type]

  remove: () => Promise<void> = async () => { }

  renderItemFieldComponent = (props: IFormFieldItemField) => {
    const {
      label,
      status,
      message,
      fieldType,
      layout,
      children
    } = props

    return (
      <Form.Item
        label={label}
        validateStatus={ status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating' }
        help={ message === '' ? null : message}
        {...formItemLayout(layout, fieldType, label)}
      >
        {children}
      </Form.Item>
    )
  }

  renderItemComponent = (props: IFormFieldItem) => {
    const {
      removeText,
      onRemove,
      children
    } = props

    return (
      <div>
        {children}
        {
          removeText && <Form.Item wrapperCol={{ span: 4, offset: 14 }}>
            <Button block danger type='dashed' icon={<MinusCircleOutlined />} onClick={() => onRemove()}>{removeText}</Button>
          </Form.Item>
        }
      </div>
    )
  }

  renderComponent = (props: IFormField) => {
    const {
      insertText,
      onInsert,
      children
    } = props

    return (
      <React.Fragment>
        <Space
          style={{ width: '100%' }}
          direction="vertical"
          split={<Divider style={{ margin: 0 }} />}
        >
          {children}
          <Form.Item wrapperCol={{ span: 18 }}>
            <Button block type='dashed' icon={<PlusOutlined />} onClick={() => onInsert()}>{insertText}</Button>
          </Form.Item>
        </Space>
      </React.Fragment>
    )
  }
}
