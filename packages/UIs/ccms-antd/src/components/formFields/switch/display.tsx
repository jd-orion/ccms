import React from 'react'
import { SwitchDisplay } from 'ccms'
import { ISwitchField } from 'ccms/dist/components/formFields/switch/display'

export default class SwitchDisplayComponent extends SwitchDisplay {
  renderComponent = (props: ISwitchField) => {
    const {
      value
    } = props
    return <React.Fragment>{value ? '是' : '否'}</React.Fragment>
  }
}
