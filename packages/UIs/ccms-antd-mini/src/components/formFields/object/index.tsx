import React from 'react'
import { ObjectField } from 'ccms'
import { Form, Button, Divider, Space, Collapse } from 'antd'
import { PlusOutlined, MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { FormItemProps } from 'antd/lib/form'
import 'antd/lib/collapse/style/index.css'
import 'antd/lib/space/style/index.css'
import 'antd/lib/divider/style/index.css'
import 'antd/lib/button/style/index.css'
import { IObjectField, IObjectFieldItem, IObjectFieldItemField } from 'ccms/dist/src/components/formFields/object'
import FormFields from '../'
import styles from './index.less'

export default class ObjectFieldComponent extends ObjectField {
  getFormFields = (type: string) => FormFields[type]

  remove: () => Promise<void> = async () => { }

  renderItemFieldComponent = (props: IObjectFieldItemField) => {
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
        help={fieldType === 'group' || fieldType === 'import_subform' ? null : message}
        {...formItemLayout}
        className={styles[`ccms-antd-mini-object-${fieldType}`]}
      >
        {children}
      </Form.Item>
    )
  }

  renderItemComponent = (props: IObjectFieldItem) => {
    const {
      key,
      onRemove,
      children
    } = props

    return (
      <Collapse.Panel
        header={key}
        key={key}
        forceRender={false}
        extra={(<DeleteOutlined onClick={() => onRemove()} />)}
      >
        {children}
      </Collapse.Panel>
    )
  }

  renderComponent = (props: IObjectField) => {
    const {
      insertText,
      onInsert,
      children
    } = props

    return (
      <React.Fragment>
        <div className={styles['ccms-antd-mini-formField-object-before-button']}>
          <Button type="link" icon={<PlusOutlined />} onClick={() => onInsert()}>{insertText}</Button>
        </div>
        <Collapse accordion={true} bordered={false} className={styles['ccms-antd-mini-formField-object']}>
          {children}
        </Collapse>
        {children.length > 0 && (
          <div className={styles['ccms-antd-mini-formField-object-after-button']}>
            <Button type="link" icon={<PlusOutlined />} onClick={() => onInsert()}>{insertText}</Button>
          </div>
        )}
      </React.Fragment>
    )
  }
}
