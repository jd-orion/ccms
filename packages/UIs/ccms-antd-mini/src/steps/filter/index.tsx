import React from 'react'
import { FilterStep } from 'ccms'
import { IFilter, IFilterItem } from 'ccms/dist/src/steps/filter'
import { Button, Form, Space } from 'antd'
import FieldComponents from '../../components/formFields'

export default class FilterStepComponent extends FilterStep {
  getFieldComponents = (type: string) => FieldComponents[type]

  renderComponent = (props: IFilter) => {
    const {
      onSubmit,
      onReset,
      submitText,
      resetText,
      children
    } = props

    return (
      <Form
        layout={'inline'}
        style={{ marginBottom: 16 }}
      >
          {children}
          {
          (onSubmit || onReset) && <Form.Item>
            <Space>
              {onSubmit && <Button type="primary" onClick={() => onSubmit()}>{submitText || '确定'}</Button>}
              {onReset && <Button onClick={() => onReset()}>{resetText || '取消'}</Button>}
            </Space>
          </Form.Item>
        }
      </Form>
    )
  }

  renderItemComponent = (props: IFilterItem) => {
    const {
      label,
      visitable,
      status,
      message,
      // fieldType,
      children
    } = props

    return (
      <Form.Item
        label={label}
        validateStatus={ status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating' }
        help={message}
        style={visitable ? {} : { overflow: 'hidden', width: 0, height: 0 }}
      >
        {children}
      </Form.Item>
    )
  }
}
