import React from 'react'
import { TextColumn } from 'ccms'
import { ITextColumn, TextColumnConfig } from 'ccms/dist/src/components/tableColumns/text'
export const PropsType = (props: TextColumnConfig) => {}

export default class TextColumnComponent extends TextColumn {
  renderComponent = (props: ITextColumn) => {
    const {
      value
    } = props

    return (<>
      {value}
    </>
    )
  }
}
