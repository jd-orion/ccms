import React from 'react'
import { SelectMultipleDisplay } from 'ccms'
import { ISelectMultipleField } from 'ccms/dist/src/components/formFields/select/multiple/display'
import { ISelectFieldOption } from 'ccms/dist/src/components/formFields/select/common'

export default class SelectMultipleDisplayComponent extends SelectMultipleDisplay {
  renderSelectMultipleComponent = (props: ISelectMultipleField) => {
    const {
      value,
      options
    } = props

    return <React.Fragment>
      {
        value && value.length > 0 && options && options.length > 0
        && value.map((vitem: any) => options.find((oItem: ISelectFieldOption) => oItem.value === vitem)?.label).join('，')
      }
    </React.Fragment>
  }
}
