import React from 'react'
import { NumberColumn } from 'ccms'
import { INumberColumn } from 'ccms/dist/components/tableColumns/number'

export default class NumberColumnComponent extends NumberColumn {
  renderComponent = (props: INumberColumn) => {
    const { value } = props
    return <>{value}</>
  }
}
