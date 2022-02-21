import { set, cloneDeep, template } from 'lodash'
import { ParamConfig } from '../interface'
import ParamHelper from './param'

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

export default function ConditionHelper (condition: ConditionConfig | undefined, datas: { record?: object, data: object[], step: number }): boolean {
  // 条件语句模版
  let conditionTemplate = ''
  // 条件语句模版入参
  let statementParams = {}

  if (condition === undefined || ((condition.statement === undefined || condition.statement === '') && (condition.template === undefined || condition.template === ''))) {
    return true
  } else {
    if (condition.template) {
      conditionTemplate = condition.template
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
    } else {
      // 用于兼容旧版本中的通配符
      // V2新增逻辑段 - 开始
      // const statementTemplate = template(condition.statement)
      // V2新增逻辑段 - 结束
      // V2移除逻辑段 - 开始
      conditionTemplate = condition.statement?.replace(/([^\$])\{/g, '$1${') || ''
      // V2移除逻辑段 - 结束

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
    }

    return execConditionHandler(condition, conditionTemplate, statementParams)
  }
}

// 执行条件语句，返回结果
const execConditionHandler = (condition: ConditionConfig | undefined, conditionTemplate: string, statementParams: object): boolean => {
  try {
    if (Object.values(statementParams).some((param) => param === undefined)) {
      if (condition?.debug) {
        console.info(`CCMS debug: condition ${conditionTemplate} => false`)
      }
      return false
    } else {
      const statement = template(conditionTemplate)(statementParams)

      try {
        const result = eval(statement)
        if (condition?.debug) {
          console.info(`CCMS debug: condition ${statement} => ${result}`)
        }
        return result
      } catch (e) {
        console.error('表单项展示条件语句执行错误。', conditionTemplate, statement)
        return false
      }
    }
  } catch (e) {
    if (condition?.debug) {
      console.info('CCMS debug: condition - `' + conditionTemplate + '` => error')
    }
    console.error('表单项展示条件语句执行错误。', conditionTemplate)
    return false
  }
}
