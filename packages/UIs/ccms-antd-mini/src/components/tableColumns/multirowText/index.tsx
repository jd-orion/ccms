import React from 'react'
import { MultirowTextColumn } from 'ccms'
import { IMultirowColumn } from 'ccms/dist/components/tableColumns/multirowText'

export default class MultirowColumnComponent extends MultirowTextColumn {
  renderComponent = (props: IMultirowColumn) => {
    const { value } = props
    return <>{value}</>
  }
}
