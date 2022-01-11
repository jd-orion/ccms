import React from 'react'
import { NumberDisplay } from 'ccms'
import { INumberField } from 'ccms/dist/src/components/formFields/number/display'

export default class NumberDisplayComponent extends NumberDisplay {
  renderComponent = (props: INumberField) => {
    const {
      value
    } = props
    return <React.Fragment>{value}</React.Fragment>
  }
}
