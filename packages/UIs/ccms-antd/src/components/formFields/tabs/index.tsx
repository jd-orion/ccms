import React from 'react'
import { TabsField } from 'ccms'
import { Form, Tabs } from 'antd'
import { ITabsField, ITabsFieldItem, ITabsFieldItemField } from 'ccms/dist/src/components/formFields/tabs'
import getALLComponents from '../'
import { Field } from 'ccms/dist/src/components/formFields/common'
import { formItemLayout } from '../common'

export default class TabsFieldComponent extends TabsField<{}> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any): typeof Field => getALLComponents[type]

  renderItemFieldComponent = (props: ITabsFieldItemField) => {
    const {
      label,
      status,
      message,
      required,
      fieldType,
      layout,
      children
    } = props

    return (
      <Form.Item
        required={required}
        label={label}
        validateStatus={ status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating' }
        help={ message === '' ? null : message}
        {...formItemLayout(layout, fieldType, label)}
      >
        {children}
      </Form.Item>
    )
  }

  renderItemComponent = (props: ITabsFieldItem) => {
    const {
      key,
      label,
      children
    } = props

    return (
      <Tabs.TabPane tab={label} key={key} forceRender={true}>
        {children}
      </Tabs.TabPane>
    )
  }

  renderComponent = (props: ITabsField) => {
    const {
      children
    } = props

    return (
      <React.Fragment>
        <Tabs animated={true} style={{ width: '100%' }}>
          {children}
        </Tabs>
      </React.Fragment>
    )
  }
}
