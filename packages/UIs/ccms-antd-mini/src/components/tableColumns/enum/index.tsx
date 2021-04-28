import React from 'react'
import { EnumColumn } from 'ccms'
import { IEnumColumn } from 'ccms/dist/src/components/tableColumns/enum'

export default class EnumColumnComponent extends EnumColumn {
  renderComponent = (props: IEnumColumn) => {
    const {
      value
    } = props
    return (
      <React.Fragment>{value}</React.Fragment>
    )
  }
}
