import { FormItemProps } from "antd";

export function formItemLayout (layout: 'horizontal' | 'vertical' | 'inline', fieldType: string, label: string | undefined) {
  const formItemLayout: FormItemProps = { labelAlign: 'left' }
  if (label) {
    formItemLayout.labelCol = { span: 24 }
    formItemLayout.wrapperCol = { span: 24 }
  } else {
    formItemLayout.wrapperCol = { span: 24 }
  }
  return formItemLayout
}