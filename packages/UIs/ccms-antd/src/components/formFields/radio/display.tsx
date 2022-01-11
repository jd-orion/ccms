import React from 'react'
import { RadioDisplay } from 'ccms'
import { IRadioField } from 'ccms/dist/src/components/formFields/radio/display'

export default class RadioDisplayComponent extends RadioDisplay {
  renderComponent = (props: IRadioField) => {
    const {
      value,
      options
    } = props
    return <React.Fragment>
      {
        options && options.length > 0 && options.find((item: any) => item.value === value)?.label
      }
    </React.Fragment>
  }
}
