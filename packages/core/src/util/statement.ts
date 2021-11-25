import { set, cloneDeep, template } from "lodash"
import { ParamConfig } from "../interface";
import ParamHelper from "./param";

export interface StatementConfig {
  statement: string
  params: { field: string, data: ParamConfig }[]
}

export default function StatementHelper(config: StatementConfig | undefined, datas: { record?: object, data: object[], step: number }): string {
  if (config === undefined || config.statement === undefined || config.statement === '') {
    return ''
  } else {
    const statementTemplate = template(config.statement)
    let statementParams = {}
    if (config.params) {
      config.params.forEach((param) => {
        if (param.field !== undefined && param.data !== undefined) {
          if (param.field === '') {
            statementParams = ParamHelper(param.data, cloneDeep(datas))
          } else {
            set(statementParams, param.field, ParamHelper(param.data, cloneDeep(datas)))
          }
        }
      })
    }
    
    try {
      const statement = statementTemplate(statementParams)
      return statement
    } catch (e) {
      console.error('模板字符串处理失败。', config.statement)
      return ''
    }
  }
}