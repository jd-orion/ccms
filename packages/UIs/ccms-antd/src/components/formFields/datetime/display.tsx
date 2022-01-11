import React from 'react'
import { DatetimeDisplay } from 'ccms'
import { IDatetimeField } from 'ccms/dist/src/components/formFields/datetime/display'

export default class DatetimeDisplayComponent extends DatetimeDisplay {
  renderComponent = (props: IDatetimeField) => {
    const {
      value,
      format
    } = props
    return (
      <React.Fragment>
        {value ? value.format(format) : ''}
      </React.Fragment>
    )
  }
}
