import React from 'react'
import { TextDisplay } from 'ccms'
import { ITextField } from 'ccms/dist/src/components/formFields/text/display'

export default class TextDisplayComponent extends TextDisplay {
  renderComponent = (props: ITextField) => {
    const {
      value
    } = props
    return <React.Fragment>{value}</React.Fragment>
  }
}
