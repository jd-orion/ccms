import React from 'react'
import { TextColumn } from 'ccms'
import { ITextColumn } from 'ccms/dist/components/tableColumns/text'

export default class TextColumnComponent extends TextColumn {
  renderComponent = (props: ITextColumn) => {
    const { value } = props
    return <>{value}</>
  }
}
