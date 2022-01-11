import React from 'react'
import { DetailEunmField } from 'ccms'
import { IEnumProps, EnumDetailConfig } from 'ccms/dist/src/components/detail/enum'

export const PropsType = (props: EnumDetailConfig) => {}

export default class EnumDetailComponent extends DetailEunmField {
  renderComponent = (props: IEnumProps) => {
    const {
      value
    } = props
    
    return (
      <div>{value}</div>
    )
  }
}
