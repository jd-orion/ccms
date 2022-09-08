import React from 'react'
import { ObjectField } from 'ccms'
import { Form, Button, Collapse, Input } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { FormItemProps } from 'antd/lib/form'
import {
  IObjectField,
  IObjectFieldItem,
  IObjectFieldItemField,
  ObjectFieldConfig
} from 'ccms/dist/components/formFields/object'
import { FieldProps } from 'ccms/dist/components/formFields/common'
import getALLComponents from '..'
import './index.less'

interface _ObjectFieldState {
  activeKey: string
}

export default class ObjectFieldComponent extends ObjectField<_ObjectFieldState> {
  getALLComponents = (type) => getALLComponents[type]

  constructor(props: FieldProps<ObjectFieldConfig, { [key: string]: unknown }>) {
    super(props)

    this.state = {
      ...this.state,
      extra: {
        activeKey: ''
      }
    }
  }

  remove: () => Promise<void> = async () => {
    /* none */
  }

  renderItemFieldComponent = (props: IObjectFieldItemField) => {
    const { label, status, message, extra, required, fieldType, children, layout = 'horizontal' } = props

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
        label={label}
        validateStatus={validateStatus}
        help={fieldType === 'group' || fieldType === 'import_subform' ? null : message}
        {...formItemLayout}
        className={`ccms-antd-mini-object-${fieldType}`}
      >
        {children}
      </Form.Item>
    )
  }

  renderItemComponent = (props: IObjectFieldItem) => {
    const { key, onChange, onRemove, children } = props

    return (
      <Collapse.Panel header={key} key={key} forceRender extra={<DeleteOutlined onClick={() => onRemove()} />}>
        <Form.Item label="键名" help="" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
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
    const { insertText, onInsert, children } = props

    return (
      <>
        <div className="ccms-antd-mini-formField-object-before-button">
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => {
              onInsert().then((key) =>
                this.setState({
                  extra: {
                    activeKey: key
                  }
                })
              )
            }}
          >
            {insertText}
          </Button>
        </div>
        <Collapse
          accordion
          bordered={false}
          className="ccms-antd-mini-formField-object"
          activeKey={this.state.extra?.activeKey}
          onChange={(key) => {
            if (Array.isArray(key)) {
              this.setState({ extra: { activeKey: key[0] } })
            } else {
              this.setState({ extra: { activeKey: key } })
            }
          }}
        >
          {children}
        </Collapse>
        {(Array.isArray(children) ? children : []).length > 0 && (
          <div className="ccms-antd-mini-formField-object-after-button">
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={() => {
                onInsert().then((key) =>
                  this.setState({
                    extra: {
                      activeKey: key
                    }
                  })
                )
              }}
            >
              {insertText}
            </Button>
          </div>
        )}
      </>
    )
  }
}
