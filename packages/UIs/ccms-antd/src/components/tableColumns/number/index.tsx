import React from 'react'
import { NumberColumn } from 'ccms'
import { INumberColumn, NumberColumnConfig } from 'ccms/dist/src/components/tableColumns/number'

export const PropsType = (props: NumberColumnConfig) => {};

export default class NumberColumnComponent extends NumberColumn {
  renderComponent = (props: INumberColumn) => {
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
