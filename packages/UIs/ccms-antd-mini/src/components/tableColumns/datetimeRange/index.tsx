import React from 'react'
import { DatetimeRangeColumn } from 'ccms'
import { IDatetimeRangeColumn } from 'ccms/dist/components/tableColumns/datetimeRange'

export default class DatetimeRangeColumnComponent extends DatetimeRangeColumn {
  renderComponent = (props: IDatetimeRangeColumn) => {
    const { value } = props
    return <>{value}</>
  }
}
