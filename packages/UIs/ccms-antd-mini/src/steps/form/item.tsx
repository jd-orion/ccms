import React from 'react'
import { FormItem } from 'ccms-core'
import { IFormItem } from "ccms-core/dist/src/steps/form/item";
import TextField from '../../components/formFields/text';
import FormField from '../../components/formFields/form'
import { Form } from 'antd';

export default class FormItemComponent extends FormItem {
  FieldType = {
    text: TextField,
    form: FormField
  }
  renderComponent = (props: IFormItem) => {
    const {
      label,
      message,
      children
    } = props

    return (
      <Form.Item
        label={label}
        help={message}
        validateStatus={message ? 'error' : undefined}
      >
        {children}
      </Form.Item>
    )
  }
}