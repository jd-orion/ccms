import React from 'react'
import { FormItemProps } from 'antd'

export function formItemLayout(
  layout: 'horizontal' | 'vertical' | 'inline',
  fieldType: string,
  label: string | undefined
) {
  const formItemLayout: FormItemProps = { labelAlign: 'left' }
  if (label) {
    formItemLayout.labelCol = { span: 24 }
    formItemLayout.wrapperCol = { span: 24 }
  } else {
    formItemLayout.wrapperCol = { span: 24 }
  }
  return formItemLayout
}

export function computedItemStyle(columns: any, layout: string, visitable: boolean) {
  const setStyle = {}
  if (!visitable) {
    Object.assign(setStyle, {
      display: 'none'
    })
  }
  if (!columns) return setStyle
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
    columns.wrap
      ? null
      : Object.assign(setStyle, {
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

export function computedGapStyle(columns: any, type: string) {
  const setStyle = {}
  const gap = (Number(columns?.gap) || 0) / 2
  const rowgap = (Number(columns?.rowGap) || 0) / 2

  if (type === 'row') {
    Object.assign(setStyle, {
      flexFlow: 'row wrap',
      display: 'flex',
      rowGap: `${rowgap}px`,
      marginLeft: `-${gap}px`,
      marginRight: `-${gap}px`
    })
  }

  return setStyle
}

interface FileMsgProps {
  message: string | undefined | null
  fieldType: string
}

export function FiledErrMsg(props: FileMsgProps) {
  const { message, fieldType } = props
  if (message === '' || ['group', 'import_subform'].some((v) => v === fieldType)) {
    return <></>
  }
  return <div style={{ color: 'red' }}>{message}</div>
}
