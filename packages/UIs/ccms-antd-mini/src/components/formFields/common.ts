import { FormItemProps } from 'antd'

export function formItemLayout(
  layout: 'horizontal' | 'vertical' | 'inline',
  fieldType: string,
  label: string | undefined
) {
  const currentFormItemLayout: FormItemProps = { labelAlign: 'left' }
  if (layout === 'vertical') {
    if (label) {
      currentFormItemLayout.labelCol = { span: 24 }
      currentFormItemLayout.wrapperCol = { span: 24 }
    } else {
      currentFormItemLayout.wrapperCol = { span: 24 }
    }
  } else {
    if (['form', 'group', 'object', 'import_subform', 'tabs'].includes(fieldType)) {
      if (label) {
        currentFormItemLayout.labelCol = { span: 24 }
      }
      currentFormItemLayout.wrapperCol = { span: 24 }
    } else {
      if (label) {
        currentFormItemLayout.labelCol = { span: 6 }
        currentFormItemLayout.wrapperCol = { span: 18 }
      } else {
        currentFormItemLayout.wrapperCol = { span: 24 }
      }
    }
  }

  return currentFormItemLayout
}

export default {}
