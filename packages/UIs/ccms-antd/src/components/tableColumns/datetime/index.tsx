import React from 'react'
import { DatetimeColumn } from 'ccms'
import { IDatetimeColumn } from 'ccms/dist/components/tableColumns/datetime'

export default class DatetimeColumnComponent extends DatetimeColumn {
  renderComponent = (props: IDatetimeColumn) => {
    const { value } = props
    return <>{value}</>
  }
}
