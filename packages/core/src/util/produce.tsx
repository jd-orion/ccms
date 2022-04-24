import produce, { setAutoFreeze } from 'immer'
import lodash from 'lodash'
import { listItemMove } from './value'

/**
 * setAutoFreeze
 * 默认为true, 防止外部修改，维护数据不可变
 * 为false 可以修改数据源
 * 开发环境打开，生产环境关闭
 */
setAutoFreeze(false)

/**
 * 对应loadsh 的set
 * @param current
 * @param path
 * @param value
 * @returns
 */
export function set(current: any, path?: string, value?: any) {
  const target = produce<any>(current, (draft: any) => {
    if (path) {
      if (arguments.length === 2) {
        // 移除对象路径的属性 参数改动时同步修改这块
        lodash.unset(draft, path)
      } else {
        return lodash.set(draft, path, value)
      }
    }
    return draft
  })
  return target
}
/**
 * current指定路径下的数组添加元素
 * @param current
 * @param path
 * @param value
 * @returns
 */
export const push = (current: any, path = '', value?: any) => {
  const target = produce<any>(current, (draft: any) => {
    const list = lodash.get(draft, path)
    if (!Array.isArray(list)) {
      // 如果指定路径下不是数组类型
      const tempArr: any[] = []
      tempArr.push(value)
      lodash.set(draft, path, tempArr)
    } else {
      list.push(value)
    }
  })
  return target
}

/**
 * current指定路径下的数组删除元素
 * @param current
 * @param path
 * @param index
 * @param count
 * @returns
 */
export const splice = (current: any, path = '', index: number, count: number) => {
  const target = produce<any>(current, (draft: any) => {
    const list = lodash.get(draft, path, [])
    list.splice(index, count)
  })
  return target
}

/**
 * current指定路径下数组排序
 * @param current
 * @param path
 * @param index
 * @param sortType
 * @returns
 */
export const sort = (current: any, path = '', index: number, sortType: 'up' | 'down') => {
  const target = produce<any>(current, (draft: any) => {
    const list = lodash.get(draft, path, [])
    listItemMove(list, index, sortType)
  })
  return target
}

/**
 * lodash 递归合并来源对象的自身和继承的可枚举属性到目标对象
 * @param a 目标对象
 * @param b 来源对象
 * @returns
 */
const merge = (a: any, b: any): any => {
  return lodash.assignInWith(a, b, (a, b) => {
    if (lodash.isUndefined(a) && lodash.isArray(b)) {
      a = []
    }
    if (lodash.isObject(b)) {
      if (lodash.isArray(a)) {
        return merge(a, b).filter((i: any) => i !== undefined)
      }
      return merge(a, b)
    }
  })
}

export const setValue = (obj: any, path = '', value: any) => {
  const target = produce<any>(obj, (draft: any) => {
    if (path === '') {
      if (Object.prototype.toString.call(value) === '[object Object]') {
        draft = merge(draft, value)
      } else if (value !== undefined) {
        draft = value
      }
    } else {
      const source = lodash.get(draft, path)
      if (
        Object.prototype.toString.call(value) === '[object Object]' &&
        Object.prototype.toString.call(source) === '[object Object]'
      ) {
        lodash.set(draft, path, merge(source, value))
      } else {
        lodash.set(draft, path, value)
      }
    }
  })
  return target
}
