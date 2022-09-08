import { lazy } from 'react'
import { TextFieldConfig } from './text'
import { EnumDetailConfig } from './enum'
import { StatementDetailConfig } from './statement'
import { ImageDetailConfig } from './image'
import { CustomDetailConfig } from './custom'
import { GroupFieldConfig } from './group'
import { ImportSubformFieldConfig } from './importSubform'
import { InfoDetailConfig } from './detailInfo'
import { ColorDetailConfig } from './detailColor'
import { TableFieldConfig } from './table'
import { IframeDetailConfig } from './iframe'
import { LinkDetailConfig } from './link'
import { OperationDetailConfig } from './operation'
import { CodeDetailConfig } from './code'

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
  group: lazy(() => import('./group')),
  text: lazy(() => import('./text')),
  import_subform: lazy(() => import('./importSubform')),
  detail_enum: lazy(() => import('./enum')),
  image: lazy(() => import('./image')),
  statement: lazy(() => import('./statement')),
  detail_info: lazy(() => import('./detailInfo')),
  detail_color: lazy(() => import('./detailColor')),
  table: lazy(() => import('./table')),
  code: lazy(() => import('./code')),
  custom: lazy(() => import('./custom')),
  iframe: lazy(() => import('./iframe')),
  link: lazy(() => import('./link')),
  operation: lazy(() => import('./operation'))
}
