import TextField from './text'
import LongTextField from './longtext'
import DescField from './description'
import FormField from './form'
import RadioField from './radio'
import SelectSingleField from './select/single'
import SelectMultipleField from './select/multiple'
import TreeSelectField from './treeSelect'
import ImportSubformField from './importSubform'
import GroupField from './group'
import AnyField from './any'
import NumberField from './number'
import SwitchField from './switch'
import ObjectField from './object'
import HiddenField from './hidden'
import DatetimeField from './datetime'
import DatetimeRangeField from './datetimeRange'
import TabsField from './tabs'
import ColorField from './color'
import CustomField from './custom'

export default {
  text: TextField,
  form: FormField,
  radio: RadioField,
  select_single: SelectSingleField,
  select_multiple: SelectMultipleField,
  longtext: LongTextField,
  desc: DescField,
  tree_select: TreeSelectField,
  import_subform: ImportSubformField,
  group: GroupField,
  any: AnyField,
  number: NumberField,
  switch: SwitchField,
  object: ObjectField,
  hidden: HiddenField,
  datetime: DatetimeField,
  datetimeRange: DatetimeRangeField,
  tabs: TabsField,
  color: ColorField,
  custom: CustomField
}
