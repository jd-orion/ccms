import React from 'react'
import { TextColumn } from 'ccms-core'
import { ITextColumn } from 'ccms-core/dist/src/components/tableColumns/text'

export default class TextColumnComponent extends TextColumn {
  renderComponent = (props: ITextColumn) => {
    const {
      value
    } = props
    return (
      <React.Fragment>{value}</React.Fragment>
    )
  }
}