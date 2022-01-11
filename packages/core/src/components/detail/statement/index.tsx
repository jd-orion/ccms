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

export default class StatementDetail extends DetailField<StatementDetailConfig, IStatementProps, any> implements IDetailField<string> {
  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()
    return (defaults === undefined) ? '' : defaults
  }

  renderComponent = (props: IStatementProps) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现StatementDetail组件。
    </React.Fragment>
  }

  render = () => {
    const props: IStatementProps = {}
    if (this.props.config.statement) {
      props.content = StatementHelper(this.props.config.statement, { data: this.props.data, step: this.props.step })
    }

    return (
      <React.Fragment>
        {this.renderComponent(props)}
      </React.Fragment>
    )
  }
}
