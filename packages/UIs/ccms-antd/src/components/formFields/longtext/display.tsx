import React from 'react'
import { LongTextDisplay } from 'ccms'
import { ILongtextField } from 'ccms/dist/src/components/formFields/longtext/display'

export default class LongTextDisplayComponent extends LongTextDisplay {
  renderComponent = (props: ILongtextField) => {
    const {
      value
    } = props
    return <React.Fragment>{value}</React.Fragment>
  }
}
