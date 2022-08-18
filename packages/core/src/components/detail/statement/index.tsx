import React from 'react'
import { DetailField, DetailFieldConfig, IDetailField } from '../common'
import StatementHelper, { StatementConfig } from '../../../util/statement'

export interface StatementDetailConfig extends DetailFieldConfig {
  type: 'statement'
  statement: StatementConfig
}

export interface IStatementProps {
  content?: string
}

export default class StatementDetail
  extends DetailField<StatementDetailConfig, IStatementProps, string>
  implements IDetailField<string>
{
  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()
    return defaults === undefined ? '' : defaults
  }

  renderComponent: (props: IStatementProps) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现StatementDetail组件。</>
  }

  render = () => {
    const props: IStatementProps = {}
    if (this.props.config.statement) {
      props.content = StatementHelper(this.props.config.statement, {
        data: this.props.data,
        step: this.props.step,
        containerPath: this.props.containerPath,
        record: this.props.record
      })
    }

    return <>{this.renderComponent(props)}</>
  }
}
