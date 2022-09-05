import React from 'react'
import { NumberRangeColumn } from 'ccms'
import { INumberRangeColumn } from 'ccms/dist/components/tableColumns/numberRange'

export default class NumberRangeColumnComponent extends NumberRangeColumn {
  renderComponent = (props: INumberRangeColumn) => {
    const { value } = props
    return <>{value}</>
  }
}
