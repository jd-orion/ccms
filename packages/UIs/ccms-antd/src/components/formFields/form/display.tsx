import React from 'react'
import { FormDisplay } from 'ccms'
import { Form, Collapse, Space } from 'antd'
import 'antd/lib/form/style'
import 'antd/lib/collapse/style'
import 'antd/lib/space/style'
import { IFormField, IFormFieldItem, IFormFieldItemField } from 'ccms/dist/components/formFields/form/display'
import { display as getALLComponents } from '..'

export default class FormDisplayComponent extends FormDisplay {
  getALLComponents = (type) => getALLComponents[type]

  remove: () => Promise<void> = async () => {
    /** 无逻辑 */
  }

  renderItemFieldComponent = (props: IFormFieldItemField) => {
    const { label, children } = props
    return <Form.Item label={label}>{children}</Form.Item>
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
