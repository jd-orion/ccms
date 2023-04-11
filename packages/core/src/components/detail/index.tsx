import BaseComponents, { DetailBaseFieldConfigs, baseComponentType } from './base'
import GroupField, { GroupFieldConfig } from './group'

/**
 * 详情步骤内详情项配置文件格式定义 - 枚举
 */
export type DetailFieldConfigs = DetailBaseFieldConfigs | GroupFieldConfig

export type componentType = baseComponentType | 'group'

export default {
  ...BaseComponents,
  group: GroupField
}
