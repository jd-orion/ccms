import React from 'react'
import { NumberRangeColumn } from 'ccms'
import { INumberRangeColumn, NumberRangeColumnConfig } from 'ccms/dist/src/components/tableColumns/numberRange'

export const PropsType = (props: NumberRangeColumnConfig) => {};

export default class NumberRangeColumnComponent extends NumberRangeColumn {
  renderComponent = (props: INumberRangeColumn) => {
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
