
import { FormItemProps } from "antd";

export function formItemLayout(layout: 'horizontal' | 'vertical' | 'inline', fieldType: string, label: string | undefined) {
  const formItemLayout: FormItemProps = { labelAlign: 'left' }
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


export function computedItemStyle(columns: any, layout: string) {
  const setStyle = {}
  if (!columns) return {}
  Object.assign(setStyle,
    columns.gap ? {
      paddingLeft: `${columns.gap / 2}px`,
      paddingRight: `${columns.gap / 2}px`,
    } : {})
  if (columns.type === 'span') {
    Object.assign(setStyle, {
      flex: `0 0 ${(100 / columns.value)}%`,
      maxWidth: `${(100 / columns.value)}%`,
    })
  }
  if (columns.type === 'width') {
    Object.assign(setStyle, {
      flex: `0 0 ${columns.value}`,
      maxWidth: columns.value,
    })
  }
  if (layout === 'horizontal') {
    Object.assign(setStyle, {
      flexDirection: 'column'
    })
  }

  return setStyle
}

export function computedGapStyle(columns: any, type: string) {
  const setStyle = {}

  const gap = (Number(columns?.gap || columns?.rowGap) || 0) / 2

  if (type === 'row') {
    Object.assign(setStyle, {
      flexFlow: 'row wrap',
      display: 'flex',
      rowGap: `${gap}px`,
      marginLeft: `-${gap / 2}px`,
      marginRight: `-${gap / 2}px`
    })
  }

  return setStyle
}

