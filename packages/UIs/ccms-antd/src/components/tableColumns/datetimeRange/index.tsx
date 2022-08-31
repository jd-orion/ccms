import React from 'react'
import { DatetimeRangeColumn } from 'ccms'
import { IDatetimeRangeColumn, DatetimeRangeColumnConfig } from 'ccms/dist/components/tableColumns/datetimeRange'

export const PropsType = (props: DatetimeRangeColumnConfig) => {}

export default class DatetimeRangeColumnComponent extends DatetimeRangeColumn {
  renderComponent = (props: IDatetimeRangeColumn) => {
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
