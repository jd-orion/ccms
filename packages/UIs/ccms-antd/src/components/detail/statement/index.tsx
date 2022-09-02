import React from 'react'
import { DetailStatementField } from 'ccms'
import { IStatementProps } from 'ccms/dist/components/detail/statement'

export default class StatementDetailComponent extends DetailStatementField {
  renderComponent = (props: IStatementProps) => {
    const { content } = props
    return <>{content}</>
  }
}
