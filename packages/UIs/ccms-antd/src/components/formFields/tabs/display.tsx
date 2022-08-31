import React from 'react'
import { TabsDisplay } from 'ccms'
import { Form, Tabs } from 'antd'
import { ITabsField, ITabsFieldItem, ITabsFieldItemField } from 'ccms/dist/components/formFields/tabs/display'
import { Display } from 'ccms/dist/components/formFields/common'
import { display as getALLComponents } from '..'

export default class TabsDisplayComponent extends TabsDisplay<Record<string, never>> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any): typeof Display => getALLComponents[type]

  renderItemFieldComponent = (props: ITabsFieldItemField) => {
    const { label, children } = props

    return (
      <Form.Item
        label={label}
        // {...formItemLayout(layout, fieldType, label)}
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
      <Tabs animated style={{ width: '100%' }}>
        {children}
      </Tabs>
    )
  }
}
