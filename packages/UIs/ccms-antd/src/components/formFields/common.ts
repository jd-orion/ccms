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



export function computedItemStyle(columns: any, layout: string) {
  const setStyle = {}
  if (!columns) return {}
  Object.assign(setStyle,
    columns.gutter ? {
      paddingLeft: `${columns.gutter / 2}px`,
      paddingRight: `${columns.gutter / 2}px`,
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

export function computedGutterStyle(gutter: any, type: string) {
  const setStyle = {}

  if (type === 'row') {
    Object.assign(setStyle, {
      rowGap: `${gutter}px`,
      marginLeft: `-${gutter / 2}px`,
      marginRight: `-${gutter / 2}px`
    })
  }

  return setStyle
}