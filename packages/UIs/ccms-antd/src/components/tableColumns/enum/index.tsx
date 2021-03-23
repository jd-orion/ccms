import React from 'react'
import { EnumColumn } from 'ccms'
import { IEnumColumn, EnumColumnConfig } from 'ccms/dist/src/components/tableColumns/enum'
export const PropsType = (props: EnumColumnConfig) => {};

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
