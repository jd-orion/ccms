
import TextField, { TextFieldConfig } from './text'

import { DetailFieldConfig } from './common'
import GroupField, { GroupFieldConfig } from './group'


/**
 * 详情步骤内详情项配置文件格式定义 - 枚举
 */
export type DetailFieldConfigs =
    TextFieldConfig |
    GroupFieldConfig

export type componentType =
    'text' |
    'group'

export default {
  group: GroupField,
  text: TextField
}
