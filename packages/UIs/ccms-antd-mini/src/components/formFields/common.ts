
export function formItemLayout (layout: 'horizontal' | 'vertical' | 'inline', fieldType: string, label: string | undefined) {
  const formItemLayout: any = { labelAlign: 'left' }
  if (layout === 'vertical') {
    if (label) {
      formItemLayout.labelCol = { span: 24 }
      formItemLayout.wrapperCol = { span: 24 }
    } else {
      formItemLayout.wrapperCol = { span: 24 }
    }
  } else {
    if (['form', 'group', 'object', 'import_subform', 'tabs'].includes(fieldType)) {
      if (label) {
        formItemLayout.labelCol = { span: 24 }
      }
      formItemLayout.wrapperCol = { span: 24 }
    } else {
      if (label) {
        formItemLayout.labelCol = { span: 6 }
        formItemLayout.wrapperCol = { span: 18 }
      } else {
        formItemLayout.wrapperCol = { span: 24 }
      }
    }
  }

  return formItemLayout
}