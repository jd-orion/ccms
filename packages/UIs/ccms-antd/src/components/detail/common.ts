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
  } else if (['form', 'group', 'object', 'import_subform', 'tabs'].includes(fieldType)) {
    if (label) {
      currentFormItemLayout.labelCol = { span: 24 }
    }
    currentFormItemLayout.wrapperCol = { span: 24 }
  } else if (label) {
    currentFormItemLayout.labelCol = { span: 6 }
    currentFormItemLayout.wrapperCol = { span: 18 }
  } else {
    currentFormItemLayout.wrapperCol = { span: 24 }
  }

  return currentFormItemLayout
}

export function computedItemStyle(columns, layout: string) {
  const setStyle = {}
  if (!columns) return {}
  Object.assign(
    setStyle,
    columns.gap
      ? {
          paddingLeft: `${columns.gap / 2}px`,
          paddingRight: `${columns.gap / 2}px`
        }
      : {}
  )
  if (columns.type === 'span') {
    columns.wrap
      ? Object.assign(setStyle, {
          paddingRight: `${100 - 100 / columns.value}%`
        })
      : Object.assign(setStyle, {
          flex: `0 0 ${100 / columns.value}%`,
          maxWidth: `${100 / columns.value}%`
        })
  }
  if (columns.type === 'width') {
    Object.assign(setStyle, {
      flex: `0 0 ${columns.value}`,
      maxWidth: columns.value
    })
  }
  if (layout === 'horizontal') {
    Object.assign(setStyle, {
      flexDirection: 'column'
    })
  }

  return setStyle
}

export function computedGapStyle(columns, type: string) {
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
