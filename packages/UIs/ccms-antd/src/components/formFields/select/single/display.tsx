import React from 'react'
import { SelectSingleDisplay } from 'ccms'
import { ISelectSingleField } from 'ccms/dist/components/formFields/select/single/display'
import { ISelectFieldOption } from 'ccms/dist/components/formFields/select/common'

export default class SelectSingleDisplayComponent extends SelectSingleDisplay {
  renderSelectSingleComponent = (props: ISelectSingleField) => {
    const { value, options } = props
    return <>{options.find((item: ISelectFieldOption) => item.value === value)?.label}</>
  }
}
