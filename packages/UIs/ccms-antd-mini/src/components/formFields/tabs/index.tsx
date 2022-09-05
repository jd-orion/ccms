import React from 'react'
import { TabsField } from 'ccms'
import { Form, Tabs } from 'antd'
import 'antd/lib/form/style'
import 'antd/lib/tabs/style'
import { ITabsField, ITabsFieldItem, ITabsFieldItemField } from 'ccms/dist/components/formFields/tabs'
import { Field } from 'ccms/dist/components/formFields/common'
import getALLComponents from '..'
import { formItemLayout } from '../common'

export default class TabsFieldComponent extends TabsField<Record<string, unknown>> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type): typeof Field => getALLComponents[type]

  renderItemFieldComponent = (props: ITabsFieldItemField) => {
    const { label, status, message, extra, required, fieldType, layout, children } = props

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
        help={message === '' ? null : message}
        {...formItemLayout(layout, fieldType, label)}
      >
        {children}
      </Form.Item>
    )
  }

  renderItemComponent = (props: ITabsFieldItem) => {
    const { key, label, children } = props

    return (
      <Tabs.TabPane tab={label} key={key} forceRender>
        {children}
      </Tabs.TabPane>
    )
  }

  renderComponent = (props: ITabsField) => {
    const { children } = props

    return (
      <>
        <Tabs animated style={{ width: '100%' }}>
          {children}
        </Tabs>
      </>
    )
  }
}
