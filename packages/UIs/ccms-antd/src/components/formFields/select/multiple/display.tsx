import React from 'react'
import { SelectMultipleDisplay } from 'ccms'
import { ISelectMultipleField } from 'ccms/dist/components/formFields/select/multiple/display'
import { ISelectFieldOption } from 'ccms/dist/components/formFields/select/common'

export default class SelectMultipleDisplayComponent extends SelectMultipleDisplay {
  renderSelectMultipleComponent = (props: ISelectMultipleField) => {
    const { value, options } = props

    return (
      <>
        {value &&
          value.length > 0 &&
          options &&
          options.length > 0 &&
          value.map((vitem) => options.find((oItem: ISelectFieldOption) => oItem.value === vitem)?.label).join('，')}
      </>
    )
  }
}
