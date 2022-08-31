import React from 'react'
import { MultirowTextColumn } from 'ccms'
import { IMultirowColumn, MultirowColumnConfig } from 'ccms/dist/components/tableColumns/multirowText'
export const PropsType = (props: MultirowColumnConfig) => {}

export default class MultirowColumnComponent extends MultirowTextColumn {
  renderComponent = (props: IMultirowColumn) => {
    const {
      value
    } = props
    return (
      <React.Fragment>
        {value}
      </React.Fragment>
    )
  }
}
