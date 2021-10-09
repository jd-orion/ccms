
import FormField, { FormFieldConfig } from './form'
import TextField, { TextFieldConfig } from './text'
import RadioField, { RadioFieldConfig } from './radio'
import ColorField, { ColorFieldConfig } from './color'
import UploadField, { UploadFieldConfig } from './upload'
import TreeSelectField, { TreeSelectFieldConfig } from './treeSelect'
import LongtextField, { LongtextFieldConfig } from './longtext'
import NumberField, { NumberFieldConfig } from './number'
import DatetimeField, { DatetimeFieldConfig } from './datetime'
import DatetimeRangeField, { DatetimeRangeFieldConfig } from './datetimeRange'
import SelectSingleField, { SelectSingleFieldConfig } from './select/single'
import SelectMultipleField, { SelectMultipleFieldConfig } from './select/multiple'
import DescField, { DescFieldConfig } from './description'
import ImageUrlField, { ImageUrlFieldConfig } from './imageurl'
import { FieldConfig } from './common'
import ImportSubformField, { ImportSubformFieldConfig } from './importSubform'
import GroupField, { GroupFieldConfig } from './group'
import AnyField, { AnyFieldConfig } from './any'
import SwitchField, { SwitchFieldConfig } from './switch'
import ObjectField, { ObjectFieldConfig } from './object'
import HiddenField from './hidden'
import TabsField, { TabsFieldConfig } from './tabs'
import MultipleTextField, { MultipleTextFieldConfig } from './multipleText'

export interface HiddenFieldConfig extends FieldConfig {
    type: 'hidden' | 'none'
}

/**
 * 表单项配置文件格式定义 - 枚举
 */
export type FieldConfigs =
    TextFieldConfig |
    LongtextFieldConfig |
    NumberFieldConfig |
    SelectSingleFieldConfig |
    SelectMultipleFieldConfig |
    SwitchFieldConfig |
    DatetimeFieldConfig |
    DatetimeRangeFieldConfig |
    TreeSelectFieldConfig |
    ColorFieldConfig |
    FormFieldConfig |
    RadioFieldConfig |
    HiddenFieldConfig |
    DescFieldConfig |
    UploadFieldConfig |
    ImageUrlFieldConfig |
    ImportSubformFieldConfig |
    GroupFieldConfig |
    AnyFieldConfig |
    ObjectFieldConfig |
    TabsFieldConfig |
    MultipleTextFieldConfig

export type componentType =
    'text' |
    'form' |
    'radio' |
    'longtext' |
    'number' |
    'datetime' |
    'datetimeRange' |
    'select_single' |
    'select_multiple' |
    'hidden' |
    'none' |
    'desc' |
    'tree_select' |
    'color' |
    'upload' |
    'imageurl' |
    'import_subform' |
    'group' |
    'any' |
    'switch' |
    'object' |
    'tabs' |
    'multiple_text'

export default {
  text: TextField,
  radio: RadioField,
  form: FormField,
  longtext: LongtextField,
  number: NumberField,
  datetime: DatetimeField,
  datetimeRange: DatetimeRangeField,
  select_single: SelectSingleField,
  select_multiple: SelectMultipleField,
  desc: DescField,
  tree_select: TreeSelectField,
  color: ColorField,
  upload: UploadField,
  imageurl: ImageUrlField,
  import_subform: ImportSubformField,
  group: GroupField,
  any: AnyField,
  switch: SwitchField,
  object: ObjectField,
  hidden: HiddenField,
  tabs: TabsField,
  multiple_text: MultipleTextField
}
