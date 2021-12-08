import { set, cloneDeep, template } from "lodash"
import { ParamConfig } from "../interface";
import ParamHelper from "./param";

export interface ConditionConfig {
  /**
   * ！兼容旧版本
   * 判断条件
   */
  statement?: string

  /** 判断条件 */
  template?: string

  /** 判断条件参数 */
  params?: Array<{
    field?: string
    data?: ParamConfig
  }>

  /** 开启调试 */
  debug?: boolean
}

export default function ConditionHelper(condition: ConditionConfig | undefined, datas: { record?: object, data: object[], step: number }): boolean {
  if (condition === undefined || ((condition.statement === undefined || condition.statement === '') && (condition.template === undefined || condition.template === ''))) {
    return true
  } else {
    if (condition.template) {
      const statementTemplate = template(condition.template)
      let statementParams = {}
      if (condition.params) {
        condition.params.forEach((param) => {
          if (param.field !== undefined && param.data !== undefined) {
            const value = ParamHelper(param.data, cloneDeep(datas))
            if (param.field === '') {
              statementParams = value === undefined ? 'undefined' : JSON.stringify(value)
            } else {
              set(statementParams, param.field, value === undefined ? 'undefined' : JSON.stringify(value))
            }
          }
        })
      }

      try {
        const statement = statementTemplate(statementParams)
        try {
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
            console.info('CCMS debug: condition - `' + condition.template + '` => `' + statement + '` => error')
          }
          console.error('表单项展示条件语句执行错误。', condition.template, statement)
          return false
        }
      } catch (e) {
        if (condition.debug) {
          console.info('CCMS debug: condition - `' + condition.template + '` => error')
        }
        console.error('表单项展示条件语句执行错误。', condition.template)
        return false
      }
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
        try {
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
            console.info('CCMS debug: condition - `' + condition.statement + '` => `' + statement + '` => error')
          }
          console.error('表单项展示条件语句执行错误。', condition.statement, statement)
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
}