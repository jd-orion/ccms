import React from 'react'
import { ObjectField } from 'ccms'
import { Form, Button, Collapse, Input } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { FormItemProps } from 'antd/lib/form'
import { IObjectField, IObjectFieldItem, IObjectFieldItemField, ObjectFieldConfig, ObjectFieldState } from 'ccms/dist/src/components/formFields/object'
import getALLComponents from '../'
import styles from './index.less'
import { FieldProps } from 'ccms/dist/src/components/formFields/common'

interface _ObjectFieldState {
  activeKey: string
}

export default class ObjectFieldComponent extends ObjectField<_ObjectFieldState> {
  getALLComponents = (type: any) => getALLComponents[type]

  constructor (props: FieldProps<ObjectFieldConfig, any>) {
    super(props)

    this.state = {
      ...this.state,
      extra: {
        activeKey: ''
      }
    }
  }

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
    if (fieldType === 'form' || fieldType === 'group' || fieldType === 'object' || fieldType === 'import_subform') {
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
      onChange,
      onRemove,
      children
    } = props

    return (
      <Collapse.Panel
        header={key}
        key={key}
        forceRender={true}
        extra={(<DeleteOutlined onClick={() => onRemove()} />)}
      >
        <Form.Item
          label="键名"
          help=""
          labelAlign="left"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Input
            defaultValue={key}
            onBlur={async (e) => {
              this.setState({
                extra: {
                  activeKey: e.target.value
                }
              })
              await onChange(e.target.value)
            }}
          />
        </Form.Item>
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
          <Button type="link" icon={<PlusOutlined />} onClick={() => {
            onInsert().then((key) => this.setState({
              extra: {
                activeKey: key
              }
            }))
          }}>{insertText}</Button>
        </div>
        <Collapse
          accordion={true}
          bordered={false}
          className={styles['ccms-antd-mini-formField-object']}
          activeKey={this.state.extra?.activeKey}
          onChange={(key) => {
            if (Array.isArray(key)) {
              this.setState({ extra: {activeKey: key[0]} })
            } else {
              this.setState({ extra: {activeKey: key} })
            }
          }}
        >
          {children}
        </Collapse>
        {(Array.isArray(children) ? children : []).length > 0 && (
          <div className={styles['ccms-antd-mini-formField-object-after-button']}>
            <Button type="link" icon={<PlusOutlined />} onClick={() => {
              onInsert().then((key) => this.setState({
                extra: {
                  activeKey: key
                }
              }))
            }}>{insertText}</Button>
          </div>
        )}
      </React.Fragment>
    )
  }
}
