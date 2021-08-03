import React from 'react'
import { FormField } from 'ccms'
import { Form, Button, Divider, Space, Collapse } from 'antd'
import { PlusOutlined, MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { FormItemProps } from 'antd/lib/form'
import 'antd/lib/collapse/style/index.css'
import 'antd/lib/space/style/index.css'
import 'antd/lib/divider/style/index.css'
import 'antd/lib/button/style/index.css'
import { IFormField, IFormFieldItem, IFormFieldItemField } from 'ccms/dist/src/components/formFields/form'
import FormFields from '../'
import styles from './index.less'

export default class FormFieldComponent extends FormField {
  getFormFields = (type: string) => FormFields[type]

  remove: () => Promise<void> = async () => { }

  renderItemFieldComponent = (props: IFormFieldItemField) => {
    const {
      label,
      status,
      message,
      fieldType,
      children,
      layout = "horizontal"
    } = props

    const formItemLayout: FormItemProps = {}
    if (layout === 'horizontal') {
      formItemLayout.labelAlign = 'left'
      formItemLayout.labelCol = { span: 6 }
      formItemLayout.wrapperCol = { span: 18 }
    }
    if (fieldType === 'form' || fieldType === 'group' || fieldType === 'import_subform') {
      formItemLayout.labelCol = { span: 24 }
      formItemLayout.wrapperCol = { span: 24 }
    }
    return (
      <Form.Item
        label={label}
        validateStatus={status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating'}
        help={message}
        {...formItemLayout}
      >
        {children}
      </Form.Item>
    )
  }

  renderItemComponent = (props: IFormFieldItem) => {
    const {
      index,
      title,
      onRemove,
      children
    } = props

    return (
      <Collapse.Panel
        header={title}
        key={index}
        forceRender={true}
        extra={(<DeleteOutlined onClick={() => onRemove()} />)}
      >
        {children}
      </Collapse.Panel>
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
        <Collapse accordion={true} bordered={false} className={styles['ccms-antd-mini-formField-form']}>
          {children}
        </Collapse>
        <Form.Item>
          <Button block type='dashed' icon={<PlusOutlined />} onClick={() => onInsert()}>{insertText}</Button>
        </Form.Item>
      </React.Fragment>
    )
  }
}
