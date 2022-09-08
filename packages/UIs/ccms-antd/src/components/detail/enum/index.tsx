import React from 'react'
import { DetailEunmField } from 'ccms'
import { IEnumProps } from 'ccms/dist/components/detail/enum'

export default class EnumDetailComponent extends DetailEunmField {
  renderComponent = (props: IEnumProps) => {
    const { value } = props

    return <div>{value}</div>
  }
}
