import React, { ReactNode } from 'react'
import { FormStep } from 'ccms-core'
import { IForm } from 'ccms-core/dist/src/steps/form'
import { Button, Form, Space } from 'antd'
import 'antd/lib/form/style/index.css'
import 'antd/lib/grid/style/index.css'
import 'antd/lib/space/style/index.css'
import 'antd/lib/button/style/index.css'
import FormItem from './item'
import { FormProps } from 'antd/lib/form'
import TextField from '../../components/formFields/text';
import FormField from '../../components/formFields/form'

export default class FormStepComponent extends FormStep {
  FormItem = FormItem
  FieldType = {
    'text': TextField,
    'form': FormField
  }

  renderComponent = (props: IForm) => {
    const {
      layout,
      submit,
      cancel,
      children
    } = props

    console.log('FormComponent renderComponent', layout)

    const formItemLayout: FormProps | null =
      layout === 'horizontal'
        ? {
            labelAlign: "left",
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          }
        : null;

    const buttonItemLayout =
      layout === 'horizontal'
        ? {
            wrapperCol: { span: 14, offset: 4 },
          }
        : null;

    return (
      <Form
        {...formItemLayout}
        layout={layout}
      >
          {children}
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => submit()}>Submit</Button>
              <Button onClick={() => cancel()}>Cancel</Button>
            </Space>
          </Form.Item>
      </Form>
    )
  }
}