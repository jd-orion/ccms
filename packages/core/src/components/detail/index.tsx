import TextField, { TextFieldConfig } from './text'
import EnumDetail, { EnumDetailConfig } from './enum'
import StatementDetail, { StatementDetailConfig } from './statement'
import ImageDetail, { ImageDetailConfig } from './image'
import CustomDetail, { CustomDetailConfig } from './custom'
import GroupField, { GroupFieldConfig } from './group'
import ImportSubformField, { ImportSubformFieldConfig } from './importSubform'
import InfoDetail, { InfoDetailConfig } from './detailInfo'
import ColorDetail, { ColorDetailConfig } from './detailColor'
import TableField, { TableFieldConfig } from './table'
import FrameDetail, { IframeDetailConfig } from './iframe'
import LinkDetail, { LinkDetailConfig } from './link'
import OperationDetail, { OperationDetailConfig } from './operation'
import CodeDetail, { CodeDetailConfig } from './code'

/**
 * 详情步骤内详情项配置文件格式定义 - 枚举
 */
export type DetailFieldConfigs =
  | TextFieldConfig
  | EnumDetailConfig
  | StatementDetailConfig
  | ImageDetailConfig
  | GroupFieldConfig
  | ImportSubformFieldConfig
  | InfoDetailConfig
  | ColorDetailConfig
  | TableFieldConfig
  | CustomDetailConfig
  | IframeDetailConfig
  | LinkDetailConfig
  | OperationDetailConfig
  | CodeDetailConfig

export type componentType =
  | 'text'
  | 'group'
  | 'detail_enum'
  | 'statement'
  | 'image'
  | 'import_subform'
  | 'detail_info'
  | 'detail_color'
  | 'table'
  | 'custom'
  | 'iframe'
  | 'link'
  | 'operation'
  | 'code'

export default {
  group: GroupField,
  text: TextField,
  import_subform: ImportSubformField,
  detail_enum: EnumDetail,
  image: ImageDetail,
  statement: StatementDetail,
  detail_info: InfoDetail,
  detail_color: ColorDetail,
  table: TableField,
  custom: CustomDetail,
  iframe: FrameDetail,
  link: LinkDetail,
  operation: OperationDetail,
  code: CodeDetail
}
