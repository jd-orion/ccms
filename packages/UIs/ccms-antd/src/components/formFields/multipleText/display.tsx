import React from 'react'
import { MultipleTextDisplay } from 'ccms'
import { IMultipleTextField } from 'ccms/dist/components/formFields/multipleText/display'

export default class MultipleTextDisplayComponent extends MultipleTextDisplay {
  renderComponent = (props: IMultipleTextField) => {
    const {
      value
    } = props

    return (
      <React.Fragment>
        {
          value && value.length > 0 && value.join('，')
        }
      </React.Fragment>
    )
  }
}
