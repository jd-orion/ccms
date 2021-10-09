import { set, cloneDeep, template } from "lodash"
import { FieldConditionConfig } from "../components/formFields/common";
import ParamHelper from "./param";

export default function ConditionHelper(condition: FieldConditionConfig | undefined, datas: { record?: object, data: object[], step: number }): boolean {
  if (condition === undefined || condition.statement === undefined || condition.statement === '') {
    return true
  } else {
    // 用于兼容旧版本中的通配符
    // V2新增逻辑段 - 开始
    // const statementTemplate = template(condition.statement)
    // V2新增逻辑段 - 结束
    // V2移除逻辑段 - 开始
    const statementPolyfill = condition.statement?.replace(/([^\$])\{/g, '$1${')
    const statementTemplate = template(statementPolyfill)
    // V2移除逻辑段 - 结束
    let statementParams = {}
    if (condition.params) {
      condition.params.forEach((param) => {
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
      const result = eval(statement)
      if (result) {
        if (condition.debug) {
          console.info('CCMS debug: condition - `' + statement + '` => true')
        }
        return true
      } else {
        if (condition.debug) {
          console.info('CCMS debug: condition - `' + statement + '` => false')
        }
        return false
      }
    } catch (e) {
      if (condition.debug) {
        console.info('CCMS debug: condition - `' + condition.statement + '` => error')
      }
      console.error('表单项展示条件语句执行错误。', condition.statement)
      return false
    }
  }
}