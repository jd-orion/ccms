import React from 'react'
import { FormattedTextColumn } from 'ccms'
import { IFormattedTextColumn } from 'ccms/dist/components/tableColumns/formattedText'
import './index.less'

export default class FormattedTextColumnComponent extends FormattedTextColumn {
  renderComponent = (props: IFormattedTextColumn) => {
    const { text } = props

    return <div className="ccms-table-formatted-text">{text}</div>
  }
}
