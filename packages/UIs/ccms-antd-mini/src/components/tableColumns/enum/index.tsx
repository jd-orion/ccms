import React from 'react'
import { EnumColumn } from 'ccms-core'
import { IEnumColumn } from 'ccms-core/dist/src/components/tableColumns/enum'

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
