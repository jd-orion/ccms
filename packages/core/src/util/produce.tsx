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
export function set<T>(current: T, path: string, value?: unknown): T {
  const target = produce<unknown>(current, (draft) => {
    if (path) {
      if (arguments.length === 2) {
        // 移除对象路径的属性 参数改动时同步修改这块
        lodash.unset(draft, path)
      } else {
        return lodash.set(draft as object, path, value)
      }
    }
    return draft
  })
  return target as T
}
/**
 * current指定路径下的数组添加元素
 * @param current
 * @param path
 * @param value
 * @returns
 */
export function push<T>(current: T, path: string, value?: unknown): T {
  const target = produce<unknown>(current, (draft) => {
    const list = lodash.get(draft, path)
    if (!Array.isArray(list)) {
      // 如果指定路径下不是数组类型
      const tempArr: unknown[] = []
      tempArr.push(value)
      lodash.set(draft as object, path, tempArr)
    } else {
      list.push(value)
    }
  })
  return target as T
}

/**
 * current指定路径下的数组删除元素
 * @param current
 * @param path
 * @param index
 * @param count
 * @returns
 */
export function splice<T>(current: T, path: string, index: number, count: number): T {
  const target = produce<unknown>(current, (draft) => {
    const list = lodash.get(draft, path, [])
    list.splice(index, count)
  })
  return target as T
}

/**
 * current指定路径下数组排序
 * @param current
 * @param path
 * @param index
 * @param sortType
 * @returns
 */
export function sort<T>(
  current: T,
  path: string,
  index: number,
  sortType: 'up' | 'down' | 'top' | 'bottom' | number
): T {
  const target = produce<unknown>(current, (draft) => {
    const list = lodash.get(draft, path, [])
    listItemMove(list, index, sortType)
  })
  return target as T
}

/**
 * lodash 递归合并来源对象的自身和继承的可枚举属性到目标对象
 * @param a 目标对象
 * @param b 来源对象
 * @returns
 */
const merge = (a: unknown, b: unknown): unknown => {
  return lodash.assignInWith(a, b, (_a, _b) => {
    if (lodash.isUndefined(_a) && lodash.isArray(_b)) {
      // eslint-disable-next-line no-param-reassign
      _a = []
    }
    if (lodash.isObject(_b)) {
      if (lodash.isArray(_a)) {
        return (merge(_a, _b) as unknown[]).filter((i: unknown) => i !== undefined)
      }
      return merge(_a, _b)
    }
  })
}

export function setValue<T>(current: T, path: string, value: unknown): T {
  const target = produce<unknown>(current, (draft) => {
    if (path === '') {
      if (Object.prototype.toString.call(value) === '[object Object]') {
        // eslint-disable-next-line no-param-reassign
        draft = merge(draft, value)
      } else if (value !== undefined) {
        // eslint-disable-next-line no-param-reassign
        draft = value
      }
    } else {
      const source = lodash.get(draft, path)
      if (
        Object.prototype.toString.call(value) === '[object Object]' &&
        Object.prototype.toString.call(source) === '[object Object]'
      ) {
        lodash.set(draft as object, path, merge(source, value))
      } else {
        lodash.set(draft as object, path, value)
      }
    }
  })
  return target as T
}
