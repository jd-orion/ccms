import React from 'react'
import { FilterStep } from 'ccms'
import { Button, Form, Space } from 'antd'
import 'antd/lib/button/style'
import 'antd/lib/form/style'
import 'antd/lib/space/style'
import { IFilter, IFilterItem } from 'ccms/dist/steps/filter'
import getALLComponents from '../../components/formFields'

export default class FilterStepComponent extends FilterStep {
  getALLComponents = (type) => getALLComponents[type]

  renderComponent = (props: IFilter) => {
    const { onSubmit, onReset, submitText, resetText, children } = props

    return (
      <Form layout="inline" style={{ marginBottom: 16 }}>
        {children}
        {(onSubmit || onReset) && (
          <Form.Item>
            <Space>
              {onSubmit && (
                <Button type="primary" onClick={() => onSubmit()}>
                  {submitText || '确定'}
                </Button>
              )}
              {onReset && <Button onClick={() => onReset()}>{resetText || '重置'}</Button>}
            </Space>
          </Form.Item>
        )}
      </Form>
    )
  }

  renderItemComponent = (props: IFilterItem) => {
    const { visitable, label, status, message, children } = props

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
        label={label}
        validateStatus={validateStatus}
        style={visitable ? {} : { overflow: 'hidden', width: 0, height: 0, margin: 0, padding: 0 }}
        help={message}
      >
        {children}
      </Form.Item>
    )
  }
}
