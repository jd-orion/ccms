import React from 'react'
import { EnumColumn } from 'ccms'
import { IEnumColumn } from 'ccms/dist/components/tableColumns/enum'
import InterfaceHelper from '../../../util/interface'

export default class EnumColumnComponent extends EnumColumn {
  interfaceHelper = new InterfaceHelper()

  renderComponent = (props: IEnumColumn) => {
    const { value } = props
    return <>{value}</>
  }
}
