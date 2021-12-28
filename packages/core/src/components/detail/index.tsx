
import TextField, { TextFieldConfig } from './text'

import GroupField, { GroupFieldConfig } from './group'
import ImportSubformField, { ImportSubformFieldConfig } from './importSubform'


/**
 * 详情步骤内详情项配置文件格式定义 - 枚举
 */
export type DetailFieldConfigs =
    TextFieldConfig |
    GroupFieldConfig |
    ImportSubformFieldConfig

export type componentType =
    'text' |
    'group' |
    'import_subform'

export default {
  group: GroupField,
  text: TextField,
  import_subform: ImportSubformField
}
