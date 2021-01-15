import React from 'react'
import { FilterStep } from 'ccms-core'
import { IFilter, IFilterItem } from 'ccms-core/dist/src/steps/filter'
import { Button, Form, Space } from 'antd'
import 'antd/lib/style/index.css'
import 'antd/lib/form/style/index.css'
import 'antd/lib/grid/style/index.css'
import 'antd/lib/tooltip/style/index.css'
import 'antd/lib/space/style/index.css'
import 'antd/lib/button/style/index.css'
import FieldComponents from '../../components/formFields'

export default class FilterStepComponent extends FilterStep {
  getFieldComponents = (type: string) => FieldComponents[type]

  renderComponent = (props: IFilter) => {
    const {
      onSubmit,
      onReset,
      children
    } = props

    return (
      <Form
        layout={'inline'}
        style={{ marginBottom: 16 }}
      >
          {children}
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => onSubmit()}>Submit</Button>
              <Button onClick={() => onReset()}>Reset</Button>
            </Space>
          </Form.Item>
      </Form>
    )
  }

  renderItemComponent = (props: IFilterItem) => {
    const {
      label,
      status,
      message,
      children
    } = props

    return (
      <Form.Item
        label={label}
        validateStatus={ status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating' }
        help={message}
      >
        {children}
      </Form.Item>
    )
  }
}
