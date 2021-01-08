import React from 'react'
import { FormField } from 'ccms-core'
import { Button, Divider, Space } from 'antd'
import 'antd/lib/space/style/index.css'
import 'antd/lib/divider/style/index.css'
import 'antd/lib/button/style/index.css'
import { IFormField, IFormFieldItem } from 'ccms-core/dist/src/components/formFields/form'

export default class FormFieldComponent extends FormField {
  renderItem = (props: IFormFieldItem) => {
    const {
      remove,
      children
    } = props
    return (
      <Space style={{ width: '100%' }} direction="vertical">
        {children}
        <Button onClick={() => remove()}>-</Button>
      </Space>
    )
  }

  renderComponent = (props: IFormField) => {
    const {
      add,
      children
    } = props

    return (
      <Space
        style={{ width: '100%' }}
        direction="vertical"
        split={<Divider style={{ margin: 0 }} />}
      >
        {children}
        <Button onClick={() => add()}>+</Button>
      </Space>
    )
  }
}
