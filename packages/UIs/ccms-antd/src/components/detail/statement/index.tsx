import React from 'react'
import { DetailStatementField } from 'ccms'
import { IStatementProps, StatementDetailConfig } from 'ccms/dist/components/detail/statement'

export const PropsType = (props: StatementDetailConfig) => {}

export default class StatementDetailComponent extends DetailStatementField {
  renderComponent = (props: IStatementProps) => {
    const {
      content
    } = props
    return (
      <>{content}</>
    )
  }
}
