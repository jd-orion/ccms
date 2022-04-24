import React from 'react'
import { FormDisplay } from 'ccms'
import { Form, Collapse, Space } from 'antd'
import { IFormField, IFormFieldItem, IFormFieldItemField } from 'ccms/dist/src/components/formFields/form/display'
import { display as getALLComponents } from '..'
import { formItemLayout } from '../common'

export default class FormDisplayComponent extends FormDisplay {
  getALLComponents = (type: any) => getALLComponents[type]

  remove: () => Promise<void> = async () => {}

  renderItemFieldComponent = (props: IFormFieldItemField) => {
    const { label, fieldType, children } = props
    return (
      <Form.Item
        label={label}
        // {...formItemLayout(layout, fieldType, label)}
      >
        {children}
      </Form.Item>
    )
  }

  renderItemComponent = (props: IFormFieldItem) => {
    const { title, index, canCollapse, children } = props

    return (
      <Collapse.Panel
        header={<div style={{ display: 'inline-block', width: 'calc(100% - 60px)' }}>{title}</div>}
        key={index}
        forceRender
        showArrow={!!canCollapse}
      >
        {children}
      </Collapse.Panel>
    )
  }

  renderComponent = (props: IFormField) => {
    const { canCollapse, children } = props

    const collapsePaneldDefaultActiveKeys = Array.from(Array(children.length), (v, k) => k)
    const CollapseProps = canCollapse
      ? {
          accordion: true
        }
      : {
          activeKey: collapsePaneldDefaultActiveKeys
        }
    return (
      <Space style={{ width: '100%' }} direction="vertical">
        <Collapse bordered={false} style={{ marginBottom: '24px' }} {...CollapseProps}>
          {children}
        </Collapse>
      </Space>
    )
  }
}
