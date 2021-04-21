import React from 'react'
import { FormField } from 'ccms-core'
import { Form, Button, Divider, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { FormItemProps } from 'antd/lib/form'
import 'antd/lib/space/style/index.css'
import 'antd/lib/divider/style/index.css'
import 'antd/lib/button/style/index.css'
import { IFormField, IFormFieldItem, IFormFieldItemField } from 'ccms-core/dist/src/components/formFields/form'
import FormFields from '../'

export default class FormFieldComponent extends FormField {
  getFormFields = (type: string) => FormFields[type]

  remove: () => Promise<void> = async () => { }

  renderItemFieldComponent = (props: IFormFieldItemField) => {
    const {
      label,
      status,
      message,
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

  renderItemComponent = (props: IFormFieldItem) => {
    const {
      removeText,
      onRemove,
      children
    } = props

    return (
      <div>
        {children}
        <Form.Item style={{ textAlign: 'right' }}>
          <Button danger type='dashed' icon={<MinusCircleOutlined />} onClick={() => onRemove()}>{removeText}</Button>
        </Form.Item>
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
          split={<Divider style={{ margin: 0, height: '3px' }} />}
        >
          {children}
          {
          insertText && <Form.Item>
            <Button block type='dashed' icon={<PlusOutlined />} onClick={() => onInsert()}>{insertText}</Button>
          </Form.Item>
          }
        </Space>
      </React.Fragment>
    )
  }
}
