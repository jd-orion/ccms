import React from 'react'
import { DatetimeDisplay } from 'ccms'
import { IDatetimeField } from 'ccms/dist/components/formFields/datetime/display'

export default class DatetimeDisplayComponent extends DatetimeDisplay {
  renderComponent = (props: IDatetimeField) => {
    const { value, format } = props
    return <>{value ? value.format(format) : ''}</>
  }
}
