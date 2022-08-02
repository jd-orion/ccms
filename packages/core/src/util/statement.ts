import { template } from 'lodash'
import { set } from './produce'
import { ParamConfig } from '../interface'
import ParamHelper from './param'
import { Field } from '../components/formFields/common'

export interface StatementConfig {
  statement: string
  params: { field: string; data: ParamConfig }[]
}

export default function StatementHelper(
  config: StatementConfig | undefined,
  datas: {
    record?: object
    data: object[]
    step: { [field: string]: unknown }
    containerPath: string
    extraContainerPath?: string
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _this?: Field<any, any, any>
): string {
  if (config === undefined || config.statement === undefined || config.statement === '') {
    return ''
  }
  const statementTemplate = template(config.statement)
  let statementParams = {}
  if (config.params) {
    config.params.forEach((param) => {
      if (param.field !== undefined && param.data !== undefined) {
        if (param.field === '') {
          statementParams = ParamHelper(param.data, datas, _this)
        } else {
          statementParams = set(statementParams, param.field, ParamHelper(param.data, datas, _this))
        }
      }
    })
  }

  try {
    const statement = statementTemplate(statementParams)
    return statement
  } catch (e) {
    return ''
  }
}
