import React from 'react'
import { DatetimeColumn } from 'ccms'
import { IDatetimeColumn, DatetimeColumnConfig } from 'ccms/dist/src/components/tableColumns/datetime'

export const PropsType = (props: DatetimeColumnConfig) => {};

export default class DatetimeColumnComponent extends DatetimeColumn {
  renderComponent = (props: IDatetimeColumn) => {
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
