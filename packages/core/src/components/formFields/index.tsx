import { lazy } from 'react'
import { FormFieldConfig } from './form'
import { TextFieldConfig } from './text'
import { RadioFieldConfig } from './radio'
import { ColorFieldConfig } from './color'
import { UploadFieldConfig } from './upload'
import { TreeSelectFieldConfig } from './treeSelect'
import { LongtextFieldConfig } from './longtext'
import { NumberFieldConfig } from './number'
import { DatetimeFieldConfig } from './datetime'
import { DatetimeRangeFieldConfig } from './datetimeRange'
import { SelectSingleFieldConfig } from './select/single'
import { SelectMultipleFieldConfig } from './select/multiple'
import { DescFieldConfig } from './description'
import { ImageUrlFieldConfig } from './imageurl'
import { FieldConfig } from './common'
import { ImportSubformFieldConfig } from './importSubform'
import { GroupFieldConfig } from './group'
import { AnyFieldConfig } from './any'
import { SwitchFieldConfig } from './switch'
// import ObjectField, { ObjectFieldConfig } from './object'
import { TabsFieldConfig } from './tabs'
import { MultipleTextFieldConfig } from './multipleText'
import { CustomFieldConfig } from './custom'
import { CodeFieldConfig } from './code'
import { DiffCodeFieldConfig } from './diffCode'

import { TableFieldConfig } from './table'

export interface HiddenFieldConfig extends FieldConfig {
  type: 'hidden' | 'none'
}

/**
 * 表单项配置文件格式定义 - 枚举
 */
export type FieldConfigs =
  | TextFieldConfig
  | LongtextFieldConfig
  | NumberFieldConfig
  | SelectSingleFieldConfig
  | SelectMultipleFieldConfig
  | SwitchFieldConfig
  | DatetimeFieldConfig
  | DatetimeRangeFieldConfig
  | TreeSelectFieldConfig
  | ColorFieldConfig
  | FormFieldConfig
  | RadioFieldConfig
  | HiddenFieldConfig
  | DescFieldConfig
  | UploadFieldConfig
  | ImageUrlFieldConfig
  | ImportSubformFieldConfig
  | GroupFieldConfig
  | AnyFieldConfig
  // ObjectFieldConfig |
  | TabsFieldConfig
  | MultipleTextFieldConfig
  | CustomFieldConfig
  | CodeFieldConfig
  | DiffCodeFieldConfig
  | TableFieldConfig

export type componentType =
  | 'text'
  | 'form'
  | 'radio'
  | 'longtext'
  | 'number'
  | 'datetime'
  | 'datetimeRange'
  | 'select_single'
  | 'select_multiple'
  | 'hidden'
  | 'none'
  | 'desc'
  | 'tree_select'
  | 'color'
  | 'upload'
  | 'imageurl'
  | 'import_subform'
  | 'group'
  | 'any'
  | 'switch'
  // 'object' |
  | 'tabs'
  | 'multiple_text'
  | 'custom'
  | 'code'
  | 'diffcode'
  | 'table'

export default {
  text: lazy(() => import('./text')),
  radio: lazy(() => import('./radio')),
  form: lazy(() => import('./form')),
  longtext: lazy(() => import('./longtext')),
  number: lazy(() => import('./number')),
  datetime: lazy(() => import('./datetime')),
  datetimeRange: lazy(() => import('./datetimeRange')),
  select_single: lazy(() => import('./select/single')),
  select_multiple: lazy(() => import('./select/multiple')),
  desc: lazy(() => import('./description')),
  tree_select: lazy(() => import('./treeSelect')),
  color: lazy(() => import('./color')),
  upload: lazy(() => import('./upload')),
  imageurl: lazy(() => import('./imageurl')),
  import_subform: lazy(() => import('./importSubform')),
  group: lazy(() => import('./group')),
  any: lazy(() => import('./any')),
  switch: lazy(() => import('./switch')),
  // object: ObjectField,
  hidden: lazy(() => import('./hidden')),
  tabs: lazy(() => import('./tabs')),
  multiple_text: lazy(() => import('./multipleText')),
  custom: lazy(() => import('./custom')),
  code: lazy(() => import('./code')),
  diffcode: lazy(() => import('./diffCode')),
  table: lazy(() => import('./table'))
}

export const display = {
  text: lazy(() => import('./text/display')),
  longtext: lazy(() => import('./longtext/display')),
  form: lazy(() => import('./form/display')),
  radio: lazy(() => import('./radio/display')),
  color: lazy(() => import('./color/display')),
  upload: lazy(() => import('./upload/display')),
  import_subform: lazy(() => import('./importSubform/display')),
  group: lazy(() => import('./group/display')),
  number: lazy(() => import('./number/display')),
  datetime: lazy(() => import('./datetime/display')),
  datetimeRange: lazy(() => import('./datetimeRange/display')),
  select_single: lazy(() => import('./select/single/display')),
  select_multiple: lazy(() => import('./select/multiple/display')),
  switch: lazy(() => import('./switch/display')),
  tabs: lazy(() => import('./tabs/display')),
  multiple_text: lazy(() => import('./multipleText/display')),
  hidden: lazy(() => import('./hidden/display')),
  table: lazy(() => import('./table'))
}
